import { useState } from 'react'
import { authErrorMessage } from '../store/useAuth.js'
import { isFirebaseConfigured } from '../firebase.js'

export default function LoginView({ auth, onClose }) {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const signIn = async () => {
    setError('')
    setBusy(true)
    try {
      await auth.signInWithGoogle()
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login">
      <div className="login-card">
        {onClose && (
          <button type="button" className="login-skip" onClick={onClose}>
            건너뛰기 →
          </button>
        )}
        <div className="login-brand">
          <div className="brand-logo">
            <img src="/barbell.svg" alt="" width="30" height="30" />
          </div>
          <h1>W2P</h1>
          <p>Work to PR · 1RM 기반 주간 훈련 프로그램</p>
        </div>

        {!isFirebaseConfigured && (
          <p className="login-error">
            ⚠️ Firebase 설정(.env)이 비어 있습니다. 키를 등록해야 로그인이 동작합니다.
          </p>
        )}

        <div className="social-buttons">
          <button className="social-btn social-google" disabled={busy} onClick={signIn}>
            <span className="ico" style={{ color: '#4285F4' }}>G</span>
            {busy ? '로그인 중…' : '구글로 계속하기'}
          </button>
        </div>

        {error && (
          <p className="login-error" style={{ marginTop: 12 }}>
            {error}
          </p>
        )}

        <p className="login-note">
          로그인은 선택 사항입니다. 로그인하면 여러 기기에서 기록을 이어서 사용할 수 있어요.
        </p>
      </div>
    </div>
  )
}
