/**
 * Format postmortem report for terminal display.
 * Simple list format - no tables.
 */
export function formatPostmortemReport(report) {
  if (!report) return ''
  const { packageName, packageVersion, analyzedAt, overallScore, overallRisk, categories, findings, recommendations, deepScan, trymintScores, stats } = report
  const critical = (findings || []).filter((f) => f.severity === 'critical')
  const high = (findings || []).filter((f) => f.severity === 'high')
  const lines = []

  lines.push('')
  lines.push(deepScan ? 'TRYMINT DEEP SCAN REPORT' : 'TRYMINT POSTMORTEM REPORT')
  lines.push('---')
  lines.push(`Package: ${packageName || 'unknown'}@${packageVersion || '0.0.0'}`)
  lines.push(`Analyzed: ${(analyzedAt || '').slice(0, 50)}`)
  if (deepScan && stats?.filesScanned != null) {
    lines.push(`Files: ${stats.filesScanned} | Lines: ${stats.linesScanned}`)
  }
  lines.push('')

  if (trymintScores) {
    lines.push('TRYMINT Score:')
    lines.push(`  Dependency: ${trymintScores.dependency}/25`)
    lines.push(`  Destructive: ${trymintScores.destructive}/25`)
    lines.push(`  Behavioral: ${trymintScores.behavioral}/25`)
    lines.push(`  Network: ${trymintScores.network}/25`)
    lines.push('')
  }

  lines.push(`Overall: ${overallScore ?? 0}/100 (${overallRisk || '?'})`)
  lines.push('')

  if (Object.keys(categories || {}).length > 0) {
    lines.push('Categories:')
    for (const cat of Object.values(categories || {})) {
      const tag = cat.status === 'pass' ? 'PASS' : cat.status === 'warn' ? 'WARN' : 'FAIL'
      lines.push(`  ${cat.name || '?'}: ${cat.score ?? 0}/100 [${tag}]`)
    }
    lines.push('')
  }

  if (critical.length > 0) {
    lines.push(`Critical (${critical.length}):`)
    critical.forEach((f) => {
      lines.push(`  - [${f.id}] ${f.title || f.description || '?'}`)
      if (f.location) lines.push(`    ${f.location}`)
    })
    lines.push('')
  }

  if (high.length > 0) {
    lines.push(`High (${high.length}):`)
    high.forEach((f) => {
      lines.push(`  - [${f.id}] ${f.title || f.description || '?'}`)
    })
    lines.push('')
  }

  if ((recommendations || []).length > 0) {
    lines.push('Recommendations:')
    ;(recommendations || []).slice(0, 5).forEach((r, i) => {
      lines.push(`  ${i + 1}. ${r.action || '?'}`)
      if (r.reason) lines.push(`     ${r.reason}`)
    })
  }

  lines.push('')
  return lines.join('\n')
}
