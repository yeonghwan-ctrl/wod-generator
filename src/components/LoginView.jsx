import { useState } from 'react'
import { authErrorMessage } from '../store/useAuth.js'
import { isFirebaseConfigured } from '../firebase.js'
import { useI18n } from '../i18n.jsx'

export default function LoginView({ auth, onClose }) {
  const { t, toggle: toggleLang } = useI18n()
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
        <button
          type="button"
          className="lang-toggle login-lang"
          onClick={toggleLang}
          aria-label="Change language"
        >
          🌐 {t.langSwitch}
        </button>
        {onClose && (
          <button type="button" className="login-skip" onClick={onClose}>
            {t.skip}
          </button>
        )}
        <div className="login-brand">
          <div className="brand-logo">
            <img src="/barbell.svg" alt="" width="30" height="30" />
          </div>
          <h1>Linkup</h1>
          <p>{t.tagline}</p>
        </div>

        {!isFirebaseConfigured && <p className="login-error">{t.firebaseWarn}</p>}

        <div className="social-buttons">
          <button className="social-btn social-google" disabled={busy} onClick={signIn}>
            <span className="ico" style={{ color: '#4285F4' }}>G</span>
            {busy ? t.signingIn : t.continueGoogle}
          </button>
        </div>

        {error && (
          <p className="login-error" style={{ marginTop: 12 }}>
            {error}
          </p>
        )}

        <p className="login-note">{t.loginNote}</p>
      </div>
    </div>
  )
}
