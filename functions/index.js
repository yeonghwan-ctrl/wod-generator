// Linkup AI 코치 — Cloud Functions (v2 onCall)
// Anthropic API 키를 클라이언트에 노출하지 않기 위한 서버 프록시.
// 일일 사용량 제한을 서버에서 강제한다. (추후 Pro 도입 시 DAILY_LIMIT 블록만 교체)
const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { defineSecret } = require('firebase-functions/params')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore, FieldValue } = require('firebase-admin/firestore')
const Anthropic = require('@anthropic-ai/sdk')

initializeApp()
const db = getFirestore()

const ANTHROPIC_API_KEY = defineSecret('ANTHROPIC_API_KEY')

const DAILY_LIMIT = 10 // ※ Pro 도입 시: users/{uid}.pro === true 면 무제한(또는 상향), 아니면 차단으로 교체
const MAX_TURNS = 12 // 서버로 받는 최대 대화 턴 수
const MAX_CHARS = 2000 // 메시지당 최대 길이

// 한국 시간 기준 오늘 날짜 (사용량 리셋 기준)
function todayKST() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

// 일일 사용량 카운트 — 한도 초과 시 HttpsError, 아니면 남은 횟수 반환
async function consumeQuota(uid) {
  const ref = db.collection('aiUsage').doc(uid)
  const today = todayKST()
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref)
    const data = snap.exists ? snap.data() : null
    const count = data && data.date === today ? data.count : 0
    if (count >= DAILY_LIMIT) {
      throw new HttpsError('resource-exhausted', 'daily-limit')
    }
    tx.set(ref, { date: today, count: count + 1, updatedAt: FieldValue.serverTimestamp() })
    return DAILY_LIMIT - (count + 1)
  })
}

function buildSystemPrompt(context, lang) {
  const c = context || {}
  const lines = [
    'You are "Linkup Coach", an experienced strength & weightlifting coach inside the Linkup training app.',
    'The app generates weekly training programs from the athlete\'s 1RM (one-rep max) values.',
    '',
    'Athlete data (from the app):',
    `- 1RMs: ${c.oneRMs || 'not set'}`,
    `- Unit: ${c.unit || 'kg'}`,
    `- Days per week: ${c.daysPerWeek || '-'}, cycle weeks: ${c.cycleWeeks || '-'}, mode: ${c.mode || '-'}`,
    `- Recent workout log (latest first): ${c.recentLogs || 'none'}`,
    '',
    'Guidelines:',
    '- Give specific, actionable advice grounded in the athlete data above (percentages of 1RM, set/rep adjustments, RPE).',
    '- If the athlete says a weight feels too heavy or too light today, suggest a concrete adjustment (e.g. drop to a lower % of 1RM, reduce sets) and briefly say why.',
    '- Keep answers short: 3-6 sentences. No markdown headings. Plain text, line breaks allowed.',
    '- You are not a doctor. Never diagnose. If the athlete mentions pain or injury, advise stopping the painful movement and seeing a professional.',
    `- Always reply in ${lang === 'en' ? 'English' : 'Korean'}.`,
  ]
  return lines.join('\n')
}

// 클라이언트가 보낸 대화 기록 검증/정리
function sanitizeMessages(raw) {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new HttpsError('invalid-argument', 'messages required')
  }
  const messages = raw
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))
  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
    throw new HttpsError('invalid-argument', 'last message must be from user')
  }
  // 첫 메시지는 user여야 함 (Anthropic API 요구사항)
  while (messages.length && messages[0].role !== 'user') messages.shift()
  return messages
}

exports.aiCoach = onCall(
  { region: 'asia-northeast3', secrets: [ANTHROPIC_API_KEY], cors: true },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'login required')
    }

    const messages = sanitizeMessages(request.data?.messages)
    const lang = request.data?.lang === 'en' ? 'en' : 'ko'
    const remaining = await consumeQuota(request.auth.uid)

    const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY.value() })
    let response
    try {
      response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        thinking: { type: 'disabled' },
        output_config: { effort: 'low' },
        system: buildSystemPrompt(request.data?.context, lang),
        messages,
      })
    } catch (err) {
      console.error('Anthropic API error:', err?.status, err?.message)
      throw new HttpsError('internal', 'ai-error')
    }

    const text = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')

    return { reply: text, remaining }
  },
)
