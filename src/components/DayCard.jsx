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
