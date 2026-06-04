import { useMemo, useState } from 'react'
import { useAthlete } from './store/useAthlete.js'
import { useAuth } from './store/useAuth.js'
import { generateProgram } from './logic/generateProgram.js'
import HomeView from './components/HomeView.jsx'
import OneRMForm from './components/OneRMForm.jsx'
import ProgramView from './components/ProgramView.jsx'
import StretchingView from './components/StretchingView.jsx'
import InjuryView from './components/InjuryView.jsx'
import LoginView from './components/LoginView.jsx'

const TABS = [
  { id: 'home', label: '홈' },
  { id: 'input', label: '입력' },
  { id: 'program', label: '프로그램' },
  { id: 'stretching', label: '스트레칭' },
  { id: 'injury', label: '부상예방' },
]

function UserBadge({ user, onLogout }) {
  const initial = (user.displayName || user.email || '?').trim().charAt(0).toUpperCase()
  return (
    <div className="header-user">
      {user.photoURL ? (
        <img className="avatar" src={user.photoURL} alt="" referrerPolicy="no-referrer" />
      ) : (
        <div className="avatar fallback">{initial}</div>
      )}
      <button className="logout-btn" onClick={onLogout}>
        로그아웃
      </button>
    </div>
  )
}

export default function App() {
  const auth = useAuth()
  const { state, update, setOneRM, toggleLift, reset } = useAthlete()
  const [view, setView] = useState('home') // TABS 의 id

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

  // ── 인증 게이트 ──
  if (auth.loading) {
    return (
      <div className="splash">
        <div className="splash-inner">
          <div className="brand-logo">
            <img src="/barbell.svg" alt="" width="34" height="34" />
          </div>
          <p className="muted">불러오는 중…</p>
        </div>
      </div>
    )
  }

  if (!auth.user) {
    return <LoginView auth={auth} />
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <div className="brand-logo">
            <img src="/barbell.svg" alt="" width="26" height="26" />
          </div>
          <div>
            <h1>BoxLift</h1>
            <p className="tagline">1RM 기반 주간 훈련 프로그램</p>
          </div>
          <div className="header-spacer" />
          <UserBadge user={auth.user} onLogout={auth.logout} />
        </div>
        <nav className="tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={view === t.id ? 'active' : ''}
              onClick={() => setView(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
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
          <ProgramView program={program} state={state} onEdit={() => setView('input')} />
        )}
        {view === 'stretching' && <StretchingView />}
        {view === 'injury' && <InjuryView />}
      </main>

      <footer className="app-footer">
        퍼센트 기반 기본 스킴 · 데이터는 이 기기에만 저장됩니다 (localStorage)
      </footer>
    </div>
  )
}
