import { useState, useEffect } from 'react'
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase.js'

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

  return { user, loading, signInWithGoogle, logout }
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
