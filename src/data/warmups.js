// HWPO 스타일 데일리 워밍업
// 각 훈련일의 "주 종목"에 맞춰 4단계로 몸을 준비한다.
//   raise(체온 올리기) → mobility(가동성) → activation(활성화) → ramp(바벨 램프업)
// blocks: [{ key, title, items: [{ name, dose }] }]
//   key 는 컴포넌트에서 아이콘/색을 매핑하는 데 쓰인다.

// 자주 쓰는 공통 블록(중복 제거용)
const RAISE_ROW = { key: 'raise', title: '체온 올리기', items: [
  { name: '로잉 / 에어바이크 가볍게', dose: '2분' },
  { name: '점핑잭 + 암서클', dose: '30초씩' },
] }

export const WARMUPS = {
  // ───── 스내치 데이 (오버헤드/스내치 패턴) ─────
  snatchDay: {
    focus: '스내치 · 오버헤드 준비',
    theme: 'technique',
    blocks: [
      RAISE_ROW,
      { key: 'mobility', title: '가동성', items: [
        { name: '밴드/PVC 어깨 패스스루', dose: '15회' },
        { name: '손목 가동성 (앞뒤·좌우)', dose: '각 10회' },
        { name: '발목 니 투 월', dose: '좌우 10회' },
      ] },
      { key: 'activation', title: '활성화', items: [
        { name: '밴드 풀 어파트', dose: '20회' },
        { name: '밴드 페이스 풀', dose: '15회' },
      ] },
      { key: 'ramp', title: '바벨 램프업', items: [
        { name: 'PVC 오버헤드 스쿼트', dose: '10회' },
        { name: '빈 봉 스내치 하이 풀 → 파워 스내치', dose: '각 5회' },
        { name: '빈 봉 스내치 (3포지션)', dose: '3세트' },
      ] },
    ],
  },

  // ───── 클린 앤 저크 데이 ─────
  cleanJerkDay: {
    focus: '클린 · 저크 준비',
    theme: 'olympic',
    blocks: [
      RAISE_ROW,
      { key: 'mobility', title: '가동성', items: [
        { name: '프론트 랙 스트레칭', dose: '30초 × 2' },
        { name: '손목 가동성', dose: '각 10회' },
        { name: '90/90 고관절 회전', dose: '좌우 8회' },
      ] },
      { key: 'activation', title: '활성화', items: [
        { name: '밴드 글루트 브릿지', dose: '15회' },
        { name: '밴드 풀 어파트', dose: '20회' },
      ] },
      { key: 'ramp', title: '바벨 램프업', items: [
        { name: '빈 봉 프론트 스쿼트', dose: '8회' },
        { name: '빈 봉 클린 풀 → 행 클린', dose: '각 5회' },
        { name: '빈 봉 푸시 프레스 → 저크', dose: '각 5회' },
      ] },
    ],
  },

  // ───── 파워 / 스피드 데이 ─────
  powerDay: {
    focus: '폭발력 · 스피드 준비',
    theme: 'strength',
    blocks: [
      { key: 'raise', title: '체온 올리기', items: [
        { name: '줄넘기 / 더블언더', dose: '2분' },
        { name: '마운틴 클라이머', dose: '30초' },
      ] },
      { key: 'mobility', title: '가동성', items: [
        { name: '레그 스윙 (앞뒤·좌우)', dose: '각 10회' },
        { name: '흉추 회전 (오픈북)', dose: '좌우 8회' },
      ] },
      { key: 'activation', title: '활성화', items: [
        { name: '박스 점프 (낮게)', dose: '5회' },
        { name: '밴드 스프린트 / 빠른 스쿼트', dose: '10회' },
      ] },
      { key: 'ramp', title: '바벨 램프업', items: [
        { name: 'PVC 패스스루 + 오버헤드 스쿼트', dose: '10회' },
        { name: '빈 봉 파워 스내치 / 파워 클린', dose: '각 5회' },
      ] },
    ],
  },

  // ───── 스트렝스 데이 (스쿼트/데드/프레스) ─────
  squatDay: {
    focus: '스쿼트 · 데드 준비',
    theme: 'pull',
    blocks: [
      { key: 'raise', title: '체온 올리기', items: [
        { name: '에어바이크 / 로잉', dose: '2분' },
        { name: '워킹 런지', dose: '10보' },
      ] },
      { key: 'mobility', title: '가동성', items: [
        { name: '90/90 고관절', dose: '좌우 8회' },
        { name: '발목 니 투 월', dose: '좌우 10회' },
        { name: '흉추 회전', dose: '좌우 8회' },
      ] },
      { key: 'activation', title: '활성화', items: [
        { name: '밴드 글루트 브릿지', dose: '15회' },
        { name: '밴드 몬스터 워크', dose: '좌우 10보' },
        { name: '버드 독', dose: '좌우 10회' },
      ] },
      { key: 'ramp', title: '바벨 램프업', items: [
        { name: '빈 봉 굿모닝', dose: '10회' },
        { name: '빈 봉 백 스쿼트 → 점진 가중', dose: '2~3세트' },
      ] },
    ],
  },

  // ───── 스내치 테크닉 데이 ─────
  snatchTechDay: {
    focus: '스내치 테크닉 준비',
    theme: 'technique',
    blocks: [
      RAISE_ROW,
      { key: 'mobility', title: '가동성', items: [
        { name: '어깨 패스스루', dose: '15회' },
        { name: '손목 가동성', dose: '각 10회' },
        { name: '오버헤드 월 슬라이드', dose: '12회' },
      ] },
      { key: 'activation', title: '활성화', items: [
        { name: '밴드 풀 어파트', dose: '20회' },
        { name: 'Y-T-W 레이즈', dose: '각 8회' },
      ] },
      { key: 'ramp', title: '바벨 램프업', items: [
        { name: 'PVC 스내치 드릴 (3포지션)', dose: '5회씩' },
        { name: '빈 봉 박스/행 스내치', dose: '3세트' },
      ] },
    ],
  },

  // ───── 클린 테크닉 데이 ─────
  cleanTechDay: {
    focus: '클린 테크닉 준비',
    theme: 'olympic',
    blocks: [
      RAISE_ROW,
      { key: 'mobility', title: '가동성', items: [
        { name: '프론트 랙 스트레칭', dose: '30초 × 2' },
        { name: '90/90 고관절', dose: '좌우 8회' },
      ] },
      { key: 'activation', title: '활성화', items: [
        { name: '밴드 글루트 활성화', dose: '15회' },
        { name: '밴드 풀 어파트', dose: '20회' },
      ] },
      { key: 'ramp', title: '바벨 램프업', items: [
        { name: '빈 봉 클린 데드리프트', dose: '8회' },
        { name: '클린 드릴 (3포지션)', dose: '5회씩' },
        { name: '저크 풋워크 드릴', dose: '10회' },
      ] },
    ],
  },
}

