// 운동 기록 / PR 계산 유틸
// 기록 엔트리: { id, date, liftId, weight, reps, rpe?, note?, unit, est1RM }

// Epley 공식으로 추정 1RM을 계산한다. reps=1 이면 무게 그대로.
export function estimate1RM(weight, reps) {
  const w = Number(weight)
  const r = Number(reps)
  if (!(w > 0) || !(r > 0)) return 0
  if (r === 1) return w
  return w * (1 + r / 30)
}

// 표시용 반올림(소수 1자리, 정수면 정수로)
export function round1(n) {
  const r = Math.round(Number(n) * 10) / 10
  return Number.isInteger(r) ? r : r
}

// 로컬 기준 오늘 날짜 'YYYY-MM-DD'
export function todayLocal() {
  const d = new Date()
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 10)
}

// 고유 id 생성 (기록 엔트리용)
export function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

// liftId 별 "베스트(최고 추정 1RM)" 엔트리 맵을 만든다. → { [liftId]: entry }
export function computePRs(entries = []) {
  const best = {}
  for (const e of entries) {
    const cur = best[e.liftId]
    if (!cur || (e.est1RM ?? 0) > (cur.est1RM ?? 0)) best[e.liftId] = e
  }
  return best
}

// 현재 PR(=종목별 베스트)인 엔트리 id 집합. 목록에서 PR 뱃지 표시용.
export function prEntryIds(entries = []) {
  const best = computePRs(entries)
  return new Set(Object.values(best).map((e) => e.id))
}
