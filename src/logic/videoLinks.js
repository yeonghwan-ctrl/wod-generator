// 종목별 "자세 영상" 유튜브 검색 링크.
// 특정 영상 ID를 하드코딩하지 않아(삭제·비공개 위험) 항상 관련 영상으로 연결된다.
// label 은 현재 언어로 지역화된 종목명을 넘긴다.
export function liftVideoUrl(label, lang = 'ko') {
  if (!label) return null
  const q = lang === 'en' ? `${label} weightlifting technique` : `${label} 자세`
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`
}

// 큐레이션된 영상 ID → 임베드 URL
export function liftEmbedUrl(videoId) {
  if (!videoId) return null
  return `https://www.youtube.com/embed/${videoId}`
}
