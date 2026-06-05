import { useEffect, useMemo, useState } from 'react'
import { useAthlete } from './store/useAthlete.js'
import { useWorkoutLog } from './store/useWorkoutLog.js'
import { useAuth, authErrorMessage } from './store/useAuth.js'
import { useI18n } from './i18n.jsx'
import { generateProgram } from './logic/generateProgram.js'
import HomeView from './components/HomeView.jsx'
import OneRMForm from './components/OneRMForm.jsx'
import ProgramView from './components/ProgramView.jsx'
import StretchingView from './components/StretchingView.jsx'
import InjuryView from './components/InjuryView.jsx'
import LogView from './components/LogView.jsx'
import SessionView from './components/SessionView.jsx'
import LoginView from './components/LoginView.jsx'

const TABS = [
  { id: 'home', labelKey: 'tabHome', icon: '🏠' },
  { id: 'input', labelKey: 'tabInput', icon: '🏋️' },
  { id: 'program', labelKey: 'tabProgram', icon: '📋' },
  { id: 'log', labelKey: 'tabLog', icon: '📈' },
  { id: 'stretching', labelKey: 'tabStretching', icon: '🧘' },
  { id: 'injury', labelKey: 'tabInjury', icon: '🛡️' },
]

function UserBadge({ user, onLogout, onDelete, t }) {
  const [open, setOpen] = useState(false)
  const initial = (user.displayName || user.email || '?').trim().charAt(0).toUpperCase()
  return (
    <div className="header-user">
      <button
        className="avatar-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label={t.account}
      >
        {user.photoURL ? (
          <img className="avatar" src={user.photoURL} alt="" referrerPolicy="no-referrer" />
        ) : (
          <div className="avatar fallback">{initial}</div>
        )}
      </button>
      {open && (
        <>
          <div className="acct-backdrop" onClick={() => setOpen(false)} />
          <div className="acct-menu" role="menu">
            <div className="acct-email">{user.email}</div>
            <button
              className="acct-item"
              onClick={() => {
                setOpen(false)
                onLogout()
              }}
            >
              {t.logout}
            </button>
            <a className="acct-item" href="/privacy.html" target="_blank" rel="noopener noreferrer">
              {t.privacy}
            </a>
            <button
              className="acct-item danger"
              onClick={() => {
                setOpen(false)
                onDelete()
              }}
            >
              {t.deleteAccount}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default function App() {
  const { t, toggle: toggleLang } = useI18n()
  const auth = useAuth()
  const { state, update, setOneRM, toggleLift, reset } = useAthlete(auth.user)
  const log = useWorkoutLog(auth.user)
  const [view, setView] = useState('home') // TABS 의 id (+ 'login')
  const [session, setSession] = useState(null) // 진행 중인 세션(요일 객체) 또는 null

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

  // 세션 진행 모드 — 풀스크린 takeover
  if (session) {
    return (
      <SessionView
        day={session}
        unit={state.unit || 'kg'}
        onLog={log.addEntry}
        onClose={() => setSession(null)}
      />
    )
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm(t.deleteConfirm)) return
    try {
      await auth.deleteAccount()
      setView('home')
    } catch (err) {
      window.alert(authErrorMessage(err) || t.deleteFailed)
    }
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
            <UserBadge
              user={auth.user}
              onLogout={auth.logout}
              onDelete={handleDeleteAccount}
              t={t}
            />
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
            onStartSession={setSession}
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
