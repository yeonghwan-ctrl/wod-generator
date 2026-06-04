// W2P 자동 구성 세션 템플릿
// 각 세션 = 하루 훈련 = [테크닉/파워 변형 → 주 종목 → 풀 → 스쿼트/스트렝스 → 보조] 순서.
// 1RM은 주 종목(스내치/클린/C&J/백스쿼트/데드 등)만 입력하면 나머지는 자동 환산된다.

export const SESSIONS = {
  snatchDay: {
    name: '스내치 데이',
    lifts: ['snatchBalance', 'snatch', 'snatchPull', 'overheadSquat', 'core'],
  },
  cleanJerkDay: {
    name: '클린 앤 저크 데이',
    lifts: ['hangClean', 'cleanAndJerk', 'cleanPull', 'frontSquat', 'pullUp'],
  },
  powerDay: {
    name: '파워 / 스피드 데이',
    lifts: ['powerSnatch', 'powerClean', 'pushPress', 'core'],
  },
  squatDay: {
    name: '스트렝스 데이',
    lifts: ['backSquat', 'deadlift', 'benchPress', 'pullUp'],
  },
  snatchTechDay: {
    name: '스내치 테크닉 데이',
    lifts: ['boxSnatch', 'hangSnatch', 'snatchHighPull', 'overheadPress'],
  },
  cleanTechDay: {
    name: '클린 테크닉 데이',
    lifts: ['boxClean', 'splitJerk', 'cleanDeadlift', 'pauseFrontSquat', 'core'],
  },
}

// 주 훈련 횟수별 주간 분할 (W2P 균형 구성)
export const WEEKLY_SPLITS = {
  2: ['snatchDay', 'cleanJerkDay'],
  3: ['snatchDay', 'cleanJerkDay', 'squatDay'],
  4: ['snatchDay', 'cleanJerkDay', 'powerDay', 'squatDay'],
  5: ['snatchDay', 'cleanJerkDay', 'powerDay', 'squatDay', 'snatchTechDay'],
  6: ['snatchDay', 'cleanJerkDay', 'powerDay', 'squatDay', 'snatchTechDay', 'cleanTechDay'],
}

export function getWeeklySplit(daysPerWeek) {
  const clamped = Math.max(2, Math.min(6, daysPerWeek))
  return WEEKLY_SPLITS[clamped] || WEEKLY_SPLITS[3]
}
