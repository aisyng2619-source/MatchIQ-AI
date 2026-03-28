import React from 'react'

export default function MatchupCard({ batter, bowler, edge, metric, why, variant = 'favorable' }) {
  const isFav = variant === 'favorable'
  const borderColor = isFav ? '#00e5a0' : '#f43f5e'
  const badgeClass  = isFav
    ? 'bg-brand/15 text-brand border-brand/30'
    : 'bg-danger/15 text-danger border-danger/30'
  const icon = isFav ? '⚡' : '⚠️'

  return (
    <div
      className="bg-surface-700 border border-surface-500 rounded-xl p-4 card-hover"
      style={{ borderLeft: `3px solid ${borderColor}` }}
    >
      {/* Matchup header */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${badgeClass}`}>
          {icon} {isFav ? 'FAVOURABLE' : 'DANGER'}
        </span>
      </div>

      {/* Players */}
      <div className="flex items-center gap-2 mb-2">
        <span className="font-display font-700 text-white text-sm">{batter}</span>
        <span className="text-slate-500 text-xs">vs</span>
        <span className="font-display font-600 text-slate-300 text-sm">{bowler}</span>
      </div>

      {/* Edge */}
      <p className="text-xs text-slate-400 mb-2 leading-relaxed">{edge}</p>

      {/* Metric pill */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-slate-500">{metric}</span>
      </div>

      {/* Why it matters */}
      <div className="mt-3 pt-3 border-t border-surface-500">
        <p className="text-xs text-slate-500 leading-relaxed">{why}</p>
      </div>
    </div>
  )
}
