import { useEffect, useMemo, useState } from 'react'
import { useAthlete } from './store/useAthlete.js'
import { useWorkoutLog } from './store/useWorkoutLog.js'
import { useAuth } from './store/useAuth.js'
import { useI18n } from './i18n.jsx'
import { generateProgram } from './logic/generateProgram.js'
import HomeView from './components/HomeView.jsx'
import OneRMForm from './components/OneRMForm.jsx'
import ProgramView from './components/ProgramView.jsx'
import StretchingView from './components/StretchingView.jsx'
import InjuryView from './components/InjuryView.jsx'
import LogView from './components/LogView.jsx'
import LoginView from './components/LoginView.jsx'

const TABS = [
  { id: 'home', labelKey: 'tabHome', icon: '🏠' },
  { id: 'input', labelKey: 'tabInput', icon: '🏋️' },
  { id: 'program', labelKey: 'tabProgram', icon: '📋' },
  { id: 'log', labelKey: 'tabLog', icon: '📈' },
  { id: 'stretching', labelKey: 'tabStretching', icon: '🧘' },
  { id: 'injury', labelKey: 'tabInjury', icon: '🛡️' },
]

function UserBadge({ user, onLogout, t }) {
  const initial = (user.displayName || user.email || '?').trim().charAt(0).toUpperCase()
  return (
    <div className="header-user">
      {user.photoURL ? (
        <img className="avatar" src={user.photoURL} alt="" referrerPolicy="no-referrer" />
      ) : (
        <div className="avatar fallback">{initial}</div>
      )}
      <button className="logout-btn" onClick={onLogout}>
        {t.logout}
      </button>
    </div>
  )
}

export default function App() {
  const { t, toggle: toggleLang } = useI18n()
  const auth = useAuth()
  const { state, update, setOneRM, toggleLift, reset } = useAthlete(auth.user)
  const log = useWorkoutLog(auth.user)
  const [view, setView] = useState('home') // TABS 의 id (+ 'login')

  // 로그인 화면에서 로그인에 성공하면 자동으로 홈으로 복귀
  useEffect(() => {
    if (view === 'login' && auth.user) setView('home')
  }, [view, auth.user])

  const program = useMemo(
    () =>
      generateProgram({
        oneRMs: state.oneRMs,
        daysPerWeek: state.daysPerWeek,
        cycleWeeks: state.cycleWeeks,
        selectedLiftIds: state.selectedLiftIds,
        increment: state.increment,
        mode: state.mode,
      }),
    [state],
  )

  // 로그인은 선택 사항 — 로그인 화면은 헤더 버튼으로 진입(건너뛰기 가능)
  if (view === 'login') {
    return <LoginView auth={auth} onClose={() => setView('home')} />
  }

  const langBtn = (
    <button className="lang-toggle" onClick={toggleLang} aria-label="Change language">
      🌐 {t.langSwitch}
    </button>
  )

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <div className="brand-logo">
            <img src="/barbell.svg" alt="" width="26" height="26" />
          </div>
          <div>
            <h1>Linkup</h1>
            <p className="tagline">{t.tagline}</p>
          </div>
          <div className="header-spacer" />
          {langBtn}
          {auth.user ? (
            <UserBadge user={auth.user} onLogout={auth.logout} t={t} />
          ) : (
            <button className="login-cta" onClick={() => setView('login')}>
              {t.login}
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        {view === 'home' && (
          <HomeView user={auth.user} state={state} onNavigate={setView} />
        )}
        {view === 'input' && (
          <OneRMForm
            state={state}
            update={update}
            setOneRM={setOneRM}
            toggleLift={toggleLift}
            reset={reset}
            onGenerate={() => setView('program')}
          />
        )}
        {view === 'program' && (
          <ProgramView
            program={program}
            state={state}
            onEdit={() => setView('input')}
            onLog={log.addEntry}
          />
        )}
        {view === 'log' && <LogView log={log} state={state} setOneRM={setOneRM} />}
        {view === 'stretching' && <StretchingView />}
        {view === 'injury' && <InjuryView />}
      </main>

      <footer className="app-footer">{t.footer}</footer>

      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={view === tab.id ? 'active' : ''}
              onClick={() => setView(tab.id)}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span className="nav-label">{t[tab.labelKey]}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
