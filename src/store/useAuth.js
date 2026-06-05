import { useState, useEffect } from 'react'
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  deleteUser,
  reauthenticateWithPopup,
} from 'firebase/auth'
import { doc, deleteDoc } from 'firebase/firestore'
import { auth, db } from '../firebase.js'

// 계정 삭제 시 함께 비우는 로컬 저장 키
const LOCAL_KEYS = ['boxlift.athlete.v1', 'linkup.log.v1', 'linkup.session.v1']

async function purgeUserData(uid) {
  if (db && uid) {
    await Promise.allSettled([
      deleteDoc(doc(db, 'users', uid)),
      deleteDoc(doc(db, 'workoutLogs', uid)),
    ])
  }
  LOCAL_KEYS.forEach((k) => {
    try {
      localStorage.removeItem(k)
    } catch {
      /* ignore */
    }
  })
}

// 인증 상태 + 로그인/로그아웃 액션을 제공하는 훅. (구글 로그인만 지원)
export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Firebase 미설정 시(auth === null) 인증 없이 동작
    if (!auth) {
      setLoading(false)
      return
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  const signInWithGoogle = () => {
    if (!auth) {
      throw new Error(
        '로그인이 아직 설정되지 않았습니다. (배포 환경에 Firebase 환경변수를 등록해주세요)',
      )
    }
    const provider = new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
  }

  const logout = () => (auth ? signOut(auth) : Promise.resolve())

  // 계정 삭제: 클라우드(users·workoutLogs) + 로컬 데이터 삭제 후 인증 계정 삭제.
  // 마지막 로그인이 오래되면 재인증이 필요(auth/requires-recent-login) → 구글 재인증 후 재시도.
  const deleteAccount = async () => {
    if (!auth?.currentUser) return
    const current = auth.currentUser
    const uid = current.uid
    await purgeUserData(uid)
    try {
      await deleteUser(current)
    } catch (err) {
      if (err?.code === 'auth/requires-recent-login') {
        await reauthenticateWithPopup(auth.currentUser, new GoogleAuthProvider())
        await deleteUser(auth.currentUser)
      } else {
        throw err
      }
    }
  }

  return { user, loading, signInWithGoogle, logout, deleteAccount }
}

// Firebase 에러 코드 → 한국어 메시지
export function authErrorMessage(err) {
  const code = err?.code || ''
  const map = {
    'auth/popup-closed-by-user': '로그인 창이 닫혔습니다.',
    'auth/cancelled-popup-request': '로그인 요청이 취소되었습니다.',
    'auth/popup-blocked': '팝업이 차단되었습니다. 브라우저 설정을 확인해주세요.',
    'auth/operation-not-allowed': '구글 로그인이 Firebase 콘솔에서 활성화되지 않았습니다.',
    'auth/network-request-failed': '네트워크 오류가 발생했습니다.',
  }
  return map[code] || err?.message || '로그인 중 오류가 발생했습니다.'
}
