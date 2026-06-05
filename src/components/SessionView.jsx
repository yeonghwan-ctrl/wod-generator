import { useEffect, useMemo, useRef, useState } from 'react'
import { LIFT_BY_ID } from '../data/lifts.js'
import { liftEmbedUrl, liftVideoUrl } from '../logic/videoLinks.js'
import { useI18n } from '../i18n.jsx'

const STORAGE = 'linkup.session.v1'
const PRESETS = [60, 90, 120, 180]

function sessionKey(day) {
  return `${day.dayNo}|${day.name || ''}|${day.items
    .map((i) => `${i.liftId}:${i.weight ?? ''}:${i.sets}`)
    .join(',')}`
}

function loadChecks(key, items) {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE) || 'null')
    if (raw && raw.key === key && Array.isArray(raw.checks)) return raw.checks
  } catch {
    /* ignore */
  }
  return items.map((i) => Array.from({ length: i.sets || 0 }, () => false))
}

function fmt(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

// 간단한 비프음 (자산 없이 Web Audio)
function beep() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45)
    osc.start()
    osc.stop(ctx.currentTime + 0.5)
    osc.onended = () => ctx.close()
  } catch {
    /* ignore */
  }
}

export default function SessionView({ day, unit = 'kg', onClose, onLog }) {
  const { t, tx, lang } = useI18n()
  const items = day.items || []
  const key = useMemo(() => sessionKey(day), [day])

  const [checks, setChecks] = useState(() => loadChecks(key, items))
  const [logged, setLogged] = useState(() => new Set())
  const [openVideo, setOpenVideo] = useState(null) // 자세 영상 펼친 종목 liftId
  const [restTotal, setRestTotal] = useState(90)
  const [restLeft, setRestLeft] = useState(90)
  const [running, setRunning] = useState(false)
  const restTotalRef = useRef(restTotal)
  restTotalRef.current = restTotal

  // 체크 상태 영속(새로고침 대비)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify({ key, checks }))
    } catch {
      /* ignore */
    }
  }, [key, checks])

  // 카운트다운
  useEffect(() => {
    if (!running) return undefined
    if (restLeft <= 0) {
      beep()
      setRunning(false)
      return undefined
    }
    const id = setTimeout(() => setRestLeft((s) => s - 1), 1000)
    return () => clearTimeout(id)
  }, [running, restLeft])

  const totalSets = items.reduce((a, it) => a + (it.sets || 0), 0)
  const doneSets = checks.reduce((a, row) => a + row.filter(Boolean).length, 0)
  const allDone = totalSets > 0 && doneSets === totalSets

  const toggleSet = (ei, si) => {
    setChecks((prev) => {
      const next = prev.map((row) => row.slice())
      const turningOn = !next[ei][si]
      next[ei][si] = turningOn
      if (turningOn) {
        // 세트 완료 → 휴식 타이머 자동 시작
        setRestLeft(restTotalRef.current)
        setRunning(true)
      }
      return next
    })
  }

  const selectPreset = (sec) => {
    setRestTotal(sec)
    setRestLeft(sec)
    setRunning(false)
  }

  const toggleTimer = () => {
    if (restLeft <= 0) setRestLeft(restTotal)
    setRunning((r) => !r)
  }

  const resetTimer = () => {
    setRestLeft(restTotal)
    setRunning(false)
  }

  const logExercise = (it) => {
    if (it.weight == null) return
    const ok = onLog?.({ liftId: it.liftId, weight: it.weight, reps: it.reps, unit })
    if (ok) setLogged((s) => new Set(s).add(it.liftId))
  }

  return (
    <div className="session">
      <header className="session-header">
        <button className="session-close" onClick={onClose} aria-label={t.sessClose}>
          ✕
        </button>
        <div className="session-title">
          <h2>{day.name ? tx(day, 'name') : t.day(day.dayNo)}</h2>
          <span className="session-progress-text">
            {t.sessSetsDone(doneSets, totalSets)}
          </span>
        </div>
      </header>

      <div className="session-progress-bar">
        <div
          className="session-progress-fill"
          style={{ width: totalSets ? `${(doneSets / totalSets) * 100}%` : '0%' }}
        />
      </div>

      <div className="session-body">
        {allDone && <p className="session-alldone">{t.sessAllDone}</p>}

        {items.map((it, ei) => {
          const label = tx(it, 'label')
          const videoId = LIFT_BY_ID[it.liftId]?.video
          const isVideoOpen = openVideo === it.liftId
          return (
            <div className={`session-ex cat-${it.category}`} key={it.liftId}>
              <div className="session-ex-head">
                <div className="session-ex-info">
                  <span className="session-ex-name">{label}</span>
                  <span className="session-ex-scheme">
                    {it.sets} × {it.reps}
                    {it.percent != null && <span className="ex-pct"> @ {it.percent}%</span>}
                    {it.weight != null && (
                      <strong className="session-ex-weight">
                        {' '}
                        · {it.weight}
                        {unit}
                      </strong>
                    )}
                  </span>
                  {videoId ? (
                    <button
                      className={`session-ex-video ${isVideoOpen ? 'open' : ''}`}
                      onClick={() => setOpenVideo((o) => (o === it.liftId ? null : it.liftId))}
                    >
                      {isVideoOpen ? '▾' : '▶'} {t.formVideo}
                    </button>
                  ) : (
                    <a
                      className="session-ex-video"
                      href={liftVideoUrl(label, lang)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ▶ {t.formVideo}
                    </a>
                  )}
                </div>
                {it.weight != null && (
                  <button
                    className={`session-log-btn ${logged.has(it.liftId) ? 'done' : ''}`}
                    onClick={() => logExercise(it)}
                    disabled={logged.has(it.liftId)}
                  >
                    {logged.has(it.liftId) ? t.sessLogged : t.logBtn}
                  </button>
                )}
              </div>

              {isVideoOpen && videoId && (
                <div className="session-video">
                  <iframe
                    src={liftEmbedUrl(videoId)}
                    title={label}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              <div className="set-pills">
                {Array.from({ length: it.sets || 0 }, (_, si) => (
                  <button
                    key={si}
                    className={`set-pill ${checks[ei]?.[si] ? 'done' : ''}`}
                    onClick={() => toggleSet(ei, si)}
                  >
                    {si + 1}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* 휴식 타이머 (하단 고정) */}
      <div className="rest-timer">
        <div className="rest-presets">
          {PRESETS.map((sec) => (
            <button
              key={sec}
              className={restTotal === sec ? 'active' : ''}
              onClick={() => selectPreset(sec)}
            >
              {sec}s
            </button>
          ))}
        </div>
        <div className="rest-main">
          <span className={`rest-time ${running ? 'running' : ''}`}>{fmt(restLeft)}</span>
          <button className="rest-ctrl" onClick={toggleTimer}>
            {running ? t.sessPause : t.sessStart}
          </button>
          <button className="rest-ctrl ghost" onClick={resetTimer}>
            {t.sessReset}
          </button>
        </div>
      </div>

      <div className="session-footer">
        <button className="btn-primary session-finish" onClick={onClose}>
          {t.sessFinish}
        </button>
      </div>
    </div>
  )
}
