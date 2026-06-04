import { INJURIES, RISK_LABEL } from '../data/injuries.js'

export default function InjuryView() {
  return (
    <div className="injury">
      <p className="section-intro">
        역도/올림픽 리프팅에서 부위별로 <strong>언제·어떤 포지션에서</strong> 부상 위험이 큰지와
        예방법을 정리했습니다.
      </p>

      <div className="injury-list">
        {INJURIES.map((it) => (
          <div className={`card injury-card risk-${it.risk}`} key={it.area}>
            <div className="injury-head">
              <h3>{it.area}</h3>
              <span className={`risk-badge risk-${it.risk}`}>{RISK_LABEL[it.risk]}</span>
            </div>

            <div className="injury-lifts">
              {it.lifts.map((l) => (
                <span className="chip" key={l}>
                  {l}
                </span>
              ))}
            </div>

            <div className="injury-block">
              <h4>⚠️ 위험 상황 / 포지션</h4>
              <ul>
                {it.positions.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            <div className="injury-block">
              <h4>원인</h4>
              <ul className="cause-list">
                {it.causes.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="injury-block prevention">
              <h4>✅ 예방법</h4>
              <ul>
                {it.prevention.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <p className="disclaimer">
        ※ 일반적인 안전 가이드이며 의학적 진단·치료를 대체하지 않습니다. 통증이 지속되면 전문가와
        상담하세요.
      </p>
    </div>
  )
}
