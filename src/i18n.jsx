import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

// ── 언어(i18n) 컨텍스트 ──
// lang: 'ko' | 'en' — localStorage 에 영속.
// t  : 현재 언어의 UI 문자열 사전(UI[lang])
// tx : 데이터 객체에서 언어별 필드를 고르는 헬퍼. tx(obj, 'label') → en 이면 obj.labelEn 우선
const STORAGE_KEY = 'linkup.lang'

function readLang() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'ko' || v === 'en') return v
  } catch {
    /* ignore */
  }
  return 'ko'
}

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(readLang)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* ignore */
    }
    if (typeof document !== 'undefined') document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((l) => setLangState(l === 'en' ? 'en' : 'ko'), [])
  const toggle = useCallback(() => setLangState((l) => (l === 'ko' ? 'en' : 'ko')), [])

  const value = useMemo(() => {
    const t = UI[lang]
    const tx = (obj, field) => {
      if (!obj) return ''
      const en = obj[field + 'En']
      return lang === 'en' && en != null ? en : obj[field]
    }
    return { lang, setLang, toggle, t, tx }
  }, [lang, setLang, toggle])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useI18n() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useI18n must be used within <LangProvider>')
  return ctx
}

// ── UI 문자열 사전 ──
// 값이 함수면 보간(interpolation)용 — 컴포넌트에서 t.key(arg) 형태로 호출
export const UI = {
  ko: {
    // 공통 / 헤더
    tagline: '1RM 기반 주간 훈련 프로그램',
    login: '로그인',
    logout: '로그아웃',
    langSwitch: 'EN', // 누르면 영어로
    footer: '퍼센트 기반 기본 스킴 · 데이터는 이 기기에만 저장됩니다 (localStorage)',
    // 탭
    tabHome: '홈',
    tabInput: '입력',
    tabProgram: '프로그램',
    tabStretching: '스트레칭',
    tabInjury: '부상예방',
    tabLog: '기록',
    // 홈
    defaultName: '운동러',
    nameSuffix: '님',
    hello: '반가워요 👋',
    startToday: '오늘 훈련 바로 시작 →',
    statDays: '주 훈련 횟수',
    statCycle: '사이클(주)',
    statRm: '입력된 1RM',
    menu: '메뉴',
    modeAuto: 'Linkup 자동',
    modeCustom: '직접 선택',
    menuProgram: '프로그램',
    menuProgramDesc: '주간 훈련 + 워밍업 루틴',
    menuStretching: '스트레칭',
    menuStretchingDesc: '운동 전·후 가동성',
    menuInjury: '부상예방',
    menuInjuryDesc: '부위별 예방 가이드',
    menuInput: '1RM 입력',
    menuInputDesc: '기록·설정 수정',
    menuLog: '운동 기록',
    menuLogDesc: '기록·PR 추적',
    // 입력(OneRMForm)
    autoConvert: '자동 환산',
    programMode: '프로그램 방식',
    autoSetup: 'Linkup 자동 구성',
    autoSetupDesc: '올림픽·풀·스쿼트·보조를 한 세션에 균형 있게',
    customSetup: '직접 선택',
    customSetupDesc: '원하는 종목만 골라 구성',
    trainingSettings: '훈련 설정',
    daysPerWeek: '주 훈련 횟수',
    daysOpt: (d) => `주 ${d}회`,
    cycleLength: '사이클 길이',
    weeksOpt: (w) => `${w}주`,
    weightUnit: '무게 단위',
    unitLb: '파운드 (lb)',
    unitKg: '킬로그램 (kg)',
    weightRounding: '무게 반올림',
    incrementOpt: (i, u) => `${i}${u} 단위`,
    mainLiftRm: '주 종목 1RM 입력',
    mainLiftHint: '스내치·클린·C&J·스쿼트·데드만 입력하면 풀·박스·행 등 변형은 자동 환산됩니다.',
    weeklySplit: (n) => `주간 구성 (${n}일)`,
    bwRpe: '체중/RPE',
    reset: '초기화',
    generate: '프로그램 생성 →',
    formHint:
      '※ 풀·데드리프트 변형은 주 종목 1RM 대비 100%↑ 강도로, 테크닉/박스 변형은 가볍게 자동 계산됩니다.',
    // 프로그램(ProgramView / DayCard)
    noLifts: '선택된 종목이 없습니다.',
    toInput: '입력 화면으로',
    edit: '← 수정',
    cycleSummary: (weeks, days) => `${weeks}주 사이클 · 주 ${days}회`,
    programSub: '1RM 대비 퍼센트 기반 프로그램',
    weekTab: (n) => `${n}주차`,
    deload: '디로드',
    day: (n) => `Day ${n}`,
    rest: '휴식 / 컨디셔닝',
    warmup: '워밍업',
    estTitle: '기준 종목에서 환산',
    // 스트레칭
    pre: '운동 전',
    post: '운동 후',
    preIntro: '관절 가동성을 열고 본 운동 패턴을 준비합니다.',
    postIntro: '단축된 근육을 늘려 회복을 돕고 부상을 예방합니다.',
    watchYoutube: '▶ 유튜브에서 영상 보기',
    // 부상예방
    injuryIntro1: '역도/올림픽 리프팅에서 부위별로 ',
    injuryIntroStrong: '언제·어떤 포지션에서',
    injuryIntro2: ' 부상 위험이 큰지와 예방법을 정리했습니다.',
    riskSituations: '⚠️ 위험 상황 / 포지션',
    causes: '원인',
    prevention: '✅ 예방법',
    disclaimer:
      '※ 일반적인 안전 가이드이며 의학적 진단·치료를 대체하지 않습니다. 통증이 지속되면 전문가와 상담하세요.',
    // 로그인
    skip: '건너뛰기 →',
    firebaseWarn: '⚠️ Firebase 설정(.env)이 비어 있습니다. 키를 등록해야 로그인이 동작합니다.',
    signingIn: '로그인 중…',
    continueGoogle: '구글로 계속하기',
    loginNote: '로그인은 선택 사항입니다. 로그인하면 여러 기기에서 기록을 이어서 사용할 수 있어요.',
    // 운동 기록(LogView / 빠른 기록)
    logTitle: '운동 기록',
    logAdd: '기록 추가',
    logLift: '종목',
    logSelectLift: '종목 선택',
    logWeight: '무게',
    logReps: '횟수(렙)',
    logRpe: 'RPE(선택)',
    logNote: '메모(선택)',
    logDate: '날짜',
    logSave: '저장',
    logCancel: '취소',
    logDelete: '삭제',
    logEst1RM: '추정 1RM',
    logPr: 'PR',
    logPrSummary: 'PR 요약',
    logTrend: '추세',
    logHistory: '기록 목록',
    logNoEntries: '아직 기록이 없습니다. 첫 운동을 기록해보세요.',
    logNoPr: '기록을 추가하면 종목별 PR이 여기에 표시됩니다.',
    logApply1RM: '1RM으로 적용',
    logApplied: '적용됨 ✓',
    logBtn: '기록',
    logTrendHint: '기록이 2개 이상인 종목의 추정 1RM 추세',
    // 세션 진행 모드 / 타이머
    startSession: '운동 시작',
    sessFinish: '운동 완료',
    sessRestTimer: '휴식 타이머',
    sessStart: '시작',
    sessPause: '일시정지',
    sessReset: '리셋',
    sessSetsDone: (d, total) => `${d} / ${total} 세트`,
    sessAllDone: '오늘 운동 완료! 💪',
    sessLogged: '기록됨 ✓',
    sessSet: '세트',
    sessClose: '닫기',
    // 내보내기 / 공유
    exportTitle: '내보내기',
    exportPrint: '인쇄 / PDF',
    exportShare: '공유',
    exportCopied: '복사됨 ✓',
  },
  en: {
    // common / header
    tagline: '1RM-based weekly training program',
    login: 'Login',
    logout: 'Logout',
    langSwitch: '한국어', // press to switch back to Korean
    footer: 'Percent-based default schemes · Data is stored on this device only (localStorage)',
    // tabs
    tabHome: 'Home',
    tabInput: 'Input',
    tabProgram: 'Program',
    tabStretching: 'Stretching',
    tabInjury: 'Injury',
    tabLog: 'Log',
    // home
    defaultName: 'Athlete',
    nameSuffix: '',
    hello: 'Welcome 👋',
    startToday: "Start today's training →",
    statDays: 'Days / week',
    statCycle: 'Cycle (weeks)',
    statRm: '1RMs entered',
    menu: 'Menu',
    modeAuto: 'Linkup Auto',
    modeCustom: 'Custom',
    menuProgram: 'Program',
    menuProgramDesc: 'Weekly training + warm-up routine',
    menuStretching: 'Stretching',
    menuStretchingDesc: 'Pre / post mobility',
    menuInjury: 'Injury Prevention',
    menuInjuryDesc: 'Area-by-area guide',
    menuInput: 'Enter 1RM',
    menuInputDesc: 'Edit records & settings',
    menuLog: 'Workout Log',
    menuLogDesc: 'Track lifts & PRs',
    // input (OneRMForm)
    autoConvert: 'Auto',
    programMode: 'Program mode',
    autoSetup: 'Linkup Auto Setup',
    autoSetupDesc: 'Olympic, pulls, squats & accessories balanced in one session',
    customSetup: 'Custom',
    customSetupDesc: 'Pick only the lifts you want',
    trainingSettings: 'Training settings',
    daysPerWeek: 'Days per week',
    daysOpt: (d) => `${d}×/week`,
    cycleLength: 'Cycle length',
    weeksOpt: (w) => `${w} wks`,
    weightUnit: 'Weight unit',
    unitLb: 'Pounds (lb)',
    unitKg: 'Kilograms (kg)',
    weightRounding: 'Weight rounding',
    incrementOpt: (i, u) => `${i} ${u}`,
    mainLiftRm: 'Enter main-lift 1RMs',
    mainLiftHint:
      'Enter only Snatch, Clean, C&J, Squat & Deadlift — variations (pulls, box, hang…) are auto-calculated.',
    weeklySplit: (n) => `Weekly split (${n} days)`,
    bwRpe: 'BW/RPE',
    reset: 'Reset',
    generate: 'Generate program →',
    formHint:
      '※ Pull/deadlift variations are calculated at 100%+ of the main-lift 1RM; technique/box variations are kept light.',
    // program (ProgramView / DayCard)
    noLifts: 'No lifts selected.',
    toInput: 'Go to input',
    edit: '← Edit',
    cycleSummary: (weeks, days) => `${weeks}-week cycle · ${days}×/week`,
    programSub: 'Percent-of-1RM based program',
    weekTab: (n) => `Week ${n}`,
    deload: 'Deload',
    day: (n) => `Day ${n}`,
    rest: 'Rest / Conditioning',
    warmup: 'Warm-up',
    estTitle: 'Converted from base lift',
    // stretching
    pre: 'Pre-workout',
    post: 'Post-workout',
    preIntro: 'Open up joint mobility and prime your main movement patterns.',
    postIntro: 'Lengthen shortened muscles to aid recovery and prevent injury.',
    watchYoutube: '▶ Watch on YouTube',
    // injury
    injuryIntro1: 'A summary of ',
    injuryIntroStrong: 'when and in which positions',
    injuryIntro2: ' each area is most at risk in weightlifting, plus how to prevent it.',
    riskSituations: '⚠️ Risky situations / positions',
    causes: 'Causes',
    prevention: '✅ Prevention',
    disclaimer:
      '※ This is general safety guidance and does not replace medical diagnosis or treatment. If pain persists, consult a professional.',
    // login
    skip: 'Skip →',
    firebaseWarn: '⚠️ Firebase config (.env) is empty. Add your keys to enable login.',
    signingIn: 'Signing in…',
    continueGoogle: 'Continue with Google',
    loginNote: 'Login is optional. Sign in to keep your records across multiple devices.',
    // workout log (LogView / quick log)
    logTitle: 'Workout Log',
    logAdd: 'Add entry',
    logLift: 'Lift',
    logSelectLift: 'Select a lift',
    logWeight: 'Weight',
    logReps: 'Reps',
    logRpe: 'RPE (optional)',
    logNote: 'Note (optional)',
    logDate: 'Date',
    logSave: 'Save',
    logCancel: 'Cancel',
    logDelete: 'Delete',
    logEst1RM: 'Est. 1RM',
    logPr: 'PR',
    logPrSummary: 'PR Summary',
    logTrend: 'Trend',
    logHistory: 'History',
    logNoEntries: 'No records yet. Log your first session.',
    logNoPr: 'Add records to see your per-lift PRs here.',
    logApply1RM: 'Set as 1RM',
    logApplied: 'Applied ✓',
    logBtn: 'Log',
    logTrendHint: 'Estimated-1RM trend for lifts with 2+ records',
    // session mode / timer
    startSession: 'Start session',
    sessFinish: 'Finish',
    sessRestTimer: 'Rest timer',
    sessStart: 'Start',
    sessPause: 'Pause',
    sessReset: 'Reset',
    sessSetsDone: (d, total) => `${d} / ${total} sets`,
    sessAllDone: "Today's session done! 💪",
    sessLogged: 'Logged ✓',
    sessSet: 'Set',
    sessClose: 'Close',
    // export / share
    exportTitle: 'Export',
    exportPrint: 'Print / PDF',
    exportShare: 'Share',
    exportCopied: 'Copied ✓',
  },
}
