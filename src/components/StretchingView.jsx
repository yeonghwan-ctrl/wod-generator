import { useState } from 'react'
import { STRETCHES, PHASE_LABEL, PHASE_LABEL_EN, youtubeSearchUrl } from '../data/stretching.js'
import { useI18n } from '../i18n.jsx'

export default function StretchingView() {
  const { t, lang, tx } = useI18n()
  const [phase, setPhase] = useState('pre')
  const list = STRETCHES[phase]
  const phaseLabel = lang === 'en' ? PHASE_LABEL_EN : PHASE_LABEL

  return (
    <div className="stretching">
      <div className="seg-toggle">
        <button className={phase === 'pre' ? 'active' : ''} onClick={() => setPhase('pre')}>
          {t.pre}
        </button>
        <button className={phase === 'post' ? 'active' : ''} onClick={() => setPhase('post')}>
          {t.post}
        </button>
      </div>

      <p className="section-intro">
        {phaseLabel[phase]} · {phase === 'pre' ? t.preIntro : t.postIntro}
      </p>

      <div className="stretch-list">
        {list.map((s) => (
          <div className="card stretch-item" key={s.name}>
            <div className="stretch-head">
              <h3>{tx(s, 'name')}</h3>
              <span className="dose">{tx(s, 'dose')}</span>
            </div>
            <p className="stretch-desc">{tx(s, 'desc')}</p>
            <a
              className="yt-link"
              href={youtubeSearchUrl(tx(s, 'query'))}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.watchYoutube}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
