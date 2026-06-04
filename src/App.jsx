import { useMemo, useState } from 'react'
import { useAthlete } from './store/useAthlete.js'
import { generateProgram } from './logic/generateProgram.js'
import OneRMForm from './components/OneRMForm.jsx'
import ProgramView from './components/ProgramView.jsx'
import StretchingView from './components/StretchingView.jsx'
import InjuryView from './components/InjuryView.jsx'

const TABS = [
  { id: 'input', label: '입력' },
  { id: 'program', label: '프로그램' },
  { id: 'stretching', label: '스트레칭' },
  { id: 'injury', label: '부상예방' },
]

export default function App() {
  const { state, update, setOneRM, toggleLift, reset } = useAthlete()
  const [view, setView] = useState('input') // TABS 의 id

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

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <img src="/barbell.svg" alt="" width="28" height="28" />
          <div>
            <h1>BoxLift</h1>
            <p className="tagline">1RM 기반 주간 훈련 프로그램</p>
          </div>
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
