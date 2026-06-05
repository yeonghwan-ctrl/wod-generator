import { INJURIES, RISK_LABEL, RISK_LABEL_EN } from '../data/injuries.js'
import { useI18n } from '../i18n.jsx'

export default function InjuryView() {
  const { t, lang, tx } = useI18n()
  const riskLabel = lang === 'en' ? RISK_LABEL_EN : RISK_LABEL

  return (
    <div className="injury">
      <p className="section-intro">
        {t.injuryIntro1}
        <strong>{t.injuryIntroStrong}</strong>
        {t.injuryIntro2}
      </p>

      <div className="injury-list">
        {INJURIES.map((it) => (
          <div className={`card injury-card risk-${it.risk}`} key={it.area}>
            <div className="injury-head">
              <h3>{tx(it, 'area')}</h3>
              <span className={`risk-badge risk-${it.risk}`}>{riskLabel[it.risk]}</span>
            </div>

            <div className="injury-lifts">
              {(tx(it, 'lifts') || []).map((l, i) => (
                <span className="chip" key={i}>
                  {l}
                </span>
              ))}
            </div>

            <div className="injury-block">
              <h4>{t.riskSituations}</h4>
              <ul>
                {(tx(it, 'positions') || []).map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            <div className="injury-block">
              <h4>{t.causes}</h4>
              <ul className="cause-list">
                {(tx(it, 'causes') || []).map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="injury-block prevention">
              <h4>{t.prevention}</h4>
              <ul>
                {(tx(it, 'prevention') || []).map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <p className="disclaimer">{t.disclaimer}</p>
    </div>
  )
}
