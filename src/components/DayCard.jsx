import { useState } from 'react'
import { BLOCK_META } from '../data/warmups.js'
import { useI18n } from '../i18n.jsx'

function WarmupPanel({ warmup }) {
  const { t, tx } = useI18n()
  const [open, setOpen] = useState(false)
  if (!warmup) return null

  return (
    <div className={`warmup ${open ? 'open' : ''}`}>
      <button className="warmup-toggle" onClick={() => setOpen((v) => !v)}>
        <span className="warmup-title">
          <span className="warmup-emoji">🔥</span> {t.warmup}
          <span className="warmup-focus">{tx(warmup, 'focus')}</span>
        </span>
        <span className="warmup-arrow">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="warmup-body">
          {warmup.blocks.map((block) => {
            const meta = BLOCK_META[block.key] || {}
            return (
              <div className={`wu-block wu-${block.key}`} key={block.key}>
                <div className="wu-block-head">
                  <span className="wu-icon">{meta.icon}</span>
                  <span className="wu-block-title">{tx(block, 'title')}</span>
                  {meta.hint && <span className="wu-hint">{tx(meta, 'hint')}</span>}
                </div>
                <ul className="wu-items">
                  {block.items.map((it) => (
                    <li key={it.name}>
                      <span className="wu-name">{tx(it, 'name')}</span>
                      <span className="wu-dose">{tx(it, 'dose')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// 운동 한 종목 + 그 자리에서 빠른 기록(처방값 프리필)
function ExerciseRow({ it, unit, onLog }) {
  const { t, tx } = useI18n()
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)
  const [weight, setWeight] = useState(it.weight ?? '')
  const [reps, setReps] = useState(it.reps ?? '')

  const save = () => {
    const ok = onLog?.({ liftId: it.liftId, weight, reps, unit })
    if (ok) {
      setDone(true)
      setOpen(false)
      setTimeout(() => setDone(false), 1500)
    }
  }

  return (
    <li className={`exercise cat-${it.category}`}>
      <div className="ex-row">
        <div className="ex-main">
          <span className="ex-name">{tx(it, 'label')}</span>
          <span className="ex-scheme">
            {it.sets} × {it.reps}
            {it.percent != null && <span className="ex-pct"> @ {it.percent}%</span>}
          </span>
        </div>
        <div className="ex-weight">
          {it.weight != null ? (
            <>
              <strong>{it.weight}</strong>
              <span className="unit">{unit}</span>
              {it.estimated && <span className="est" title={t.estTitle}>≈</span>}
            </>
          ) : (
            <span className="muted">{t.bwRpe}</span>
          )}
        </div>
        {onLog && (
          <button
            className={`ex-log-btn ${done ? 'done' : ''}`}
            onClick={() => {
              setWeight(it.weight ?? '')
              setReps(it.reps ?? '')
              setOpen((v) => !v)
            }}
            title={t.logBtn}
          >
            {done ? '✓' : open ? '×' : '＋'}
          </button>
        )}
      </div>

      {open && (
        <div className="quick-log">
          <label>
            <span>{t.logWeight} ({unit})</span>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </label>
          <label>
            <span>{t.logReps}</span>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
            />
          </label>
          <button className="btn-primary quick-log-save" onClick={save}>
            {t.logSave}
          </button>
        </div>
      )}
    </li>
  )
}

export default function DayCard({ day, unit = 'kg', onLog }) {
  const { t, tx } = useI18n()
  if (!day.items.length) {
    return (
      <div className="day-card empty">
        <h4>{t.day(day.dayNo)}</h4>
        <p className="muted">{t.rest}</p>
      </div>
    )
  }

  return (
    <div className="day-card">
      <h4>
        {t.day(day.dayNo)}
        {day.name && <span className="day-focus">{tx(day, 'name')}</span>}
      </h4>

      <WarmupPanel warmup={day.warmup} />

      <ul className="exercise-list">
        {day.items.map((it) => (
          <ExerciseRow key={it.liftId} it={it} unit={unit} onLog={onLog} />
        ))}
      </ul>
    </div>
  )
}
