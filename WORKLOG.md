# 작업 기록 (WORKLOG)

이 파일은 진행한 작업을 시간순으로 기록합니다. 최신 항목이 위로 옵니다.

---

## 2026-06-04 — 로그인 선택화(필수 → 건너뛰기 가능)
- 인증 게이트 제거: 로그인 없이도 앱 전체 사용 가능
- 헤더에 로그인 상태별 UI: 비로그인 시 **로그인** 버튼, 로그인 시 아바타+로그아웃
- 로그인 화면에 **건너뛰기** 버튼 추가, 로그인 성공 시 자동으로 홈 복귀
- 로그인 안내 문구를 "선택 사항"으로 변경
- WORKLOG.md 추가 (앞으로 작업 내역 기록)
- 변경 파일: `src/App.jsx`, `src/components/LoginView.jsx`, `src/styles.css`
- 빌드 통과, GitHub `main` 자동 푸시

## 2026-06-04 — 워밍업 + 디자인 + 로그인/홈 (초기 기능 추가)
- **워밍업 루틴**: 세션별 HWPO 스타일 4단계(체온/가동성/활성화/바벨 램프업)를
  프로그램 데이 카드에 접이식 패널로 추가. 커스텀 모드는 카테고리 기반 제네릭 워밍업.
  - 신규 `src/data/warmups.js`, 수정 `src/logic/generateProgram.js`, `src/components/DayCard.jsx`
- **디자인 개편**: 메인 컬러 `#98cfff` 팔레트, 그라데이션 헤더/버튼, 데이 카드 액센트·hover,
  fade-in 애니메이션, 주차 탭 강조. (`src/styles.css`, `index.html` theme-color)
- **로그인/회원가입**: Firebase 기반(구글/애플/이메일) + 카카오(Cloud Function 스캐폴드).
  - 신규 `src/firebase.js`, `src/store/useAuth.js`, `src/components/LoginView.jsx`,
    `functions/`(index.js·package.json·README), `.env.example`
- **홈 대시보드**: 인사·요약·메뉴 카드 화면을 기본 진입 탭으로. (`src/components/HomeView.jsx`)
- `firebase` 의존성 설치, `.env`는 gitignore 처리
- 빌드 통과, GitHub `main` 푸시

> 참고: 실제 소셜 로그인을 쓰려면 사용자가 Firebase 프로젝트 생성 + `.env` 입력 +
> (카카오) Cloud Function 배포가 필요. 자세한 내용은 `.env.example`, `functions/README.md`.
