import { useState, useEffect, useRef } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase.js'

// 사용자 상태 영속 훅.
// - 비로그인: localStorage("이 기기에만")
// - 로그인(user 전달 + Firestore 설정됨): users/{uid} 문서와 동기화
//   · 클라우드 문서가 있으면 클라우드 우선, 없으면 현재 로컬 상태를 이관(첫 로그인)
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

// 상태에서 저장 대상 필드만 추린다(메타데이터 제외).
function pickState(s) {
  return {
    oneRMs: s.oneRMs,
    mode: s.mode,
    selectedLiftIds: s.selectedLiftIds,
    daysPerWeek: s.daysPerWeek,
    cycleWeeks: s.cycleWeeks,
    unit: s.unit,
    increment: s.increment,
  }
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

function saveLocal(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pickState(state)))
  } catch {
    /* 저장 실패는 무시 (시크릿 모드 등) */
  }
}

export function useAthlete(user) {
  const [state, setState] = useState(load)
  const uid = user?.uid || null
  // 클라우드에서 막 로드한 직후의 저장(에코)을 막기 위한 가드
  const skipNextCloudWrite = useRef(false)
  const syncedUid = useRef(null)

  // ── 로그인/로그아웃 시 클라우드와 초기 동기화 ──
  useEffect(() => {
    if (!uid || !db) {
      syncedUid.current = null
      return
    }
    if (syncedUid.current === uid) return // 이미 동기화한 계정

    let cancelled = false
    ;(async () => {
      try {
        const ref = doc(db, 'users', uid)
        const snap = await getDoc(ref)
        if (cancelled) return
        if (snap.exists()) {
          // 클라우드 우선
          skipNextCloudWrite.current = true
          setState((s) => ({ ...DEFAULT_STATE, ...pickState(s), ...snap.data() }))
        } else {
          // 첫 로그인: 현재 로컬 상태를 클라우드로 이관
          await setDoc(ref, { ...pickState(state), updatedAt: Date.now() })
        }
        syncedUid.current = uid
      } catch (err) {
        console.error('클라우드 동기화 실패:', err)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [uid])

  // ── 상태 변경 시 저장 (로컬 항상, 로그인 시 클라우드 디바운스) ──
  useEffect(() => {
    saveLocal(state)

    if (!uid || !db) return
    if (skipNextCloudWrite.current) {
      skipNextCloudWrite.current = false
      return
    }
    const t = setTimeout(() => {
      setDoc(doc(db, 'users', uid), { ...pickState(state), updatedAt: Date.now() }).catch(
        (err) => console.error('클라우드 저장 실패:', err),
      )
    }, 800)
    return () => clearTimeout(t)
  }, [state, uid])

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
