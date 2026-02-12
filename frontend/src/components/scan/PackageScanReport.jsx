/**
 * Package Scan Report - TRYMINT Security Report format
 * Aligned with HACKATHON_WINNING_GUIDE.md report structure
 */

import { useMemo } from 'react'
import {
  AlertTriangle,
  CheckCircle,
  FileText,
  Globe,
  Shield,
  Package,
  ChevronDown,
  ChevronUp,
  Code,
} from 'lucide-react'
import { useState } from 'react'

const SEVERITY_COLORS = {
  CRITICAL: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  HIGH: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  MODERATE: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  MEDIUM: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  LOW: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  MINIMAL: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
}

function getScoreColor(score) {
  if (score <= 2.5) return '#00ff88'
  if (score <= 5) return '#fbbf24'
  if (score <= 7.5) return '#f97316'
  return '#ef4444'
}

function categorizeTriggers(triggers = [], effects = []) {
  const critical = []
  const high = []
  const medium = []
  const low = []

  for (const t of triggers) {
    const tl = (t || '').toLowerCase()
    if (tl.includes('fork bomb') || tl.includes('base64') || tl.includes('eval') || tl.includes('shutdown')) {
      critical.push(t)
    } else if (tl.includes('credential') || tl.includes('pipe-to-shell') || tl.includes('chmod')) {
      high.push(t)
    } else if (tl.includes('install script') || tl.includes('recursive') || tl.includes('network')) {
      medium.push(t)
    } else {
      low.push(t)
    }
  }

  for (const e of effects) {
    const type = e.type || ''
    const target = e.target || ''
    if (type === 'REMOTE_EXECUTION' || (type === 'NETWORK_REQUEST' && target.includes('.'))) {
      high.push(`${type}: ${target}`)
    } else if (type.includes('FILE') || type.includes('TRAVERSAL')) {
      medium.push(`${type}: ${target}`)
    }
  }

  return { critical, high, medium, low }
}

