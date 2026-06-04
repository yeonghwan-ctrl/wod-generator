import { useState } from 'react'
import { BLOCK_META } from '../data/warmups.js'

function WarmupPanel({ warmup }) {
  const [open, setOpen] = useState(false)
  if (!warmup) return null

  return (
    <div className={`warmup ${open ? 'open' : ''}`}>
      <button className="warmup-toggle" onClick={() => setOpen((v) => !v)}>
        <span className="warmup-title">
          <span className="warmup-emoji">🔥</span> 워밍업
          <span className="warmup-focus">{warmup.focus}</span>
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
                  <span className="wu-block-title">{block.title}</span>
                  {meta.hint && <span className="wu-hint">{meta.hint}</span>}
                </div>
                <ul className="wu-items">
                  {block.items.map((it) => (
                    <li key={it.name}>
                      <span className="wu-name">{it.name}</span>
                      <span className="wu-dose">{it.dose}</span>
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

export default function DayCard({ day, unit = 'kg' }) {
  if (!day.items.length) {
    return (
      <div className="day-card empty">
        <h4>Day {day.dayNo}</h4>
        <p className="muted">휴식 / 컨디셔닝</p>
      </div>
    )
  }

  return (
    <div className="day-card">
      <h4>
        Day {day.dayNo}
        {day.name && <span className="day-focus">{day.name}</span>}
      </h4>

      <WarmupPanel warmup={day.warmup} />

      <ul className="exercise-list">
        {day.items.map((it) => (
          <li key={it.liftId} className={`exercise cat-${it.category}`}>
            <div className="ex-main">
              <span className="ex-name">{it.label}</span>
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
                  {it.estimated && <span className="est" title="기준 종목에서 환산">≈</span>}
                </>
              ) : (
                <span className="muted">체중/RPE</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
