// Firebase 초기화
// 설정값은 .env 의 VITE_FIREBASE_* 환경변수에서 읽는다 (.env.example 참고).
import { initializeApp } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// 설정값이 비어 있으면(=.env 미작성) 친절히 알려준다.
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

// 로그인 상태를 브라우저에 유지 (새로고침해도 로그인 유지)
setPersistence(auth, browserLocalPersistence).catch(() => {})