// 커스텀 모드용: 그날 들어간 종목 카테고리로 워밍업을 조립한다.
const GENERIC_RAMP = {
  olympic: { name: '빈 봉 올림픽 리프트 드릴', dose: '3세트' },
  technique: { name: 'PVC / 빈 봉 패턴 연습', dose: '2세트' },
  pull: { name: '빈 봉 데드리프트 · 풀', dose: '8회' },
  strength: { name: '빈 봉 → 점진 가중 세트', dose: '2~3세트' },
}

export function genericWarmup(categories = []) {
  const set = new Set(categories)
  const ramp = []
  ;['olympic', 'technique', 'pull', 'strength'].forEach((c) => {
    if (set.has(c) && GENERIC_RAMP[c]) ramp.push(GENERIC_RAMP[c])
  })
  if (!ramp.length) ramp.push({ name: '빈 봉으로 본 운동 패턴 연습', dose: '2세트' })

  return {
    focus: '오늘 종목 맞춤 준비',
    theme: 'accent',
    blocks: [
      RAISE_ROW,
      { key: 'mobility', title: '가동성', items: [
        { name: '어깨 패스스루', dose: '15회' },
        { name: '90/90 고관절', dose: '좌우 8회' },
        { name: '발목 니 투 월', dose: '좌우 10회' },
      ] },
      { key: 'activation', title: '활성화', items: [
        { name: '밴드 풀 어파트', dose: '20회' },
        { name: '밴드 글루트 브릿지', dose: '15회' },
      ] },
      { key: 'ramp', title: '바벨 램프업', items: ramp },
    ],
  }
}

// 블록 key → 아이콘/한글 보조 라벨
export const BLOCK_META = {
  raise: { icon: '🔥', hint: '심박·체온 ↑' },
  mobility: { icon: '🧘', hint: '관절 가동성' },
  activation: { icon: '⚡', hint: '근육 깨우기' },
  ramp: { icon: '🏋️', hint: '본 운동 패턴' },
}
