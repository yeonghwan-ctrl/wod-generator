import { useI18n } from '../i18n.jsx'

const MENU = [
  { id: 'program', icon: '📋', titleKey: 'menuProgram', descKey: 'menuProgramDesc' },
  { id: 'coach', icon: '🤖', titleKey: 'menuCoach', descKey: 'menuCoachDesc' },
  { id: 'log', icon: '📈', titleKey: 'menuLog', descKey: 'menuLogDesc' },
  { id: 'stretching', icon: '🧘', titleKey: 'menuStretching', descKey: 'menuStretchingDesc' },
  { id: 'injury', icon: '🛡️', titleKey: 'menuInjury', descKey: 'menuInjuryDesc' },
  { id: 'input', icon: '🏋️', titleKey: 'menuInput', descKey: 'menuInputDesc' },
]

export default function HomeView({ user, state, onNavigate }) {
  const { t } = useI18n()
  const name =
    user?.displayName || (user?.email ? user.email.split('@')[0] : '') || t.defaultName
  const rmCount = Object.values(state.oneRMs || {}).filter((v) => Number(v) > 0).length
  const modeLabel = state.mode === 'template' ? t.modeAuto : t.modeCustom

  return (
    <div className="home">
      <section className="home-hero">
        <p className="home-hello">{t.hello}</p>
        <h2 className="home-name">
          {name}
          {t.nameSuffix}
        </h2>
        <button className="home-start" onClick={() => onNavigate('program')}>
          {t.startToday}
        </button>
      </section>

      <div className="home-stats">
        <div className="stat-card">
          <div className="stat-value">{state.daysPerWeek}</div>
          <div className="stat-label">{t.statDays}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{state.cycleWeeks}</div>
          <div className="stat-label">{t.statCycle}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{rmCount}</div>
          <div className="stat-label">{t.statRm}</div>
        </div>
      </div>

      <p className="home-section-title">
        {t.menu} · {modeLabel}
      </p>
      <div className="menu-grid">
        {MENU.map((m) => (
          <button key={m.id} className="menu-card" onClick={() => onNavigate(m.id)}>
            <span className="menu-icon">{m.icon}</span>
            <h3>{t[m.titleKey]}</h3>
            <p>{t[m.descKey]}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
