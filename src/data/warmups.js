// Linkup 데일리 워밍업
// 각 훈련일의 "주 종목"에 맞춰 4단계로 몸을 준비한다.
//   raise(체온 올리기) → mobility(가동성) → activation(활성화) → ramp(바벨 램프업)
// blocks: [{ key, title, titleEn, items: [{ name, nameEn, dose, doseEn }] }]
//   key 는 컴포넌트에서 아이콘/색을 매핑하는 데 쓰인다.

// 자주 쓰는 공통 블록(중복 제거용)
const RAISE_ROW = { key: 'raise', title: '체온 올리기', titleEn: 'Raise', items: [
  { name: '로잉 / 에어바이크 가볍게', nameEn: 'Light row / air bike', dose: '2분', doseEn: '2 min' },
  { name: '점핑잭 + 암서클', nameEn: 'Jumping jacks + arm circles', dose: '30초씩', doseEn: '30 s each' },
] }

export const WARMUPS = {
  // ───── 스내치 데이 (오버헤드/스내치 패턴) ─────
  snatchDay: {
    focus: '스내치 · 오버헤드 준비',
    focusEn: 'Snatch · overhead prep',
    theme: 'technique',
    blocks: [
      RAISE_ROW,
      { key: 'mobility', title: '가동성', titleEn: 'Mobility', items: [
        { name: '밴드/PVC 어깨 패스스루', nameEn: 'Band/PVC shoulder pass-through', dose: '15회', doseEn: '15 reps' },
        { name: '손목 가동성 (앞뒤·좌우)', nameEn: 'Wrist mobility (all directions)', dose: '각 10회', doseEn: '10 each' },
        { name: '발목 니 투 월', nameEn: 'Ankle knee-to-wall', dose: '좌우 10회', doseEn: '10 each side' },
      ] },
      { key: 'activation', title: '활성화', titleEn: 'Activation', items: [
        { name: '밴드 풀 어파트', nameEn: 'Band pull-apart', dose: '20회', doseEn: '20 reps' },
        { name: '밴드 페이스 풀', nameEn: 'Band face pull', dose: '15회', doseEn: '15 reps' },
      ] },
      { key: 'ramp', title: '바벨 램프업', titleEn: 'Barbell ramp-up', items: [
        { name: 'PVC 오버헤드 스쿼트', nameEn: 'PVC overhead squat', dose: '10회', doseEn: '10 reps' },
        { name: '빈 봉 스내치 하이 풀 → 파워 스내치', nameEn: 'Empty-bar snatch high pull → power snatch', dose: '각 5회', doseEn: '5 each' },
        { name: '빈 봉 스내치 (3포지션)', nameEn: 'Empty-bar snatch (3 positions)', dose: '3세트', doseEn: '3 sets' },
      ] },
    ],
  },

  // ───── 클린 앤 저크 데이 ─────
  cleanJerkDay: {
    focus: '클린 · 저크 준비',
    focusEn: 'Clean · jerk prep',
    theme: 'olympic',
    blocks: [
      RAISE_ROW,
      { key: 'mobility', title: '가동성', titleEn: 'Mobility', items: [
        { name: '프론트 랙 스트레칭', nameEn: 'Front rack stretch', dose: '30초 × 2', doseEn: '30 s × 2' },
        { name: '손목 가동성', nameEn: 'Wrist mobility', dose: '각 10회', doseEn: '10 each' },
        { name: '90/90 고관절 회전', nameEn: '90/90 hip rotation', dose: '좌우 8회', doseEn: '8 each side' },
      ] },
      { key: 'activation', title: '활성화', titleEn: 'Activation', items: [
        { name: '밴드 글루트 브릿지', nameEn: 'Band glute bridge', dose: '15회', doseEn: '15 reps' },
        { name: '밴드 풀 어파트', nameEn: 'Band pull-apart', dose: '20회', doseEn: '20 reps' },
      ] },
      { key: 'ramp', title: '바벨 램프업', titleEn: 'Barbell ramp-up', items: [
        { name: '빈 봉 프론트 스쿼트', nameEn: 'Empty-bar front squat', dose: '8회', doseEn: '8 reps' },
        { name: '빈 봉 클린 풀 → 행 클린', nameEn: 'Empty-bar clean pull → hang clean', dose: '각 5회', doseEn: '5 each' },
        { name: '빈 봉 푸시 프레스 → 저크', nameEn: 'Empty-bar push press → jerk', dose: '각 5회', doseEn: '5 each' },
      ] },
    ],
  },

  // ───── 파워 / 스피드 데이 ─────
  powerDay: {
    focus: '폭발력 · 스피드 준비',
    focusEn: 'Power · speed prep',
    theme: 'strength',
    blocks: [
      { key: 'raise', title: '체온 올리기', titleEn: 'Raise', items: [
        { name: '줄넘기 / 더블언더', nameEn: 'Jump rope / double-unders', dose: '2분', doseEn: '2 min' },
        { name: '마운틴 클라이머', nameEn: 'Mountain climbers', dose: '30초', doseEn: '30 s' },
      ] },
      { key: 'mobility', title: '가동성', titleEn: 'Mobility', items: [
        { name: '레그 스윙 (앞뒤·좌우)', nameEn: 'Leg swings (all directions)', dose: '각 10회', doseEn: '10 each' },
        { name: '흉추 회전 (오픈북)', nameEn: 'T-spine rotation (open book)', dose: '좌우 8회', doseEn: '8 each side' },
      ] },
      { key: 'activation', title: '활성화', titleEn: 'Activation', items: [
        { name: '박스 점프 (낮게)', nameEn: 'Box jumps (low)', dose: '5회', doseEn: '5 reps' },
        { name: '밴드 스프린트 / 빠른 스쿼트', nameEn: 'Band sprints / fast squats', dose: '10회', doseEn: '10 reps' },
      ] },
      { key: 'ramp', title: '바벨 램프업', titleEn: 'Barbell ramp-up', items: [
        { name: 'PVC 패스스루 + 오버헤드 스쿼트', nameEn: 'PVC pass-through + overhead squat', dose: '10회', doseEn: '10 reps' },
        { name: '빈 봉 파워 스내치 / 파워 클린', nameEn: 'Empty-bar power snatch / power clean', dose: '각 5회', doseEn: '5 each' },
      ] },
    ],
  },

  // ───── 스트렝스 데이 (스쿼트/데드/프레스) ─────
  squatDay: {
    focus: '스쿼트 · 데드 준비',
    focusEn: 'Squat · deadlift prep',
    theme: 'pull',
    blocks: [
      { key: 'raise', title: '체온 올리기', titleEn: 'Raise', items: [
        { name: '에어바이크 / 로잉', nameEn: 'Air bike / row', dose: '2분', doseEn: '2 min' },
        { name: '워킹 런지', nameEn: 'Walking lunge', dose: '10보', doseEn: '10 steps' },
      ] },
      { key: 'mobility', title: '가동성', titleEn: 'Mobility', items: [
        { name: '90/90 고관절', nameEn: '90/90 hip', dose: '좌우 8회', doseEn: '8 each side' },
        { name: '발목 니 투 월', nameEn: 'Ankle knee-to-wall', dose: '좌우 10회', doseEn: '10 each side' },
        { name: '흉추 회전', nameEn: 'T-spine rotation', dose: '좌우 8회', doseEn: '8 each side' },
      ] },
      { key: 'activation', title: '활성화', titleEn: 'Activation', items: [
        { name: '밴드 글루트 브릿지', nameEn: 'Band glute bridge', dose: '15회', doseEn: '15 reps' },
        { name: '밴드 몬스터 워크', nameEn: 'Band monster walk', dose: '좌우 10보', doseEn: '10 steps each side' },
        { name: '버드 독', nameEn: 'Bird dog', dose: '좌우 10회', doseEn: '10 each side' },
      ] },
      { key: 'ramp', title: '바벨 램프업', titleEn: 'Barbell ramp-up', items: [
        { name: '빈 봉 굿모닝', nameEn: 'Empty-bar good morning', dose: '10회', doseEn: '10 reps' },
        { name: '빈 봉 백 스쿼트 → 점진 가중', nameEn: 'Empty-bar back squat → progressive loading', dose: '2~3세트', doseEn: '2–3 sets' },
      ] },
    ],
  },

  // ───── 스내치 테크닉 데이 ─────
  snatchTechDay: {
    focus: '스내치 테크닉 준비',
    focusEn: 'Snatch technique prep',
    theme: 'technique',
    blocks: [
      RAISE_ROW,
      { key: 'mobility', title: '가동성', titleEn: 'Mobility', items: [
        { name: '어깨 패스스루', nameEn: 'Shoulder pass-through', dose: '15회', doseEn: '15 reps' },
        { name: '손목 가동성', nameEn: 'Wrist mobility', dose: '각 10회', doseEn: '10 each' },
        { name: '오버헤드 월 슬라이드', nameEn: 'Overhead wall slides', dose: '12회', doseEn: '12 reps' },
      ] },
      { key: 'activation', title: '활성화', titleEn: 'Activation', items: [
        { name: '밴드 풀 어파트', nameEn: 'Band pull-apart', dose: '20회', doseEn: '20 reps' },
        { name: 'Y-T-W 레이즈', nameEn: 'Y-T-W raises', dose: '각 8회', doseEn: '8 each' },
      ] },
      { key: 'ramp', title: '바벨 램프업', titleEn: 'Barbell ramp-up', items: [
        { name: 'PVC 스내치 드릴 (3포지션)', nameEn: 'PVC snatch drill (3 positions)', dose: '5회씩', doseEn: '5 each' },
        { name: '빈 봉 박스/행 스내치', nameEn: 'Empty-bar box/hang snatch', dose: '3세트', doseEn: '3 sets' },
      ] },
    ],
  },

  // ───── 클린 테크닉 데이 ─────
  cleanTechDay: {
    focus: '클린 테크닉 준비',
    focusEn: 'Clean technique prep',
    theme: 'olympic',
    blocks: [
      RAISE_ROW,
      { key: 'mobility', title: '가동성', titleEn: 'Mobility', items: [
        { name: '프론트 랙 스트레칭', nameEn: 'Front rack stretch', dose: '30초 × 2', doseEn: '30 s × 2' },
        { name: '90/90 고관절', nameEn: '90/90 hip', dose: '좌우 8회', doseEn: '8 each side' },
      ] },
      { key: 'activation', title: '활성화', titleEn: 'Activation', items: [
        { name: '밴드 글루트 활성화', nameEn: 'Band glute activation', dose: '15회', doseEn: '15 reps' },
        { name: '밴드 풀 어파트', nameEn: 'Band pull-apart', dose: '20회', doseEn: '20 reps' },
      ] },
      { key: 'ramp', title: '바벨 램프업', titleEn: 'Barbell ramp-up', items: [
        { name: '빈 봉 클린 데드리프트', nameEn: 'Empty-bar clean deadlift', dose: '8회', doseEn: '8 reps' },
        { name: '클린 드릴 (3포지션)', nameEn: 'Clean drill (3 positions)', dose: '5회씩', doseEn: '5 each' },
        { name: '저크 풋워크 드릴', nameEn: 'Jerk footwork drill', dose: '10회', doseEn: '10 reps' },
      ] },
    ],
  },
}

