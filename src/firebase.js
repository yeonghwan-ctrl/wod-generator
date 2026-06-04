// Firebase 초기화
// 설정값은 .env 의 VITE_FIREBASE_* 환경변수에서 읽는다 (.env.example 참고).
// ⚠️ 환경변수가 없으면(예: 배포 환경에 키 미설정) Firebase 초기화를 건너뛴다.
//    로그인은 선택 사항이므로, 설정이 없어도 앱은 정상 동작해야 한다.
import { initializeApp } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// 설정값이 있어야만 Firebase를 초기화한다(없으면 getAuth가 throw → 화면 전체 크래시).
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

let auth = null
let db = null
if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app) // 사용자별 데이터(1RM·설정) 저장용
    // 로그인 상태를 브라우저에 유지 (새로고침해도 로그인 유지)
    setPersistence(auth, browserLocalPersistence).catch(() => {})
  } catch (err) {
    console.error('Firebase 초기화 실패:', err)
    auth = null
    db = null
  }
}

export { auth, db }
