import { LIFT_BY_ID } from '../data/lifts.js'
import { buildWeeks } from '../data/schemes.js'
import { getWeeklySplit, SESSIONS } from '../data/templates.js'
import { WARMUPS, genericWarmup } from '../data/warmups.js'
import { roundWeight } from './roundWeight.js'

// 선택한 종목의 "유효 1RM"을 구한다.
// 직접 입력한 값이 있으면 사용, 없고 percentBasisOf 가 있으면 기준 종목에서 환산.
export function effectiveOneRM(liftId, oneRMs) {
  const direct = Number(oneRMs[liftId])
  if (direct > 0) return direct

  const lift = LIFT_BY_ID[liftId]
  if (lift?.percentBasisOf) {
    const basis = Number(oneRMs[lift.percentBasisOf.lift])
    if (basis > 0) return basis * lift.percentBasisOf.ratio
  }
  return 0
}

// 한 종목의 해당 주차 처방(세트/렙/%/무게)을 계산한다.
function buildItem(liftId, weekIndex, cycleWeeks, oneRMs, increment) {
  const lift = LIFT_BY_ID[liftId]
  if (!lift) return null
  const weekScheme = buildWeeks(lift.scheme, cycleWeeks)[weekIndex]
  const oneRM = effectiveOneRM(liftId, oneRMs)
  const hasPercent = typeof weekScheme.percent === 'number'
  const weight = hasPercent ? roundWeight((oneRM * weekScheme.percent) / 100, increment) : null
  return {
    liftId,
    label: lift.label,
    category: lift.category,
    sets: weekScheme.sets,
    reps: weekScheme.reps,
    percent: hasPercent ? weekScheme.percent : null,
    weight, // null 이면 체중/RPE 기반(보조운동)
    estimated: hasPercent && !(Number(oneRMs[liftId]) > 0), // 환산값 여부
  }
}

// 커스텀 모드: 선택한 종목들을 요일에 라운드로빈으로 분배.
function distributeToDays(liftIds, daysPerWeek) {
  const days = Array.from({ length: daysPerWeek }, () => [])
  liftIds.forEach((id, idx) => {
    days[idx % daysPerWeek].push(id)
  })
  return days
}

// 모드별로 "요일 정의" 목록을 만든다. → [{ name?, liftIds, warmup }]
function buildDayDefs({ mode, daysPerWeek, selectedLiftIds }) {
  if (mode === 'template') {
    return getWeeklySplit(daysPerWeek).map((sessionId) => ({
      name: SESSIONS[sessionId].name,
      liftIds: SESSIONS[sessionId].lifts,
      warmup: WARMUPS[sessionId] || null,
    }))
  }
  const liftIds = selectedLiftIds.filter((id) => LIFT_BY_ID[id])
  return distributeToDays(liftIds, daysPerWeek).map((ids) => {
    const categories = ids.map((id) => LIFT_BY_ID[id]?.category).filter(Boolean)
    return { liftIds: ids, warmup: ids.length ? genericWarmup(categories) : null }
  })
}

// 메인 생성 함수 (순수 함수)
// 입력: { oneRMs, daysPerWeek, cycleWeeks, selectedLiftIds, increment, mode }
//   mode: 'template'(W2P 자동 구성) | 'custom'(직접 선택)
// 출력: { weeks: [ { weekNo, note, days: [ { dayNo, name?, items: [...] } ] } ] }
export function generateProgram({
  oneRMs = {},
  daysPerWeek = 3,
  cycleWeeks = 4,
  selectedLiftIds = [],
  increment = 5,
  mode = 'template',
}) {
  const dayDefs = buildDayDefs({ mode, daysPerWeek, selectedLiftIds })

  const weeks = []
  for (let w = 0; w < cycleWeeks; w++) {
    const days = dayDefs.map((def, di) => ({
      dayNo: di + 1,
      name: def.name,
      warmup: def.warmup,
      items: def.liftIds.map((id) => buildItem(id, w, cycleWeeks, oneRMs, increment)).filter(Boolean),
    }))
    weeks.push({ weekNo: w + 1, note: w === cycleWeeks - 1 ? '디로드' : '', days })
  }

  return { weeks }
}