// 커스텀 모드용: 그날 들어간 종목 카테고리로 워밍업을 조립한다.
const GENERIC_RAMP = {
  olympic: { name: '빈 봉 올림픽 리프트 드릴', nameEn: 'Empty-bar Olympic lift drill', dose: '3세트', doseEn: '3 sets' },
  technique: { name: 'PVC / 빈 봉 패턴 연습', nameEn: 'PVC / empty-bar pattern practice', dose: '2세트', doseEn: '2 sets' },
  pull: { name: '빈 봉 데드리프트 · 풀', nameEn: 'Empty-bar deadlift · pull', dose: '8회', doseEn: '8 reps' },
  strength: { name: '빈 봉 → 점진 가중 세트', nameEn: 'Empty-bar → progressive sets', dose: '2~3세트', doseEn: '2–3 sets' },
}

export function genericWarmup(categories = []) {
  const set = new Set(categories)
  const ramp = []
  ;['olympic', 'technique', 'pull', 'strength'].forEach((c) => {
    if (set.has(c) && GENERIC_RAMP[c]) ramp.push(GENERIC_RAMP[c])
  })
  if (!ramp.length)
    ramp.push({ name: '빈 봉으로 본 운동 패턴 연습', nameEn: 'Practice main movement with empty bar', dose: '2세트', doseEn: '2 sets' })

  return {
    focus: '오늘 종목 맞춤 준비',
    focusEn: "Tailored to today's lifts",
    theme: 'accent',
    blocks: [
      RAISE_ROW,
      { key: 'mobility', title: '가동성', titleEn: 'Mobility', items: [
        { name: '어깨 패스스루', nameEn: 'Shoulder pass-through', dose: '15회', doseEn: '15 reps' },
        { name: '90/90 고관절', nameEn: '90/90 hip', dose: '좌우 8회', doseEn: '8 each side' },
        { name: '발목 니 투 월', nameEn: 'Ankle knee-to-wall', dose: '좌우 10회', doseEn: '10 each side' },
      ] },
      { key: 'activation', title: '활성화', titleEn: 'Activation', items: [
        { name: '밴드 풀 어파트', nameEn: 'Band pull-apart', dose: '20회', doseEn: '20 reps' },
        { name: '밴드 글루트 브릿지', nameEn: 'Band glute bridge', dose: '15회', doseEn: '15 reps' },
      ] },
      { key: 'ramp', title: '바벨 램프업', titleEn: 'Barbell ramp-up', items: ramp },
    ],
  }
}

// 블록 key → 아이콘/보조 라벨
export const BLOCK_META = {
  raise: { icon: '🔥', hint: '심박·체온 ↑', hintEn: 'Heart rate ↑' },
  mobility: { icon: '🧘', hint: '관절 가동성', hintEn: 'Joint mobility' },
  activation: { icon: '⚡', hint: '근육 깨우기', hintEn: 'Wake muscles' },
  ramp: { icon: '🏋️', hint: '본 운동 패턴', hintEn: 'Main pattern' },
}
