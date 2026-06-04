const MENU = [
  { id: 'program', icon: '📋', title: '프로그램', desc: '주간 훈련 + 워밍업 루틴' },
  { id: 'stretching', icon: '🧘', title: '스트레칭', desc: '운동 전·후 가동성' },
  { id: 'injury', icon: '🛡️', title: '부상예방', desc: '부위별 예방 가이드' },
  { id: 'input', icon: '🏋️', title: '1RM 입력', desc: '기록·설정 수정' },
]

export default function HomeView({ user, state, onNavigate }) {
  const name =
    user?.displayName || (user?.email ? user.email.split('@')[0] : '') || '운동러'
  const rmCount = Object.values(state.oneRMs || {}).filter((v) => Number(v) > 0).length
  const modeLabel = state.mode === 'template' ? 'W2P 자동' : '직접 선택'

  return (
    <div className="home">
      <section className="home-hero">
        <p className="home-hello">반가워요 👋</p>
        <h2 className="home-name">{name}님</h2>
        <button className="home-start" onClick={() => onNavigate('program')}>
          오늘 훈련 바로 시작 →
        </button>
      </section>

      <div className="home-stats">
        <div className="stat-card">
          <div className="stat-value">{state.daysPerWeek}</div>
          <div className="stat-label">주 훈련 횟수</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{state.cycleWeeks}</div>
          <div className="stat-label">사이클(주)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{rmCount}</div>
          <div className="stat-label">입력된 1RM</div>
        </div>
      </div>

      <p className="home-section-title">메뉴 · {modeLabel}</p>
      <div className="menu-grid">
        {MENU.map((m) => (
          <button key={m.id} className="menu-card" onClick={() => onNavigate(m.id)}>
            <span className="menu-icon">{m.icon}</span>
            <h3>{m.title}</h3>
            <p>{m.desc}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
