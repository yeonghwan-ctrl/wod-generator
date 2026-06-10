import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n.jsx'
import { useAiCoach } from '../store/useAiCoach.js'
import { buildCoachContext } from '../logic/coachContext.js'

// AI 코치 채팅 화면.
// 사용자의 1RM·설정·최근 기록을 컨텍스트로 서버(aiCoach 함수)에 전달한다.
export default function CoachView({ state, entries }) {
  const { t, lang } = useI18n()
  const { messages, busy, errorKey, remaining, send, clear } = useAiCoach()
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, busy])

  const submit = async (text) => {
    const content = (text ?? input).trim()
    if (!content || busy) return
    setInput('')
    const failed = await send(content, buildCoachContext(state, entries), lang)
    if (failed) setInput(failed) // 실패 시 입력 복원
  }

  const errorText =
    errorKey === 'limit' ? t.coachLimit : errorKey === 'notReady' ? t.coachNotReady : t.coachError

  const chips = [t.coachChip1, t.coachChip2, t.coachChip3]

  return (
    <div className="coach">
      <div className="coach-head">
        <h2>🤖 {t.coachTitle}</h2>
        <div className="coach-head-right">
          {remaining != null && (
            <span className="coach-remaining">
              {t.coachRemaining} {remaining}
            </span>
          )}
          {messages.length > 0 && (
            <button className="coach-clear" onClick={clear}>
              {t.coachClear}
            </button>
          )}
        </div>
      </div>

      <div className="coach-messages">
        {messages.length === 0 && (
          <div className="coach-intro">
            <p>{t.coachIntro}</p>
            <div className="coach-chips">
              {chips.map((c) => (
                <button key={c} className="coach-chip" disabled={busy} onClick={() => submit(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`coach-bubble ${m.role}`}>
            {m.content}
          </div>
        ))}
        {busy && <div className="coach-bubble assistant typing">{t.coachThinking}</div>}
        {errorKey && <p className="coach-error">{errorText}</p>}
        <div ref={bottomRef} />
      </div>

      <form
        className="coach-input"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.coachPlaceholder}
          maxLength={500}
          disabled={busy}
        />
        <button type="submit" disabled={busy || !input.trim()}>
          {t.coachSend}
        </button>
      </form>
      <p className="coach-disclaimer">{t.coachDisclaimer}</p>
    </div>
  )
}
