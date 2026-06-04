import { useState, useEffect } from 'react'

// localStorage 기반 영속 상태 훅.
// 추후 앱/계정 연동 시 이 훅 내부만 교체하면 된다.
const STORAGE_KEY = 'boxlift.athlete.v1'

const DEFAULT_STATE = {
  oneRMs: {}, // { liftId: 입력값(현재 단위 기준) }
  mode: 'template', // 'template'(W2P 자동 구성) | 'custom'(직접 선택)
  selectedLiftIds: ['snatch', 'clean', 'backSquat', 'deadlift', 'frontSquat', 'pullUp'],
  daysPerWeek: 3,
  cycleWeeks: 4,
  unit: 'lb', // 'kg' | 'lb'
  increment: 5, // 무게 반올림 단위(현재 unit 기준)
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    return { ...DEFAULT_STATE, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_STATE
  }
}

export function useAthlete() {
  const [state, setState] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* 저장 실패는 무시 (시크릿 모드 등) */
    }
  }, [state])

  const update = (patch) => setState((s) => ({ ...s, ...patch }))

  const setOneRM = (liftId, value) =>
    setState((s) => ({ ...s, oneRMs: { ...s.oneRMs, [liftId]: value } }))

  const toggleLift = (liftId) =>
    setState((s) => {
      const has = s.selectedLiftIds.includes(liftId)
      return {
        ...s,
        selectedLiftIds: has
          ? s.selectedLiftIds.filter((id) => id !== liftId)
          : [...s.selectedLiftIds, liftId],
      }
    })

  const reset = () => setState(DEFAULT_STATE)

  return { state, update, setOneRM, toggleLift, reset }
}
