// 종목 정의
// category: 'olympic' | 'technique' | 'pull' | 'strength' | 'accessory'
// scheme: schemes.js 의 어떤 퍼센트 스킴을 따를지
// percentBasisOf: 자체 1RM을 다른 종목의 1RM에서 환산할 때 사용
//   { lift: 'clean', ratio: 1.0 } => clean 1RM 을 기준으로 사용(풀 동작은 ratio 1.0 + 100%↑ 스킴)
// primary 종목(= percentBasisOf 없음, 보조운동 제외)만 1RM 직접 입력 대상이 된다.

export const LIFTS = [
  // ───────────── 올림픽 풀 동작(주 종목) ─────────────
  { id: 'snatch', label: '스내치', labelEn: 'Snatch', short: 'SN', category: 'olympic', scheme: 'olympic' },
  { id: 'clean', label: '클린', labelEn: 'Clean', short: 'CL', category: 'olympic', scheme: 'olympic' },
  { id: 'cleanAndJerk', label: '클린 앤 저크', labelEn: 'Clean & Jerk', short: 'C&J', category: 'olympic', scheme: 'olympic', video: 'PjY1rH4_MOA' },

  // ───────────── 파워 / 포지셔널 / 테크닉 변형 ─────────────
  {
    id: 'powerSnatch',
    label: '파워 스내치',
    labelEn: 'Power Snatch',
    short: 'P.SN',
    category: 'technique',
    scheme: 'olympicPower',
    percentBasisOf: { lift: 'snatch', ratio: 0.85 },
  },
  {
    id: 'powerClean',
    label: '파워 클린',
    labelEn: 'Power Clean',
    short: 'P.CL',
    category: 'technique',
    scheme: 'olympicPower',
    percentBasisOf: { lift: 'clean', ratio: 0.85 },
  },
  {
    id: 'hangSnatch',
    label: '행 스내치 (무릎)',
    labelEn: 'Hang Snatch (knee)',
    short: 'H.SN',
    category: 'technique',
    scheme: 'technique',
    percentBasisOf: { lift: 'snatch', ratio: 0.9 },
  },
  {
    id: 'hangClean',
    label: '행 클린 (무릎)',
    labelEn: 'Hang Clean (knee)',
    short: 'H.CL',
    category: 'technique',
    scheme: 'technique',
    percentBasisOf: { lift: 'clean', ratio: 0.9 },
  },
  {
    id: 'boxSnatch',
    label: '박스 스내치 (블록)',
    labelEn: 'Box Snatch (blocks)',
    short: 'BX.SN',
    category: 'technique',
    scheme: 'technique',
    percentBasisOf: { lift: 'snatch', ratio: 0.9 },
  },
  {
    id: 'boxClean',
    label: '박스 클린 (블록)',
    labelEn: 'Box Clean (blocks)',
    short: 'BX.CL',
    category: 'technique',
    scheme: 'technique',
    percentBasisOf: { lift: 'clean', ratio: 0.9 },
  },
  {
    id: 'snatchBalance',
    label: '스내치 밸런스',
    labelEn: 'Snatch Balance',
    short: 'SN.BAL',
    category: 'technique',
    scheme: 'technique',
    percentBasisOf: { lift: 'snatch', ratio: 1.0 },
  },
  {
    id: 'overheadSquat',
    label: '오버헤드 스쿼트',
    labelEn: 'Overhead Squat',
    short: 'OHS',
    category: 'technique',
    scheme: 'technique',
    percentBasisOf: { lift: 'snatch', ratio: 1.0 },
  },
  {
    id: 'splitJerk',
    label: '스플릿 저크',
    labelEn: 'Split Jerk',
    short: 'S.JK',
    category: 'technique',
    scheme: 'olympic',
    percentBasisOf: { lift: 'clean', ratio: 0.9 },
  },
  {
    id: 'pushPress',
    label: '푸시 프레스',
    labelEn: 'Push Press',
    short: 'PP',
    category: 'technique',
    scheme: 'strengthUpper',
    percentBasisOf: { lift: 'overheadPress', ratio: 1.2 },
  },

  // ───────────── 풀 / 데드리프트 변형 (강한 풀 강화) ─────────────
  {
    id: 'snatchPull',
    label: '스내치 풀',
    labelEn: 'Snatch Pull',
    short: 'SN.PL',
    category: 'pull',
    scheme: 'pull',
    percentBasisOf: { lift: 'snatch', ratio: 1.0 },
  },
  {
    id: 'cleanPull',
    label: '클린 풀',
    labelEn: 'Clean Pull',
    short: 'CL.PL',
    category: 'pull',
    scheme: 'pull',
    percentBasisOf: { lift: 'clean', ratio: 1.0 },
  },
  {
    id: 'snatchHighPull',
    label: '스내치 하이 풀',
    labelEn: 'Snatch High Pull',
    short: 'SN.HP',
    category: 'pull',
    scheme: 'highPull',
    percentBasisOf: { lift: 'snatch', ratio: 1.0 },
  },
  {
    id: 'cleanHighPull',
    label: '클린 하이 풀',
    labelEn: 'Clean High Pull',
    short: 'CL.HP',
    category: 'pull',
    scheme: 'highPull',
    percentBasisOf: { lift: 'clean', ratio: 1.0 },
  },
  {
    id: 'snatchDeadlift',
    label: '스내치 데드리프트',
    labelEn: 'Snatch Deadlift',
    short: 'SN.DL',
    category: 'pull',
    scheme: 'deadliftVariant',
    percentBasisOf: { lift: 'snatch', ratio: 1.0 },
  },
  {
    id: 'cleanDeadlift',
    label: '클린 데드리프트',
    labelEn: 'Clean Deadlift',
    short: 'CL.DL',
    category: 'pull',
    scheme: 'deadliftVariant',
    percentBasisOf: { lift: 'clean', ratio: 1.0 },
  },

  // ───────────── 스트렝스 (스쿼트 / 프레스 / 데드) ─────────────
  { id: 'backSquat', label: '백 스쿼트', labelEn: 'Back Squat', short: 'BS', category: 'strength', scheme: 'strength' },
  {
    id: 'frontSquat',
    label: '프론트 스쿼트',
    labelEn: 'Front Squat',
    short: 'FS',
    category: 'strength',
    scheme: 'strength',
    percentBasisOf: { lift: 'backSquat', ratio: 0.85 },
  },
  {
    id: 'pauseFrontSquat',
    label: '포즈 프론트 스쿼트',
    labelEn: 'Pause Front Squat',
    short: 'P.FS',
    category: 'strength',
    scheme: 'strength',
    percentBasisOf: { lift: 'backSquat', ratio: 0.75 },
  },
  { id: 'deadlift', label: '데드리프트', labelEn: 'Deadlift', short: 'DL', category: 'strength', scheme: 'strength' },
  { id: 'benchPress', label: '벤치 프레스', labelEn: 'Bench Press', short: 'BP', category: 'strength', scheme: 'strength' },
  { id: 'overheadPress', label: '오버헤드 프레스', labelEn: 'Overhead Press', short: 'OHP', category: 'strength', scheme: 'strengthUpper' },

  // ───────────── 보조 운동 (퍼센트 미적용, 세트×렙만) ─────────────
  { id: 'pullUp', label: '풀업', labelEn: 'Pull-up', short: 'PU', category: 'accessory', scheme: 'accessory' },
  { id: 'lunge', label: '런지', labelEn: 'Lunge', short: 'LG', category: 'accessory', scheme: 'accessory' },
  { id: 'core', label: '코어(플랭크/시트업)', labelEn: 'Core (plank/sit-up)', short: 'CORE', category: 'accessory', scheme: 'accessory' },
]

export const CATEGORY_LABEL = {
  olympic: '올림픽 리프트 (주 종목)',
  technique: '테크닉 / 포지셔널 변형',
  pull: '풀 / 데드리프트 변형',
  strength: '스트렝스 (스쿼트·프레스)',
  accessory: '보조 운동',
}

export const CATEGORY_LABEL_EN = {
  olympic: 'Olympic Lifts (main)',
  technique: 'Technique / Positional',
  pull: 'Pulls / Deadlift Variations',
  strength: 'Strength (Squat · Press)',
  accessory: 'Accessories',
}

export const CATEGORY_ORDER = ['olympic', 'technique', 'pull', 'strength', 'accessory']

export const LIFT_BY_ID = Object.fromEntries(LIFTS.map((l) => [l.id, l]))

// primary = 직접 1RM 입력 대상 (환산 기준이 되는 핵심 종목)
export const PRIMARY_LIFTS = LIFTS.filter((l) => !l.percentBasisOf && l.category !== 'accessory')
