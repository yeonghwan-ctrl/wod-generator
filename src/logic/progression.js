// 자동 프로그레션 — 기록과 현재 1RM을 바탕으로 다음 사이클 1RM을 제안한다.
import { LIFT_BY_ID, PRIMARY_LIFTS } from '../data/lifts.js'
import { roundWeight } from './roundWeight.js'

// 종목·단위별 점진 증량 폭.
//  - 하체 스트렝스(스쿼트/데드): 큰 폭
//  - 상체 프레스(벤치/OHP) · 올림픽: 작은 폭
export function progressionStep(liftId, unit = 'kg') {
  const lift = LIFT_BY_ID[liftId]
  const isUpper = liftId === 'benchPress' || liftId === 'overheadPress'
  const isLowerStrength = lift?.category === 'strength' && !isUpper
  if (unit === 'lb') return isLowerStrength ? 10 : 5
  return isLowerStrength ? 5 : 2.5
}

// 한 종목의 다음 1RM 제안. → { value, reasonKey } | null
//  - 기록 추정 1RM이 현재보다 높으면 그 값을 채택(새 PR 반영)
//  - 아니면 현재값에 점진 증량
export function suggestNext({ liftId, current, bestLog, unit = 'kg', increment = 2.5 }) {
  const cur = Number(current) || 0
  const best = Number(bestLog) || 0
  const step = progressionStep(liftId, unit)

  if (best > cur + 0.01) {
    return { value: roundWeight(best, increment), reasonKey: 'progPr' }
  }
  if (cur > 0) {
    return { value: roundWeight(cur + step, increment), reasonKey: 'progInc' }
  }
  if (best > 0) {
    return { value: roundWeight(best, increment), reasonKey: 'progPr' }
  }
  return null
}

// 기록 엔트리에서 종목별 최고 추정 1RM 맵. { [liftId]: est1RM }
function bestLogByLift(entries = []) {
  const best = {}
  for (const e of entries) {
    if ((e.est1RM ?? 0) > (best[e.liftId] ?? 0)) best[e.liftId] = e.est1RM
  }
  return best
}

// 주 종목(직접 1RM 입력 대상)에 대한 프로그레션 제안 목록.
// → [{ liftId, current, suggested, delta, reasonKey }]
export function computeProgression({ entries = [], oneRMs = {}, unit = 'kg', increment = 2.5 }) {
  const best = bestLogByLift(entries)
  const rows = []
  for (const lift of PRIMARY_LIFTS) {
    const current = Number(oneRMs[lift.id]) || 0
    const s = suggestNext({
      liftId: lift.id,
      current,
      bestLog: best[lift.id] || 0,
      unit,
      increment,
    })
    if (!s) continue
    const delta = Math.round((s.value - current) * 10) / 10
    if (delta === 0) continue
    rows.push({ liftId: lift.id, current, suggested: s.value, delta, reasonKey: s.reasonKey })
  }
  return rows
}
