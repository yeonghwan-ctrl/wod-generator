// 의존성 없는 인라인 SVG 추세 그래프.
// values: number[] (시간순). 점이 1개면 점만, 2개 이상이면 선 + 점.
export default function Sparkline({ values = [], width = 280, height = 72 }) {
  const pad = 8
  const n = values.length
  if (n === 0) return null

  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const innerW = width - pad * 2
  const innerH = height - pad * 2

  const x = (i) => (n === 1 ? width / 2 : pad + (i / (n - 1)) * innerW)
  const y = (v) => pad + (1 - (v - min) / span) * innerH

  const points = values.map((v, i) => `${x(i)},${y(v)}`).join(' ')
  const areaPath =
    n > 1
      ? `M ${x(0)},${height - pad} L ${values.map((v, i) => `${x(i)},${y(v)}`).join(' L ')} L ${x(n - 1)},${height - pad} Z`
      : ''

  return (
    <svg className="sparkline" viewBox={`0 0 ${width} ${height}`} width="100%" height={height}>
      {n > 1 && <path className="spark-area" d={areaPath} />}
      {n > 1 && <polyline className="spark-line" points={points} fill="none" />}
      {values.map((v, i) => (
        <circle key={i} className="spark-dot" cx={x(i)} cy={y(v)} r={i === n - 1 ? 3.5 : 2.5} />
      ))}
    </svg>
  )
}
