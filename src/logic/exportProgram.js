// 프로그램을 공유용 텍스트로 변환한다.
// deps: t(현재 언어 사전), tx(데이터 언어 헬퍼) — 컴포넌트에서 주입.
export function weekToText({ week, state, t, tx }) {
  const lines = []
  lines.push(`Linkup — ${t.cycleSummary(state.cycleWeeks, state.daysPerWeek)}`)
  const note = week.note === 'deload' ? ` (${t.deload})` : ''
  lines.push(`${t.weekTab(week.weekNo)}${note}`)

  week.days.forEach((day) => {
    lines.push('')
    const name = day.name ? ` · ${tx(day, 'name')}` : ''
    lines.push(`▸ ${t.day(day.dayNo)}${name}`)
    if (!day.items.length) {
      lines.push(`  - ${t.rest}`)
      return
    }
    day.items.forEach((it) => {
      const w = it.weight != null ? `${it.weight}${state.unit || 'kg'}` : t.bwRpe
      const pct = it.percent != null ? ` @${it.percent}%` : ''
      lines.push(`  - ${tx(it, 'label')}: ${it.sets}×${it.reps}${pct} — ${w}`)
    })
  })

  return lines.join('\n')
}

// Web Share API → 실패/미지원 시 클립보드 복사. 복사했으면 true 반환.
export async function shareOrCopy({ title, text }) {
  try {
    if (navigator.share) {
      await navigator.share({ title, text })
      return false // 공유 시트로 처리됨(복사 토스트 불필요)
    }
  } catch {
    // 사용자가 공유 취소 → 클립보드 폴백으로 진행
  }
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
