// AI 코치에게 보낼 사용자 컨텍스트 요약 생성
// 토큰 절약을 위해 짧은 문자열로 압축해서 보낸다.
import { LIFT_BY_ID } from '../data/lifts.js'

function liftName(liftId) {
  return LIFT_BY_ID[liftId]?.labelEn || liftId
}

export function buildCoachContext(state, entries) {
  const oneRMs = Object.entries(state.oneRMs || {})
    .filter(([, v]) => Number(v) > 0)
    .map(([id, v]) => `${liftName(id)} ${v}${state.unit || 'kg'}`)
    .join(', ')

  const recentLogs = (entries || [])
    .slice(0, 10)
    .map((e) => {
      const rpe = e.rpe != null ? ` RPE${e.rpe}` : ''
      return `${e.date} ${liftName(e.liftId)} ${e.weight}${e.unit}x${e.reps}${rpe}`
    })
    .join('; ')

  return {
    oneRMs: oneRMs || '',
    unit: state.unit || 'kg',
    daysPerWeek: state.daysPerWeek,
    cycleWeeks: state.cycleWeeks,
    mode: state.mode,
    recentLogs: recentLogs || '',
  }
}
