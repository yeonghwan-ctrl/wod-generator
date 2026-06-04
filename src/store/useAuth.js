import { useState, useEffect } from 'react'
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithCustomToken,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth'
import { auth } from '../firebase.js'

// 인증 상태 + 로그인/로그아웃 액션을 제공하는 훅.
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

  const requireAuth = () => {
    if (!auth) {
      throw new Error(
        '로그인이 아직 설정되지 않았습니다. (배포 환경에 Firebase 환경변수를 등록해주세요)',
      )
    }
  }

  // ── 구글 ──
  const signInWithGoogle = () => {
    requireAuth()
    const provider = new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
  }

  // ── 애플 ──
  const signInWithApple = () => {
    requireAuth()
    const provider = new OAuthProvider('apple.com')
    provider.addScope('email')
    provider.addScope('name')
    return signInWithPopup(auth, provider)
  }

  // ── 카카오 ──
  // Firebase는 카카오를 기본 지원하지 않으므로:
  //   1) Kakao JS SDK로 로그인 → 액세스 토큰 획득
  //   2) Cloud Function(VITE_KAKAO_FUNCTION_URL)에서 Firebase 커스텀 토큰 발급
  //   3) signInWithCustomToken 으로 Firebase 로그인
  const signInWithKakao = async () => {
    requireAuth()
    const Kakao = window.Kakao
    const jsKey = import.meta.env.VITE_KAKAO_JS_KEY
    const fnUrl = import.meta.env.VITE_KAKAO_FUNCTION_URL
    if (!Kakao) throw new Error('Kakao SDK가 로드되지 않았습니다.')
    if (!jsKey) throw new Error('VITE_KAKAO_JS_KEY 가 설정되지 않았습니다.')
    if (!fnUrl) throw new Error('VITE_KAKAO_FUNCTION_URL(카카오용 Cloud Function)이 설정되지 않았습니다.')
    if (!Kakao.isInitialized()) Kakao.init(jsKey)

    const kakaoToken = await new Promise((resolve, reject) => {
      Kakao.Auth.login({
        success: (res) => resolve(res.access_token),
        fail: (err) => reject(new Error('카카오 로그인 취소/실패')),
      })
    })

    const res = await fetch(fnUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken: kakaoToken }),
    })
    if (!res.ok) throw new Error('카카오 토큰 교환 실패 (Cloud Function 확인)')
    const { firebaseToken } = await res.json()
    return signInWithCustomToken(auth, firebaseToken)
  }

  // ── 이메일/비밀번호 ──
  const signUpWithEmail = (email, password) => {
    requireAuth()
    return createUserWithEmailAndPassword(auth, email, password)
  }
  const signInWithEmail = (email, password) => {
    requireAuth()
    return signInWithEmailAndPassword(auth, email, password)
  }

  const logout = () => (auth ? signOut(auth) : Promise.resolve())

  return {
    user,
    loading,
    signInWithGoogle,
    signInWithApple,
    signInWithKakao,
    signUpWithEmail,
    signInWithEmail,
    logout,
  }
}

// Firebase 에러 코드 → 한국어 메시지
export function authErrorMessage(err) {
  const code = err?.code || ''
  const map = {
    'auth/invalid-email': '이메일 형식이 올바르지 않습니다.',
    'auth/user-not-found': '등록되지 않은 이메일입니다.',
    'auth/wrong-password': '비밀번호가 올바르지 않습니다.',
    'auth/invalid-credential': '이메일 또는 비밀번호가 올바르지 않습니다.',
    'auth/email-already-in-use': '이미 가입된 이메일입니다.',
    'auth/weak-password': '비밀번호는 6자 이상이어야 합니다.',
    'auth/popup-closed-by-user': '로그인 창이 닫혔습니다.',
    'auth/operation-not-allowed': '이 로그인 방식이 Firebase 콘솔에서 활성화되지 않았습니다.',
  }
  return map[code] || err?.message || '로그인 중 오류가 발생했습니다.'
}
