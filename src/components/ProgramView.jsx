import { useState } from 'react'
import DayCard from './DayCard.jsx'
import { useI18n } from '../i18n.jsx'

export default function ProgramView({ program, state, onEdit, onLog }) {
  const { t } = useI18n()
  const [activeWeek, setActiveWeek] = useState(0)

  const hasAnyLift = state.selectedLiftIds.length > 0
  if (!hasAnyLift) {
    return (
      <div className="empty-state">
        <p>{t.noLifts}</p>
        <button className="btn-primary" onClick={onEdit}>
          {t.toInput}
        </button>
      </div>
    )
  }

  const week = program.weeks[activeWeek] ?? program.weeks[0]

  return (
    <div className="program">
      <div className="program-banner">
        <button className="btn-ghost banner-edit" onClick={onEdit}>
          {t.edit}
        </button>
        <div className="banner-text">
          <span className="banner-kicker">Linkup</span>
          <h2>{t.cycleSummary(state.cycleWeeks, state.daysPerWeek)}</h2>
          <p>{t.programSub}</p>
        </div>
      </div>

      <div className="week-tabs">
        {program.weeks.map((w, i) => (
          <button
            key={w.weekNo}
            className={i === activeWeek ? 'active' : ''}
            onClick={() => setActiveWeek(i)}
          >
            {t.weekTab(w.weekNo)}
            {w.note && <span className="badge">{w.note === 'deload' ? t.deload : w.note}</span>}
          </button>
        ))}
      </div>

      <div className="days-grid">
        {week.days.map((day) => (
          <DayCard key={day.dayNo} day={day} unit={state.unit || 'kg'} onLog={onLog} />
        ))}
      </div>
    </div>
  )
}
