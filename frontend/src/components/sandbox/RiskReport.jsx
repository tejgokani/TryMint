import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  AlertTriangle,
  FileText,
  Clock,
  Info,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { useSandbox } from '../../context/SandboxContext'

export default function RiskReport() {
  const { riskScore, changedFiles, warnings, recommendations, postmortemReport, postmortemHistory } = useSandbox()
  const [activeTab, setActiveTab] = useState('report')
  const [warningsExpanded, setWarningsExpanded] = useState(true)
  const [animatedScore, setAnimatedScore] = useState(0)

  const displayScore = postmortemReport?.overallScore != null ? postmortemReport.overallScore : riskScore
  const maxScore = postmortemReport ? 100 : 10

  // Animate risk score count-up
  useEffect(() => {
    const target = postmortemReport ? displayScore : riskScore
    const duration = 1000
    const steps = 60
    const increment = target / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setAnimatedScore(target)
        clearInterval(timer)
      } else {
        setAnimatedScore(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [riskScore, postmortemReport, displayScore])

  // Memoize risk color calculation (0-10 or 0-100 scale)
  const getRiskColor = useCallback((score) => {
    const s = score > 10 ? score / 10 : score // normalize 0-100 to 0-10 for color
    if (s <= 3) return '#00ff88' // Green
    if (s <= 6) return '#fbbf24' // Yellow
    return '#ef4444' // Red
  }, [])

  // Memoize risk color for current score
  const riskColor = useMemo(() => getRiskColor(animatedScore), [animatedScore, getRiskColor])

  // Calculate circular progress
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const progressRatio = maxScore === 100 ? displayScore / 100 : riskScore / 10

  return (
    <div className="w-full lg:w-[300px] bg-[#111827] border-l border-[#1f2937] flex flex-col h-full">
      {/* Header */}
      <div className="p-3 md:p-4 border-b border-[#1f2937]">
        <h2 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Risk Report</h2>

        {/* Circular Risk Score */}
        <div className="flex justify-center mb-3 md:mb-4">
          <div className="relative w-24 h-24 md:w-32 md:h-32">
            <svg className="transform -rotate-90 w-24 h-24 md:w-32 md:h-32">
              {/* Background circle */}
              <circle
                cx="48"
                cy="48"
                r="40"
                className="md:hidden"
                stroke="#1f2937"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="50"
                className="hidden md:block"
                stroke="#1f2937"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="48"
                cy="48"
                r="40"
                className="md:hidden"
                stroke={getRiskColor(animatedScore)}
                strokeWidth="6"
                fill="none"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 - (animatedScore / maxScore) * 2 * Math.PI * 40}
                strokeLinecap="round"
              />
              <circle
                cx="64"
                cy="64"
                r="50"
                className="hidden md:block transition-all duration-1000 ease-out"
                stroke={getRiskColor(animatedScore)}
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (animatedScore / maxScore) * circumference}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-xl md:text-2xl font-bold animate-count-up"
                style={{ color: getRiskColor(animatedScore) }}
              >
                {animatedScore}
              </span>
              <span className="text-xs text-gray-400">/{maxScore}</span>
            </div>
          </div>
        </div>

        {/* TRYMINT breakdown (when from postmortem deep scan) */}
        {postmortemReport?.trymintScores && (
          <div className="mb-3 p-2 bg-[#0a0f1a] rounded border border-[#1f2937] text-[10px]">
            <div className="text-gray-500 mb-1">TRYMINT (0–25 per category, lower = safer)</div>
            <div className="flex flex-wrap gap-x-2 gap-y-0.5">
              <span>Dep:{postmortemReport.trymintScores.dependency}</span>
              <span>Dest:{postmortemReport.trymintScores.destructive}</span>
              <span>Beh:{postmortemReport.trymintScores.behavioral}</span>
              <span>Net:{postmortemReport.trymintScores.network}</span>
            </div>
          </div>
        )}
        {postmortemReport?.categories && Object.keys(postmortemReport.categories).length > 0 && (
          <div className="mb-3 p-2 bg-[#0a0f1a] rounded border border-[#1f2937] text-[10px] space-y-1">
            <div className="text-gray-500 mb-1">Categories</div>
            {Object.values(postmortemReport.categories).map((cat) => (
              <div key={cat.name} className="flex justify-between items-center">
                <span className="text-gray-400">{cat.name}</span>
                <span className={cat.status === 'pass' ? 'text-green-400' : cat.status === 'warn' ? 'text-amber-400' : 'text-red-400'}>
                  {cat.score}% {cat.status === 'pass' ? '✓' : cat.status === 'warn' ? '!' : '✗'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('report')}
            className={`flex-1 px-3 py-1.5 text-sm rounded transition-colors ${
              activeTab === 'report'
                ? 'bg-[#00ff88] text-[#0a0f1a] font-semibold'
                : 'bg-[#0a0f1a] text-gray-400 hover:text-white'
            }`}
          >
            Risk Report
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-3 py-1.5 text-sm rounded transition-colors ${
              activeTab === 'history'
                ? 'bg-[#00ff88] text-[#0a0f1a] font-semibold'
                : 'bg-[#0a0f1a] text-gray-400 hover:text-white'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'report' ? (
          <div className="space-y-4">
            {/* Changed Files */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Changed Files
              </h3>
              <div className="space-y-2">
                {changedFiles.length === 0 && warnings.length === 0 && !postmortemReport && riskScore === 0 ? (
                  <p className="text-xs text-gray-500 italic py-2">
                    Submit a command in the terminal or run <span className="font-mono text-gray-400">postmortem</span> to see risk analysis
                  </p>
                ) : null}
                {changedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-[#0a0f1a] rounded border border-[#1f2937]"
                  >
                    <span className="text-xs text-gray-300 truncate flex-1">{file.name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-medium ${
                        file.type === 'created'
                          ? 'bg-blue-500/20 text-blue-400'
                          : file.type === 'read'
                            ? 'bg-gray-500/20 text-gray-400'
                            : file.type === 'analyzed'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-[#00ff88]/20 text-[#00ff88]'
                      }`}
                    >
                      {file.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Findings / Warnings */}
            <div>
              <button
                onClick={() => setWarningsExpanded(!warningsExpanded)}
                className="w-full flex items-center justify-between p-2 bg-[#0a0f1a] rounded border border-[#1f2937] hover:bg-[#1f2937] transition-colors"
              >
                <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  {postmortemReport ? 'Findings' : 'Warnings'}
                  {warnings.length > 0 && (
                    <span className="text-[10px] font-normal text-gray-500">({warnings.length})</span>
                  )}
                </h3>
                {warningsExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>
              {warningsExpanded && (
                <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                  {warnings.length === 0 ? (
                    <p className="text-xs text-gray-500 italic py-2">No findings</p>
                  ) : (
                    warnings.map((warning, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-2 p-2 rounded border ${
                          warning.type === 'critical'
                            ? 'bg-red-500/10 border-red-500/30'
                            : warning.type === 'warning'
                              ? 'bg-amber-500/10 border-amber-500/30'
                              : 'bg-[#0a0f1a] border-[#1f2937]'
                        }`}
                      >
                        {warning.type === 'critical' ? (
                          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        ) : warning.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="min-w-0 flex-1">
                          <span className="text-xs text-gray-300 block">{warning.message}</span>
                          {warning.location && (
                            <span className="text-[10px] text-gray-500 font-mono mt-0.5 block">{warning.location}</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Suggested Changes (from postmortem recommendations) */}
            {recommendations.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-[#00ff88]" />
                  Suggested Changes
                </h3>
                <div className="space-y-2">
                  {recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="p-2 bg-[#0a0f1a] rounded border border-[#1f2937]"
                    >
                      <div className="text-xs font-medium text-[#00ff88] mb-1">
                        {index + 1}. {rec.action}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {rec.reason}
                        {rec.effort && (
                          <span className="ml-1 text-gray-600">· Effort: {rec.effort}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-300">Postmortem History</h3>
            {postmortemHistory.length === 0 ? (
              <p className="text-xs text-gray-500 italic py-2">No postmortem runs yet. Run <span className="font-mono text-gray-400">postmortem</span> in the terminal.</p>
            ) : (
              <div className="space-y-2">
                {postmortemHistory.map((item, index) => (
                  <div
                    key={index}
                    className="p-2 bg-[#0a0f1a] rounded border border-[#1f2937]"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">{item.package}</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded font-medium"
                        style={{
                          backgroundColor: `${getRiskColor(item.score)}20`,
                          color: getRiskColor(item.score),
                        }}
                      >
                        {item.score}/100
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {item.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
