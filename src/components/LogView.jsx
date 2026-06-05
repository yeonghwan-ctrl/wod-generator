import { useMemo, useState } from 'react'
import { LIFTS, LIFT_BY_ID } from '../data/lifts.js'
import { computePRs, prEntryIds, round1, todayLocal } from '../logic/prs.js'
import { useI18n } from '../i18n.jsx'
import Sparkline from './Sparkline.jsx'
import ProgressionPanel from './ProgressionPanel.jsx'

export default function LogView({ log, state, setOneRM }) {
  const { t, tx } = useI18n()
  const { entries, addEntry, removeEntry } = log
  const unit = state.unit || 'kg'

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ liftId: '', weight: '', reps: '', rpe: '', note: '', date: todayLocal() })
  const [appliedId, setAppliedId] = useState(null)

  const prs = useMemo(() => computePRs(entries), [entries])
  const prIds = useMemo(() => prEntryIds(entries), [entries])
  const prList = useMemo(
    () => LIFTS.map((l) => prs[l.id]).filter(Boolean),
    [prs],
  )

  // 추세: 기록 2개 이상인 종목
  const trendLifts = useMemo(() => {
    const count = {}
    entries.forEach((e) => (count[e.liftId] = (count[e.liftId] || 0) + 1))
    return LIFTS.filter((l) => (count[l.id] || 0) >= 2).map((l) => l.id)
  }, [entries])
  const [trendPick, setTrendPick] = useState('')
  const trendLift = trendLifts.includes(trendPick) ? trendPick : trendLifts[0] || ''
  const trendValues = useMemo(() => {
    if (!trendLift) return []
    return entries
      .filter((e) => e.liftId === trendLift)
      .slice()
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.id < b.id ? -1 : 1))
      .map((e) => round1(e.est1RM))
  }, [entries, trendLift])

  const liftLabel = (id) => tx(LIFT_BY_ID[id], 'label') || id

  const submit = () => {
    const ok = addEntry({ ...form, unit })
    if (ok) {
      setForm({ liftId: '', weight: '', reps: '', rpe: '', note: '', date: todayLocal() })
      setShowForm(false)
    }
  }

  const applyAs1RM = (entry) => {
    setOneRM(entry.liftId, round1(entry.est1RM))
    setAppliedId(entry.liftId)
  }

  return (
    <div className="logview">
      <div className="logview-head">
        <h2>{t.logTitle}</h2>
        <button className="btn-primary log-add-btn" onClick={() => setShowForm((v) => !v)}>
          {showForm ? t.logCancel : `+ ${t.logAdd}`}
        </button>
      </div>

      {showForm && (
        <section className="card log-form">
          <label className="log-field">
            <span>{t.logLift}</span>
            <select
              value={form.liftId}
              onChange={(e) => setForm((f) => ({ ...f, liftId: e.target.value }))}
            >
              <option value="">{t.logSelectLift}</option>
              {LIFTS.map((l) => (
                <option key={l.id} value={l.id}>
                  {tx(l, 'label')}
                </option>
              ))}
            </select>
          </label>
          <div className="log-field-row">
            <label className="log-field">
              <span>{t.logWeight} ({unit})</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                value={form.weight}
                onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
              />
            </label>
            <label className="log-field">
              <span>{t.logReps}</span>
              <input
                type="number"
                inputMode="numeric"
                min="1"
                value={form.reps}
                onChange={(e) => setForm((f) => ({ ...f, reps: e.target.value }))}
              />
            </label>
          </div>
          <div className="log-field-row">
            <label className="log-field">
              <span>{t.logRpe}</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                max="10"
                step="0.5"
                value={form.rpe}
                onChange={(e) => setForm((f) => ({ ...f, rpe: e.target.value }))}
              />
            </label>
            <label className="log-field">
              <span>{t.logDate}</span>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </label>
          </div>
          <label className="log-field">
            <span>{t.logNote}</span>
            <input
              type="text"
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            />
          </label>
          <button className="btn-primary" onClick={submit}>
            {t.logSave}
          </button>
        </section>
      )}

      {/* PR 요약 */}
      <p className="home-section-title">{t.logPrSummary}</p>
      {prList.length === 0 ? (
        <p className="hint">{t.logNoPr}</p>
      ) : (
        <div className="pr-grid">
          {prList.map((e) => (
            <div className="pr-card" key={e.liftId}>
              <div className="pr-lift">{liftLabel(e.liftId)}</div>
              <div className="pr-value">
                <strong>{round1(e.est1RM)}</strong>
                <span className="unit">{e.unit}</span>
              </div>
              <div className="pr-sub">
                {t.logEst1RM} · {e.weight}×{e.reps} · {e.date}
              </div>
              <button
                className="btn-ghost pr-apply"
                onClick={() => applyAs1RM(e)}
                disabled={appliedId === e.liftId}
              >
                {appliedId === e.liftId ? t.logApplied : t.logApply1RM}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 자동 프로그레션 */}
      <ProgressionPanel
        entries={entries}
        oneRMs={state.oneRMs}
        unit={unit}
        increment={state.increment}
        setOneRM={setOneRM}
      />

      {/* 추세 그래프 */}
      {trendLifts.length > 0 && (
        <section className="card trend-card">
          <div className="trend-head">
            <span className="trend-title">{t.logTrend}</span>
            <select value={trendLift} onChange={(e) => setTrendPick(e.target.value)}>
              {trendLifts.map((id) => (
                <option key={id} value={id}>
                  {liftLabel(id)}
                </option>
              ))}
            </select>
          </div>
          <Sparkline values={trendValues} />
          <p className="hint trend-hint">{t.logTrendHint}</p>
        </section>
      )}

      {/* 기록 목록 */}
      <p className="home-section-title">{t.logHistory}</p>
      {entries.length === 0 ? (
        <p className="hint">{t.logNoEntries}</p>
      ) : (
        <ul className="log-list">
          {entries.map((e) => (
            <li className="log-row" key={e.id}>
              <div className="log-row-main">
                <span className="log-row-lift">
                  {liftLabel(e.liftId)}
                  {prIds.has(e.id) && <span className="log-pr-badge">{t.logPr}</span>}
                </span>
                <span className="log-row-sub">
                  {e.weight}
                  {e.unit} × {e.reps}
                  {e.rpe != null ? ` · RPE ${e.rpe}` : ''} · {e.date}
                  {e.note ? ` · ${e.note}` : ''}
                </span>
              </div>
              <div className="log-row-right">
                <span className="log-row-1rm">
                  ≈ {round1(e.est1RM)}
                  {e.unit}
                </span>
                <button
                  className="log-del"
                  onClick={() => removeEntry(e.id)}
                  aria-label={t.logDelete}
                  title={t.logDelete}
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
