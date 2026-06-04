// 카카오 로그인용 Cloud Function
// 클라이언트가 보낸 카카오 access_token 을 검증하고,
// 해당 카카오 유저에 대한 Firebase 커스텀 토큰을 발급해 돌려준다.
//
// 배포: firebase deploy --only functions   (Blaze 종량제 플랜 필요)
// 호출 URL 을 프론트 .env 의 VITE_KAKAO_FUNCTION_URL 에 넣는다.

const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()

// CORS 허용 도메인 (배포 도메인 + 로컬 개발). 필요에 맞게 수정.
const ALLOWED_ORIGINS = ['http://localhost:5173', 'http://localhost:4173']

exports.kakaoLogin = functions.https.onRequest(async (req, res) => {
  const origin = req.headers.origin
  if (ALLOWED_ORIGINS.includes(origin)) res.set('Access-Control-Allow-Origin', origin)
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(204).send('')
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' })

  try {
    const { accessToken } = req.body || {}
    if (!accessToken) return res.status(400).json({ error: 'accessToken required' })

    // 1) 카카오 사용자 정보 조회 (토큰 검증 겸)
    const meRes = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!meRes.ok) return res.status(401).json({ error: 'Invalid Kakao token' })
    const me = await meRes.json()

    const uid = `kakao:${me.id}`
    const account = me.kakao_account || {}
    const profile = account.profile || {}

    // 2) Firebase 유저 upsert (없으면 생성)
    const props = {
      displayName: profile.nickname || undefined,
      photoURL: profile.profile_image_url || undefined,
      email: account.email || undefined,
    }
    try {
      await admin.auth().updateUser(uid, props)
    } catch (e) {
      await admin.auth().createUser({ uid, ...props })
    }

    // 3) 커스텀 토큰 발급
    const firebaseToken = await admin.auth().createCustomToken(uid, { provider: 'kakao' })
    return res.json({ firebaseToken })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal error' })
  }
})
