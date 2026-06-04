# W2P Cloud Functions (카카오 로그인)

카카오는 Firebase가 기본 지원하지 않으므로, 카카오 토큰을 Firebase **커스텀 토큰**으로
교환하는 함수(`kakaoLogin`)가 필요합니다.

## 배포 방법

> ⚠️ Cloud Functions 배포에는 Firebase **Blaze(종량제) 플랜**이 필요합니다.
> (소규모 사용은 무료 한도 내에서 대부분 과금되지 않습니다.)

```bash
# 1. Firebase CLI 설치 (최초 1회)
npm install -g firebase-tools
firebase login

# 2. 프로젝트 루트에서 Functions 초기화 (이미 functions/ 가 있으면 건너뜀)
#    firebase init functions   ← 기존 functions/ 유지 선택

# 3. 의존성 설치
cd functions
npm install

# 4. 배포
firebase deploy --only functions
```

배포가 끝나면 출력되는 함수 URL
(예: `https://us-central1-<프로젝트>.cloudfunctions.net/kakaoLogin`)을
프론트엔드 `.env` 의 `VITE_KAKAO_FUNCTION_URL` 에 넣으세요.

## 체크리스트
- [ ] `index.js` 의 `ALLOWED_ORIGINS` 에 실제 배포 도메인 추가
- [ ] Kakao Developers에서 JavaScript 키 발급 → `.env` 의 `VITE_KAKAO_JS_KEY`
- [ ] 카카오 앱 → 플랫폼(Web) 사이트 도메인 등록, 카카오 로그인 활성화
- [ ] Node 20 런타임은 Blaze 플랜에서만 동작
