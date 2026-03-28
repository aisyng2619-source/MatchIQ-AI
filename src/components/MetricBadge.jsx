import React from 'react'
import { scoreColor, scoreBarColor, clamp } from '../utils/helpers'

export default function MetricBadge({ label, value, description, inverted = false }) {
  // inverted = lower is better (e.g. injury risk)
  const displayVal = inverted ? 100 - value : value
  const color = scoreColor(displayVal)
  const barColor = scoreBarColor(displayVal)
  const pct = clamp(value)

  return (
    <div className="bg-surface-700 border border-surface-500 rounded-xl p-4 card-hover flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-body uppercase tracking-widest">{label}</span>
        <span className={`text-xl font-display font-700 ${color}`}>{value}</span>
      </div>
      {/* Bar */}
      <div className="h-1.5 bg-surface-500 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>
      {description && (
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      )}
    </div>
  )
}
