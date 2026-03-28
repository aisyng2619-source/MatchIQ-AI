import React from 'react'
import { scoreColor, scoreBarColor, confidenceLabel } from '../utils/helpers'

export default function ConfidenceIndicator({ value, size = 'md' }) {
  const color = scoreColor(value)
  const barColor = scoreBarColor(value)
  const label = confidenceLabel(value)

  if (size === 'sm') {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 bg-surface-500 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${value}%`, background: barColor }} />
        </div>
        <span className={`text-xs font-mono font-500 ${color}`}>{value}%</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 uppercase tracking-widest">Confidence</span>
        <span className={`text-sm font-display font-700 ${color}`}>{label}</span>
      </div>
      <div className="h-2 bg-surface-500 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: barColor, boxShadow: `0 0 8px ${barColor}50` }}
        />
      </div>
      <span className={`text-xs font-mono ${color} self-end`}>{value}%</span>
    </div>
  )
}
