import { useState } from 'react'
import { STRETCHES, PHASE_LABEL, youtubeSearchUrl } from '../data/stretching.js'

export default function StretchingView() {
  const [phase, setPhase] = useState('pre')
  const list = STRETCHES[phase]

  return (
    <div className="stretching">
      <div className="seg-toggle">
        <button className={phase === 'pre' ? 'active' : ''} onClick={() => setPhase('pre')}>
          운동 전
        </button>
        <button className={phase === 'post' ? 'active' : ''} onClick={() => setPhase('post')}>
          운동 후
        </button>
      </div>

      <p className="section-intro">
        {PHASE_LABEL[phase]} ·{' '}
        {phase === 'pre'
          ? '관절 가동성을 열고 본 운동 패턴을 준비합니다.'
          : '단축된 근육을 늘려 회복을 돕고 부상을 예방합니다.'}
      </p>

      <div className="stretch-list">
        {list.map((s) => (
          <div className="card stretch-item" key={s.name}>
            <div className="stretch-head">
              <h3>{s.name}</h3>
              <span className="dose">{s.dose}</span>
            </div>
            <p className="stretch-desc">{s.desc}</p>
            <a
              className="yt-link"
              href={youtubeSearchUrl(s.query)}
              target="_blank"
              rel="noopener noreferrer"
            >
              ▶ 유튜브에서 영상 보기
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
