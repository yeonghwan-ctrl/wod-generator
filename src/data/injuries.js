// 부상 위험 데이터 — 어느 상황/포지션에서 위험한지 + 예방법
// risk: 'high' | 'mid' (강조 색상용)
// 일반적인 정보이며 의학적 진단/치료를 대체하지 않습니다.

export const INJURIES = [
  {
    area: '허리 (요추)',
    areaEn: 'Lower Back (lumbar)',
    risk: 'high',
    lifts: ['데드리프트', '클린 풀', '스내치 풀', '클린'],
    liftsEn: ['Deadlift', 'Clean Pull', 'Snatch Pull', 'Clean'],
    positions: [
      '바닥에서 당길 때 등이 둥글게 말리는(라운딩) 순간',
      '무거운 풀에서 골반이 먼저 들리고 바가 몸에서 멀어질 때',
      '피로 누적으로 마지막 렙 자세가 무너질 때',
    ],
    positionsEn: [
      'The moment the back rounds while pulling from the floor',
      'When the hips shoot up first on a heavy pull and the bar drifts away',
      'When form breaks down on the last reps from accumulated fatigue',
    ],
    causes: ['코어 브레이싱(복압) 부족', '척추 중립 상실', '바가 몸에서 멀어짐', '과도한 중량/볼륨'],
    causesEn: ['Weak core bracing (intra-abdominal pressure)', 'Loss of a neutral spine', 'Bar drifting away from the body', 'Excessive load/volume'],
    prevention: [
      '셋업에서 광배 활성화 + 숨 참아 복압 유지',
      '바를 정강이·허벅지에 붙여 몸 가까이 당기기',
      '가벼운 무게로 힙힌지 패턴 먼저 학습',
      '폼이 무너지는 무게는 줄이고 점진적으로 증량',
    ],
    preventionEn: [
      'Engage the lats at setup and brace by holding your breath',
      'Keep the bar against the shins/thighs and pull it close',
      'Learn the hip-hinge pattern first with light weight',
      'Drop weight where form breaks and add load gradually',
    ],
  },
  {
    area: '어깨 (회전근개·관절순)',
    areaEn: 'Shoulder (rotator cuff / labrum)',
    risk: 'high',
    lifts: ['스내치', '저크', '오버헤드 스쿼트', '오버헤드 프레스'],
    liftsEn: ['Snatch', 'Jerk', 'Overhead Squat', 'Overhead Press'],
    positions: [
      '스내치·저크 락아웃에서 팔이 귀 뒤로 안 가고 앞쪽에 머물 때',
      '오버헤드에서 바가 불안정하게 흔들릴 때',
      '받는 순간 어깨가 충분히 외회전되지 않을 때',
    ],
    positionsEn: [
      'When the arms stay forward instead of behind the ears at snatch/jerk lockout',
      'When the bar wobbles unstably overhead',
      'When the shoulder is not externally rotated enough at the catch',
    ],
    causes: ['어깨 가동성·안정성 부족', '회전근개 약화', '락아웃 자세 불량', '좁은/부적절한 그립'],
    causesEn: ['Poor shoulder mobility/stability', 'Weak rotator cuff', 'Poor lockout position', 'Narrow/improper grip'],
    prevention: [
      '회전근개·견갑 안정화 운동 병행',
      '오버헤드 가동성(흉추·어깨) 워밍업 충분히',
      '바를 머리 뒤 안정적 위치에 락아웃',
      '가동성 범위에 맞는 그립 너비 사용',
    ],
    preventionEn: [
      'Include rotator-cuff and scapular stability work',
      'Warm up overhead mobility (T-spine & shoulder) thoroughly',
      'Lock the bar out in a stable position behind the head',
      'Use a grip width that matches your mobility',
    ],
  },
  {
    area: '손목',
    areaEn: 'Wrist',
    risk: 'mid',
    lifts: ['클린 (프론트 랙)', '저크', '푸시 프레스', '프론트 스쿼트'],
    liftsEn: ['Clean (front rack)', 'Jerk', 'Push Press', 'Front Squat'],
    positions: [
      '클린을 프론트 랙으로 받을 때 손목이 과도하게 꺾일 때',
      '저크·프레스 락아웃 충격이 손목에 실릴 때',
    ],
    positionsEn: [
      'When the wrist over-extends catching a clean in the front rack',
      'When jerk/press lockout impact loads the wrist',
    ],
    causes: ['손목 가동성 부족', '바가 손바닥 뒤가 아닌 손가락 끝에 실림', '급격한 부하 증가'],
    causesEn: ['Poor wrist mobility', 'Bar resting on the fingertips instead of the heel of the palm', 'Sudden load increase'],
    prevention: [
      '운동 전 손목 가동성·강화 운동',
      '바를 손바닥 뒤꿈치 쪽에 얹어 랙 포지션 안정화',
      '필요 시 리스트랩 사용, 점진적 부하',
    ],
    preventionEn: [
      'Wrist mobility and strengthening before training',
      'Rest the bar on the heel of the palm to stabilize the rack',
      'Use wrist wraps if needed and load progressively',
    ],
  },
  {
    area: '무릎',
    areaEn: 'Knee',
    risk: 'high',
    lifts: ['백 스쿼트', '프론트 스쿼트', '클린', '런지'],
    liftsEn: ['Back Squat', 'Front Squat', 'Clean', 'Lunge'],
    positions: [
      '스쿼트 바닥에서 무릎이 안쪽으로 무너질 때(밸거스)',
      '클린·스쿼트를 무겁게 받으며 무릎-발끝 정렬이 깨질 때',
    ],
    positionsEn: [
      'When the knees cave inward at the bottom of a squat (valgus)',
      'When knee-toe alignment breaks catching a heavy clean/squat',
    ],
    causes: ['둔근·외전근 약화', '무릎-발끝 정렬 불량', '발목 가동성 부족'],
    causesEn: ['Weak glutes/abductors', 'Poor knee-toe alignment', 'Poor ankle mobility'],
    prevention: [
      '하강·상승 내내 무릎을 발끝 방향으로 밀기',
      '둔근·고관절 외전근 강화(밴드 등)',
      '발목 가동성 확보로 정강이 전방 이동 허용',
    ],
    preventionEn: [
      'Drive the knees out over the toes throughout the descent and ascent',
      'Strengthen glutes/hip abductors (e.g. with bands)',
      'Build ankle mobility to allow the shin to travel forward',
    ],
  },
  {
    area: '팔꿈치',
    areaEn: 'Elbow',
    risk: 'mid',
    lifts: ['저크', '푸시 프레스', '클린 (받기)'],
    liftsEn: ['Jerk', 'Push Press', 'Clean (catch)'],
    positions: [
      '저크·프레스 락아웃에서 팔꿈치가 과신전될 때',
      '클린 받을 때 팔꿈치를 늦게 돌려 충격이 실릴 때',
    ],
    positionsEn: [
      'When the elbow hyperextends at jerk/press lockout',
      'When a slow elbow turnover loads the joint at the clean catch',
    ],
    causes: ['빠른 팔꿈치 턴오버 부족', '과도한 락아웃 충격', '약한 삼두·연부조직'],
    causesEn: ['Slow elbow turnover', 'Excessive lockout impact', 'Weak triceps/soft tissue'],
    prevention: [
      '클린 팔꿈치 빠르게 돌리는 드릴 연습',
      '락아웃 시 살짝 여유 두고 부드럽게 잠그기',
      '점진적 부하 + 삼두 보강',
    ],
    preventionEn: [
      'Drill a fast elbow turnover on the clean',
      'Lock out smoothly with a slight margin, not slamming',
      'Progressive loading plus triceps strengthening',
    ],
  },
  {
    area: '고관절',
    areaEn: 'Hip',
    risk: 'mid',
    lifts: ['백 스쿼트', '프론트 스쿼트', '오버헤드 스쿼트'],
    liftsEn: ['Back Squat', 'Front Squat', 'Overhead Squat'],
    positions: [
      '깊은 스쿼트 바닥에서 골반이 말리는(버트윙크) 구간',
      '본인 가동범위보다 깊게 앉을 때 임핀지먼트',
    ],
    positionsEn: [
      'The butt-wink zone where the pelvis tucks under at the bottom of a deep squat',
      'Impingement when squatting deeper than your range of motion',
    ],
    causes: ['고관절 가동성 부족', '스탠스/발끝 각도 부적절', '과도한 깊이'],
    causesEn: ['Poor hip mobility', 'Improper stance/toe angle', 'Excessive depth'],
    prevention: [
      '고관절 가동성 워밍업(90/90 등)',
      '본인에게 맞는 스탠스 너비·발끝 각도 찾기',
      '중립이 유지되는 깊이까지만 앉기',
    ],
    preventionEn: [
      'Warm up hip mobility (90/90, etc.)',
      'Find the stance width and toe angle that fit you',
      'Only squat to the depth where neutral is maintained',
    ],
  },
  {
    area: '목 (경추)',
    areaEn: 'Neck (cervical)',
    risk: 'mid',
    lifts: ['백 스쿼트', '데드리프트'],
    liftsEn: ['Back Squat', 'Deadlift'],
    positions: ['무거운 스쿼트·데드에서 시선을 과도하게 위로 들어 목을 꺾을 때'],
    positionsEn: ['When looking too far up on a heavy squat/deadlift cranks the neck back'],
    causes: ['과도한 목 신전', '잘못된 시선 처리'],
    causesEn: ['Excessive neck extension', 'Poor gaze management'],
    prevention: ['시선은 약간 앞·아래 중립 유지', '턱을 살짝 당겨 머리-척추 정렬'],
    preventionEn: ['Keep the gaze slightly forward/down in neutral', 'Tuck the chin slightly to align head and spine'],
  },
]

export const RISK_LABEL = {
  high: '주의',
  mid: '관리',
}

export const RISK_LABEL_EN = {
  high: 'Caution',
  mid: 'Manage',
}
