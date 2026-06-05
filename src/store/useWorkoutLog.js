import { useState, useEffect, useRef } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase.js'
import { estimate1RM, makeId, todayLocal } from '../logic/prs.js'

// 운동 기록(로그) 영속 훅.
// - 비로그인: localStorage("이 기기에만")
// - 로그인: workoutLogs/{uid} 문서와 동기화 (athlete 문서와 분리 — useAthlete 가 users/{uid}를 통째 덮어쓰므로)
// 기록 엔트리: { id, date, liftId, weight, reps, rpe?, note?, unit, est1RM }
const STORAGE_KEY = 'linkup.log.v1'
const EMPTY = { entries: [] }

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw)
    return { entries: Array.isArray(parsed.entries) ? parsed.entries : [] }
  } catch {
    return EMPTY
  }
}

function saveLocal(stateLog) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ entries: stateLog.entries }))
  } catch {
    /* 저장 실패 무시 (시크릿 모드 등) */
  }
}

export function useWorkoutLog(user) {
  const [log, setLog] = useState(load)
  const uid = user?.uid || null
  const skipNextCloudWrite = useRef(false)
  const syncedUid = useRef(null)

  // ── 로그인/로그아웃 시 클라우드와 초기 동기화 ──
  useEffect(() => {
    if (!uid || !db) {
      syncedUid.current = null
      return
    }
    if (syncedUid.current === uid) return

    let cancelled = false
    ;(async () => {
      try {
        const ref = doc(db, 'workoutLogs', uid)
        const snap = await getDoc(ref)
        if (cancelled) return
        if (snap.exists()) {
          const data = snap.data()
          skipNextCloudWrite.current = true
          setLog({ entries: Array.isArray(data.entries) ? data.entries : [] })
        } else {
          await setDoc(ref, { entries: log.entries, updatedAt: Date.now() })
        }
        syncedUid.current = uid
      } catch (err) {
        console.error('기록 클라우드 동기화 실패:', err)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [uid])

  // ── 변경 시 저장 (로컬 항상, 로그인 시 클라우드 디바운스) ──
  useEffect(() => {
    saveLocal(log)

    if (!uid || !db) return
    if (skipNextCloudWrite.current) {
      skipNextCloudWrite.current = false
      return
    }
    const t = setTimeout(() => {
      setDoc(doc(db, 'workoutLogs', uid), { entries: log.entries, updatedAt: Date.now() }).catch(
        (err) => console.error('기록 클라우드 저장 실패:', err),
      )
    }, 800)
    return () => clearTimeout(t)
  }, [log, uid])

  // 기록 추가. { liftId, weight, reps, rpe?, note?, unit, date? }
  const addEntry = (input) => {
    const weight = Number(input.weight)
    const reps = Number(input.reps)
    if (!(weight > 0) || !(reps > 0) || !input.liftId) return false
    const entry = {
      id: makeId(),
      date: input.date || todayLocal(),
      liftId: input.liftId,
      weight,
      reps,
      rpe: input.rpe != null && input.rpe !== '' ? Number(input.rpe) : null,
      note: input.note?.trim() || '',
      unit: input.unit || 'kg',
      est1RM: estimate1RM(weight, reps),
    }
    setLog((s) => ({ entries: [entry, ...s.entries] }))
    return true
  }

  const removeEntry = (id) => setLog((s) => ({ entries: s.entries.filter((e) => e.id !== id) }))

  return { entries: log.entries, addEntry, removeEntry }
}
