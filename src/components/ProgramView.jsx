import { useState } from 'react'
import DayCard from './DayCard.jsx'

export default function ProgramView({ program, state, onEdit }) {
  const [activeWeek, setActiveWeek] = useState(0)

  const hasAnyLift = state.selectedLiftIds.length > 0
  if (!hasAnyLift) {
    return (
      <div className="empty-state">
        <p>선택된 종목이 없습니다.</p>
        <button className="btn-primary" onClick={onEdit}>
          입력 화면으로
        </button>
      </div>
    )
  }

  const week = program.weeks[activeWeek] ?? program.weeks[0]

  return (
    <div className="program">
      <div className="program-banner">
        <button className="btn-ghost banner-edit" onClick={onEdit}>
          ← 수정
        </button>
        <div className="banner-text">
          <span className="banner-kicker">Work to PR</span>
          <h2>
            {state.cycleWeeks}주 사이클 · 주 {state.daysPerWeek}회
          </h2>
          <p>1RM 대비 퍼센트 기반 프로그램</p>
        </div>
      </div>

      <div className="week-tabs">
        {program.weeks.map((w, i) => (
          <button
            key={w.weekNo}
            className={i === activeWeek ? 'active' : ''}
            onClick={() => setActiveWeek(i)}
          >
            {w.weekNo}주차{w.note && <span className="badge">{w.note}</span>}
          </button>
        ))}
      </div>

      <div className="days-grid">
        {week.days.map((day) => (
          <DayCard key={day.dayNo} day={day} unit={state.unit || 'kg'} />
        ))}
      </div>
    </div>
  )
}
