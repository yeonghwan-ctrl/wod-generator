import { useState } from 'react'
import { authErrorMessage } from '../store/useAuth.js'
import { isFirebaseConfigured } from '../firebase.js'

export default function LoginView({ auth, onClose }) {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const run = async (fn) => {
    setError('')
    setBusy(true)
    try {
      await fn()
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const onEmailSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.')
      return
    }
    run(() =>
      mode === 'signup'
        ? auth.signUpWithEmail(email, password)
        : auth.signInWithEmail(email, password),
    )
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
          <h1>BoxLift</h1>
          <p>1RM 기반 주간 훈련 프로그램</p>
        </div>

        {!isFirebaseConfigured && (
          <p className="login-error">
            ⚠️ Firebase 설정(.env)이 비어 있습니다. 아래 안내대로 키를 입력해야 로그인이 동작합니다.
          </p>
        )}

        <div className="social-buttons">
          <button
            className="social-btn social-google"
            disabled={busy}
            onClick={() => run(auth.signInWithGoogle)}
          >
            <span className="ico" style={{ color: '#4285F4' }}>G</span>
            구글로 계속하기
          </button>
          <button
            className="social-btn social-apple"
            disabled={busy}
            onClick={() => run(auth.signInWithApple)}
          >
            <span className="ico"></span>
            Apple로 계속하기
          </button>
          <button
            className="social-btn social-kakao"
            disabled={busy}
            onClick={() => run(auth.signInWithKakao)}
          >
            <span className="ico">💬</span>
            카카오로 계속하기
          </button>
        </div>

        <div className="login-divider">또는 이메일로</div>

        <form className="email-form" onSubmit={onEmailSubmit}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호 (6자 이상)"
            value={password}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="login-error">{error}</p>}
          <button className="btn-primary" type="submit" disabled={busy}>
            {busy ? '처리 중…' : mode === 'signup' ? '회원가입' : '로그인'}
          </button>
        </form>

        <p className="login-switch">
          {mode === 'signup' ? '이미 계정이 있으신가요?' : '계정이 없으신가요?'}
          <button
            type="button"
            onClick={() => {
              setError('')
              setMode((m) => (m === 'signup' ? 'login' : 'signup'))
            }}
          >
            {mode === 'signup' ? '로그인' : '회원가입'}
          </button>
        </p>

        <p className="login-note">
          로그인은 선택 사항입니다. 로그인하면 여러 기기에서 기록을 이어서 사용할 수 있어요.
        </p>
      </div>
    </div>
  )
}
