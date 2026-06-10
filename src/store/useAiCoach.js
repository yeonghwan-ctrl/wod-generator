import { useState, useEffect } from 'react'
import { httpsCallable } from 'firebase/functions'
import { functions } from '../firebase.js'

// AI 코치 채팅 훅.
// - 대화는 localStorage 에 유지 (앱 재시작해도 이어짐)
// - 서버(aiCoach Cloud Function)에는 최근 12턴만 전송
// - 일일 한도/에러는 errorKey 로 구분해 UI 에서 문구 처리
const STORAGE_KEY = 'linkup.coach.v1'
const MAX_TURNS = 12

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function useAiCoach() {
  const [messages, setMessages] = useState(load) // { role: 'user'|'assistant', content }
  const [busy, setBusy] = useState(false)
  const [errorKey, setErrorKey] = useState(null) // 'limit' | 'notReady' | 'generic' | null
  const [remaining, setRemaining] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-50)))
    } catch {
      /* 저장 실패 무시 */
    }
  }, [messages])

  const send = async (text, context, lang) => {
    const content = text.trim()
    if (!content || busy) return
    setErrorKey(null)

    const next = [...messages, { role: 'user', content }]
    setMessages(next)
    setBusy(true)
    try {
      if (!functions) throw Object.assign(new Error('not configured'), { code: 'not-configured' })
      const call = httpsCallable(functions, 'aiCoach')
      const res = await call({ messages: next.slice(-MAX_TURNS), context, lang })
      setMessages((m) => [...m, { role: 'assistant', content: res.data.reply }])
      setRemaining(res.data.remaining)
    } catch (err) {
      const code = err?.code || ''
      if (code.includes('resource-exhausted')) setErrorKey('limit')
      else if (code.includes('not-found') || code === 'not-configured' || code.includes('unavailable'))
        setErrorKey('notReady') // 함수 미배포/미설정
      else setErrorKey('generic')
      // 실패한 사용자 메시지는 입력으로 복구할 수 있도록 대화에서 제거
      setMessages((m) => (m[m.length - 1]?.role === 'user' ? m.slice(0, -1) : m))
      return content // 호출측에서 입력창 복원에 사용
    } finally {
      setBusy(false)
    }
    return null
  }

  const clear = () => {
    setMessages([])
    setErrorKey(null)
  }

  return { messages, busy, errorKey, remaining, send, clear }
}
