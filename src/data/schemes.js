// 퍼센트 스킴 (주차별 강도 테이블) — 데이터 주도
// 각 스킴은 "주차 배열" 이며, 각 주차는 { sets, reps, percent, note? }
// percent: 1RM 대비 % (보조운동은 percent 없이 reps 표기만)
// 사이클 길이(cycleWeeks)에 맞춰 앞에서부터 사용하며,
// 4주를 초과하면 마지막 비-디로드 주차들을 +2.5%씩 반복 증가시킨다(progressWeek).

export const SCHEMES = {
  // 스트렝스(하체/벤치): 점진적 강도 증가 후 디로드
  strength: [
    { sets: 5, reps: 5, percent: 75 },
    { sets: 5, reps: 4, percent: 80 },
    { sets: 5, reps: 3, percent: 85 },
    { sets: 3, reps: 5, percent: 65, note: '디로드' },
  ],

  // 스트렝스 상체(OHP 등): 조금 더 보수적
  strengthUpper: [
    { sets: 5, reps: 5, percent: 70 },
    { sets: 5, reps: 4, percent: 75 },
    { sets: 5, reps: 3, percent: 80 },
    { sets: 3, reps: 5, percent: 60, note: '디로드' },
  ],

  // 올림픽 리프트(풀 동작): 기술 중심, 저렙 고퀄
  olympic: [
    { sets: 5, reps: 3, percent: 70 },
    { sets: 5, reps: 2, percent: 75 },
    { sets: 6, reps: 2, percent: 80 },
    { sets: 4, reps: 2, percent: 65, note: '디로드' },
  ],

  // 파워 변형: 더 가볍고 빠르게
  olympicPower: [
    { sets: 5, reps: 2, percent: 70 },
    { sets: 5, reps: 2, percent: 75 },
    { sets: 6, reps: 1, percent: 80 },
    { sets: 4, reps: 2, percent: 65, note: '디로드' },
  ],

  // 테크닉 / 포지셔널 변형(행·박스·스내치밸런스·OHS): 자체 추정 1RM 대비
  technique: [
    { sets: 5, reps: 2, percent: 75 },
    { sets: 5, reps: 2, percent: 80 },
    { sets: 4, reps: 2, percent: 85 },
    { sets: 4, reps: 2, percent: 70, note: '디로드' },
  ],

  // 풀(스내치 풀 / 클린 풀): 풀 동작 강화 — 풀 1RM(=주 종목 1RM) 대비 100%↑
  pull: [
    { sets: 4, reps: 3, percent: 90 },
    { sets: 4, reps: 3, percent: 100 },
    { sets: 5, reps: 3, percent: 105 },
    { sets: 3, reps: 3, percent: 85, note: '디로드' },
  ],

  // 하이 풀: 풀보다 가볍고 빠르게
  highPull: [
    { sets: 4, reps: 3, percent: 80 },
    { sets: 4, reps: 3, percent: 85 },
    { sets: 4, reps: 2, percent: 90 },
    { sets: 3, reps: 3, percent: 70, note: '디로드' },
  ],

  // 데드리프트 변형(스내치/클린 데드리프트): 주 종목 1RM 대비 100~115%
  deadliftVariant: [
    { sets: 4, reps: 4, percent: 100 },
    { sets: 4, reps: 3, percent: 110 },
    { sets: 4, reps: 3, percent: 115 },
    { sets: 3, reps: 4, percent: 90, note: '디로드' },
  ],

  // 보조 운동: 퍼센트 없이 세트×렙(체중/RPE 기반)
  accessory: [
    { sets: 3, reps: 12 },
    { sets: 3, reps: 12 },
    { sets: 4, reps: 10 },
    { sets: 2, reps: 12, note: '디로드' },
  ],
}

// 사이클 길이에 맞춰 주차 스킴을 생성한다.
// - cycleWeeks <= 4: 앞에서부터 잘라 쓰되, 마지막 주차는 항상 디로드가 되도록 보정
// - cycleWeeks > 4: 강도 주차들을 +2.5%씩 늘려 반복하고 마지막에 디로드 부착
export function buildWeeks(schemeId, cycleWeeks) {
  const base = SCHEMES[schemeId] || SCHEMES.accessory
  const loading = base.filter((w) => !w.note) // 강도(비-디로드) 주차들
  const deload = base.find((w) => w.note) || base[base.length - 1]

  const weeks = []
  for (let i = 0; i < cycleWeeks - 1; i++) {
    const src = loading[i % loading.length]
    const bumps = Math.floor(i / loading.length) // 한 바퀴 돌 때마다 강도 +
    const week = { ...src }
    if (typeof week.percent === 'number') {
      week.percent = week.percent + bumps * 2.5
    }
    weeks.push(week)
  }
  // 마지막 주차는 디로드
  weeks.push({ ...deload, note: '디로드' })
  return weeks
}
