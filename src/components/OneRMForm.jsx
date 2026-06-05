import { LIFTS, LIFT_BY_ID, CATEGORY_LABEL, CATEGORY_LABEL_EN, CATEGORY_ORDER, PRIMARY_LIFTS } from '../data/lifts.js'
import { getWeeklySplit, SESSIONS } from '../data/templates.js'
import { useI18n } from '../i18n.jsx'

const DAYS_OPTIONS = [2, 3, 4, 5, 6]
const WEEKS_OPTIONS = [3, 4, 5, 6, 8]

// 단위별 반올림 옵션과 기본값 (lb 는 원판 조합상 5lb 단위가 표준)
export const UNITS = {
  lb: { label: 'lb', increments: [2.5, 5, 10], default: 5, step: 5 },
  kg: { label: 'kg', increments: [1, 2.5, 5], default: 2.5, step: 2.5 },
}

export default function OneRMForm({ state, update, setOneRM, toggleLift, reset, onGenerate }) {
  const { t, lang, tx } = useI18n()
  const unitCfg = UNITS[state.unit] || UNITS.lb
  const isTemplate = state.mode === 'template'
  const catLabel = lang === 'en' ? CATEGORY_LABEL_EN : CATEGORY_LABEL

  // 단위 변경: 반올림 단위를 새 단위의 기본값으로 맞춘다.
  const changeUnit = (unit) => update({ unit, increment: (UNITS[unit] || UNITS.lb).default })

  // 종목 한 줄(1RM 입력) 렌더링
  const renderRmInput = (lift) => (
    <div className="rm-input">
      <input
        type="number"
        inputMode="decimal"
        min="0"
        step={unitCfg.step}
        placeholder={lift.percentBasisOf ? t.autoConvert : '1RM'}
        value={state.oneRMs[lift.id] ?? ''}
        onChange={(e) => setOneRM(lift.id, e.target.value)}
      />
      <span className="unit">{unitCfg.label}</span>
    </div>
  )

  return (
    <div className="form">
      {/* ── 프로그램 방식 토글 ── */}
      <section className="card">
        <h2>{t.programMode}</h2>
        <div className="mode-toggle">
          <button
            className={isTemplate ? 'active' : ''}
            onClick={() => update({ mode: 'template' })}
          >
            {t.autoSetup}
            <small>{t.autoSetupDesc}</small>
          </button>
          <button
            className={!isTemplate ? 'active' : ''}
            onClick={() => update({ mode: 'custom' })}
          >
            {t.customSetup}
            <small>{t.customSetupDesc}</small>
          </button>
        </div>
      </section>

      {/* ── 훈련 설정 ── */}
      <section className="card settings">
        <h2>{t.trainingSettings}</h2>
        <div className="settings-grid">
          <label>
            <span>{t.daysPerWeek}</span>
            <select
              value={state.daysPerWeek}
              onChange={(e) => update({ daysPerWeek: Number(e.target.value) })}
            >
              {DAYS_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {t.daysOpt(d)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{t.cycleLength}</span>
            <select
              value={state.cycleWeeks}
              onChange={(e) => update({ cycleWeeks: Number(e.target.value) })}
            >
              {WEEKS_OPTIONS.map((w) => (
                <option key={w} value={w}>
                  {t.weeksOpt(w)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{t.weightUnit}</span>
            <select value={state.unit} onChange={(e) => changeUnit(e.target.value)}>
              <option value="lb">{t.unitLb}</option>
              <option value="kg">{t.unitKg}</option>
            </select>
          </label>
          <label>
            <span>{t.weightRounding}</span>
            <select
              value={state.increment}
              onChange={(e) => update({ increment: Number(e.target.value) })}
            >
              {unitCfg.increments.map((i) => (
                <option key={i} value={i}>
                  {t.incrementOpt(i, unitCfg.label)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {isTemplate ? (
        <>
          {/* 템플릿 모드: 주 종목 1RM만 입력 */}
          <section className="card">
            <h2>{t.mainLiftRm}</h2>
            <p className="hint" style={{ marginTop: 0 }}>
              {t.mainLiftHint}
            </p>
            <div className="lift-list">
              {PRIMARY_LIFTS.map((lift) => (
                <div className="lift-row selected" key={lift.id}>
                  <span className="lift-name">{tx(lift, 'label')}</span>
                  {renderRmInput(lift)}
                </div>
              ))}
            </div>
          </section>

          {/* 주간 구성 미리보기 */}
          <section className="card">
            <h2>{t.weeklySplit(state.daysPerWeek)}</h2>
            <div className="split-preview">
              {getWeeklySplit(state.daysPerWeek).map((sid, i) => (
                <div className="split-day" key={sid + i}>
                  <div className="split-day-head">
                    {t.day(i + 1)} · {tx(SESSIONS[sid], 'name')}
                  </div>
                  <div className="split-day-lifts">
                    {SESSIONS[sid].lifts.map((id) => tx(LIFT_BY_ID[id], 'label')).join(' · ')}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        /* 커스텀 모드: 카테고리별 종목 선택 + 1RM */
        CATEGORY_ORDER.map((cat) => {
          const lifts = LIFTS.filter((l) => l.category === cat)
          return (
            <section className="card" key={cat}>
              <h2>{catLabel[cat]}</h2>
              <div className="lift-list">
                {lifts.map((lift) => {
                  const selected = state.selectedLiftIds.includes(lift.id)
                  const needsRM = cat !== 'accessory'
                  return (
                    <div className={`lift-row ${selected ? 'selected' : ''}`} key={lift.id}>
                      <label className="lift-check">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleLift(lift.id)}
                        />
                        <span className="lift-name">{tx(lift, 'label')}</span>
                      </label>
                      {needsRM ? (
                        renderRmInput(lift)
                      ) : (
                        <span className="rm-input muted">{t.bwRpe}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })
      )}

      <div className="form-actions">
        <button className="btn-ghost" onClick={reset}>
          {t.reset}
        </button>
        <button className="btn-primary" onClick={onGenerate}>
          {t.generate}
        </button>
      </div>
      <p className="hint">{t.formHint}</p>
    </div>
  )
}
