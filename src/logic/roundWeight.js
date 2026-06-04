// 가장 가까운 increment(예: 2.5kg) 단위로 반올림 → 실제 원판으로 만들 수 있는 현실적 중량
export function roundWeight(weight, increment = 2.5) {
  if (!weight || !isFinite(weight)) return 0
  if (!increment || increment <= 0) return Math.round(weight)
  return Math.round(weight / increment) * increment
}
