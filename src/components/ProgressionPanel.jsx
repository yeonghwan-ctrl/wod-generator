import { useMemo, useState } from 'react'
import { LIFT_BY_ID } from '../data/lifts.js'
import { computeProgression } from '../logic/progression.js'
import { useI18n } from '../i18n.jsx'

export default function ProgressionPanel({ entries, oneRMs, unit, increment, setOneRM }) {
  const { t, tx } = useI18n()
  const [applied, setApplied] = useState(() => new Set())

  const rows = useMemo(
    () => computeProgression({ entries, oneRMs, unit, increment }),
    [entries, oneRMs, unit, increment],
  )

  // 아직 적용하지 않은 제안만 노출(적용 후 즉시 재제안되어 헷갈리는 것 방지)
  const pending = rows.filter((r) => !applied.has(r.liftId))

  const apply = (r) => {
    setOneRM(r.liftId, r.suggested)
    setApplied((s) => new Set(s).add(r.liftId))
  }
  const applyAll = () => {
    pending.forEach((r) => setOneRM(r.liftId, r.suggested))
    setApplied((s) => {
      const next = new Set(s)
      pending.forEach((r) => next.add(r.liftId))
      return next
    })
  }

  const liftLabel = (id) => tx(LIFT_BY_ID[id], 'label') || id

  return (
    <section className="card prog-card">
      <div className="prog-head">
        <div>
          <h3 className="prog-title">{t.progTitle}</h3>
          <p className="prog-desc">{t.progDesc}</p>
        </div>
        {pending.length > 0 && (
          <button className="btn-primary prog-apply-all" onClick={applyAll}>
            {t.progApplyAll}
          </button>
        )}
      </div>

      {pending.length === 0 ? (
        <p className="hint">{t.progNone}</p>
      ) : (
        <ul className="prog-list">
          {pending.map((r) => (
            <li className="prog-row" key={r.liftId}>
              <div className="prog-row-main">
                <span className="prog-lift">{liftLabel(r.liftId)}</span>
                <span className={`prog-reason reason-${r.reasonKey}`}>{t[r.reasonKey]}</span>
              </div>
              <div className="prog-row-nums">
                <span className="prog-from">
                  {r.current || '—'}
                  {r.current ? unit : ''}
                </span>
                <span className="prog-arrow">→</span>
                <span className="prog-to">
                  {r.suggested}
                  {unit}
                </span>
                <span className={`prog-delta ${r.delta > 0 ? 'up' : 'down'}`}>
                  {r.delta > 0 ? '+' : ''}
                  {r.delta}
                </span>
              </div>
              <button className="btn-ghost prog-apply" onClick={() => apply(r)}>
                {t.progApply}
              </button>
            </li>
          ))}
        </ul>
      )}

      {applied.size > 0 && <p className="prog-applied-note">{t.progApplied}</p>}
    </section>
  )
}