export default function PackageScanReport({ result }) {
  const [expandedSections, setExpandedSections] = useState({ analysis: false })

  const {
    package: pkg,
    scannedAt,
    finalScore = 0,
    totalScore = 0,
    riskLevel,
    destructiveness = 0,
    privilege = 0,
    dependencyRisk = 0,
    networkRisk = 0,
    behavioralRisk = 0,
    trymintInsight = '',
    aiSummaryUsed,
    aiSummaryError,
    triggers = [],
    analysisSteps = [],
    effects = [],
    warnings = [],
    sourceCodeFindings = [],
    canExecute,
  } = result || {}

  const displayScore = totalScore > 0 ? totalScore : finalScore * 10
  const scoreColor = getScoreColor(displayScore / 10)
  const { critical, high, medium, low } = useMemo(
    () => categorizeTriggers(triggers, effects),
    [triggers, effects]
  )
  const hasFindings = critical.length + high.length + medium.length + low.length > 0

  const toggleSection = (key) => {
    setExpandedSections((s) => ({ ...s, [key]: !s[key] }))
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#111827] rounded-xl border border-[#1f2937] overflow-hidden">
      {/* Header - compact single row */}
      <div className="px-5 py-4 border-b border-[#1f2937]">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-14 h-14 flex-shrink-0">
              <svg className="transform -rotate-90 w-14 h-14" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" stroke="#1f2937" strokeWidth="5" fill="none" />
                <circle
                  cx="28" cy="28" r="24"
                  stroke={scoreColor}
                  strokeWidth="5"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 24}
                  strokeDashoffset={2 * Math.PI * 24 - (displayScore / 100) * 2 * Math.PI * 24}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-bold" style={{ color: scoreColor }}>{displayScore}</span>
                <span className="text-[10px] text-gray-500">/100</span>
              </div>
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-white truncate">TRYMINT Security Report</h2>
              <p className="text-sm text-gray-400 font-mono truncate">{pkg}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400'
                  : riskLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-400'
                  : riskLevel === 'MODERATE' ? 'bg-yellow-500/20 text-yellow-400'
                  : riskLevel === 'LOW' ? 'bg-blue-500/20 text-blue-400'
                  : riskLevel === 'MINIMAL' ? 'bg-green-500/20 text-green-400'
                  : 'bg-gray-500/20 text-gray-400'
              }`}
            >
              {riskLevel || 'UNKNOWN'}
            </span>
            {canExecute ? (
              <span className="text-xs text-green-400">✓ Safe</span>
            ) : (
              <span className="text-xs text-red-400">⚠ Caution</span>
            )}
          </div>
        </div>
        <p className="text-[10px] text-gray-500 mt-1.5">
          Scanned: {scannedAt ? new Date(scannedAt).toLocaleString() : '—'}
        </p>
      </div>

      {/* Findings */}
      {hasFindings && (
        <div className="px-5 py-4 border-b border-[#1f2937] space-y-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Findings
          </h3>

          {critical.length > 0 && (
            <div className={`p-2.5 rounded-lg border ${SEVERITY_COLORS.CRITICAL.bg} ${SEVERITY_COLORS.CRITICAL.border}`}>
              <h4 className={`text-xs font-semibold ${SEVERITY_COLORS.CRITICAL.text} mb-1.5`}>🔴 CRITICAL ({critical.length})</h4>
              <ul className="space-y-0.5 text-xs text-gray-300">
                {critical.map((c, i) => (
                  <li key={i}>• {c}</li>
                ))}
              </ul>
            </div>
          )}
          {high.length > 0 && (
            <div className={`p-2.5 rounded-lg border ${SEVERITY_COLORS.HIGH.bg} ${SEVERITY_COLORS.HIGH.border}`}>
              <h4 className={`text-xs font-semibold ${SEVERITY_COLORS.HIGH.text} mb-1.5`}>🟠 HIGH ({high.length})</h4>
              <ul className="space-y-0.5 text-xs text-gray-300">
                {high.map((h, i) => (
                  <li key={i}>• {h}</li>
                ))}
              </ul>
            </div>
          )}
          {medium.length > 0 && (
            <div className={`p-2.5 rounded-lg border ${SEVERITY_COLORS.MEDIUM.bg} ${SEVERITY_COLORS.MEDIUM.border}`}>
              <h4 className={`text-xs font-semibold ${SEVERITY_COLORS.MEDIUM.text} mb-1.5`}>🟡 MEDIUM ({medium.length})</h4>
              <ul className="space-y-0.5 text-xs text-gray-300">
                {medium.map((m, i) => (
                  <li key={i}>• {m}</li>
                ))}
              </ul>
            </div>
          )}
          {low.length > 0 && (
            <div className={`p-2.5 rounded-lg border ${SEVERITY_COLORS.LOW.bg} ${SEVERITY_COLORS.LOW.border}`}>
              <h4 className={`text-xs font-semibold ${SEVERITY_COLORS.LOW.text} mb-1.5`}>🟢 LOW ({low.length})</h4>
              <ul className="space-y-0.5 text-xs text-gray-300">
                {low.map((l, i) => (
                  <li key={i}>• {l}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Behavior Summary - compact */}
      <div className="px-5 py-4 border-b border-[#1f2937]">
        <div className="flex flex-wrap justify-between gap-x-6 gap-y-3 mb-3">
          {[
            { label: 'Dependency', value: dependencyRisk ?? 0, icon: Package },
            { label: 'Destructive', value: destructiveness ?? 0, icon: Shield },
            { label: 'Behavioral', value: behavioralRisk ?? 0, icon: AlertTriangle },
            { label: 'Network', value: networkRisk ?? 0, icon: Globe },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="w-3 h-3 text-gray-500 flex-shrink-0" />
              <span className="text-xs text-gray-500">{label}:</span>
              <span className="font-mono text-sm font-semibold" style={{ color: getScoreColor(value / 2.5) }}>
                {value}/25
              </span>
            </div>
          ))}
        </div>
        {trymintInsight && (
          <div className="p-2.5 rounded-lg bg-[#0a0f1a] border border-[#1f2937]">
            <div className="text-[10px] text-gray-500 mb-1 flex items-center gap-1.5">
              TRYMINT Insight
              {aiSummaryUsed && <span className="text-[#00ff88]">(AI)</span>}
            </div>
            <p className="text-xs text-gray-300 italic leading-relaxed">&quot;{trymintInsight}&quot;</p>
            {aiSummaryError && (
              <p className="text-[10px] text-amber-400 mt-1.5">⚠ {aiSummaryError}</p>
            )}
          </div>
        )}
      </div>

      {/* Source Code Findings */}
      {sourceCodeFindings?.length > 0 && (
        <div className="px-5 py-4 border-b border-[#1f2937]">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5" />
            Source Code Analysis
          </h3>
          <div className="space-y-1.5">
            {sourceCodeFindings.map((f, i) => (
              <div key={i} className="p-2 bg-[#0a0f1a] rounded border border-amber-500/30">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-amber-400 truncate">{f.name}</span>
                  <span className="text-[10px] text-gray-500 truncate flex-shrink-0">{f.file}</span>
                </div>
                {f.snippet && (
                  <code className="text-[10px] text-gray-500 block truncate font-mono mt-0.5">{f.snippet}</code>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings?.length > 0 && (
        <div className="px-5 py-4 border-b border-[#1f2937]">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
            Warnings
          </h3>
          <ul className="space-y-1 text-xs text-gray-400">
            {warnings.map((w, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-yellow-400">•</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Analysis Steps (collapsible) */}
      {analysisSteps?.length > 0 && (
        <div className="px-5 py-4">
          <button
            onClick={() => toggleSection('analysis')}
            className="w-full flex items-center justify-between text-sm font-semibold text-gray-300 hover:text-white transition-colors"
          >
            Analysis Details
            {expandedSections.analysis ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedSections.analysis && (
            <div className="mt-3 space-y-2 text-xs">
              {analysisSteps.map((section, i) => (
                <div key={i}>
                  <div className="text-[#00ff88] font-medium mb-1">{section.section}</div>
                  <ul className="space-y-1 text-gray-400 ml-2">
                    {section.steps?.map((step, j) => (
                      <li key={j}>
                        {step.check}: {step.result}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Passed checks when minimal/low risk */}
      {displayScore < 41 && (
        <div className="px-5 py-3 border-t border-[#1f2937] bg-green-500/5">
          <div className="flex items-center gap-2 text-xs text-green-400">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>No critical or high-risk findings. Package appears safe for installation.</span>
          </div>
        </div>
      )}
    </div>
  )
}
