import React from 'react'

export default function SummaryCard({ summary, teamA, teamB }) {
  return (
    <div className="relative bg-surface-700 border border-brand/25 rounded-2xl p-6 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-brand/5 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-brand/20 border border-brand/30 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1.5L8.8 5.2L13 5.7L10 8.6L10.7 12.8L7 10.8L3.3 12.8L4 8.6L1 5.7L5.2 5.2L7 1.5Z"
                stroke="#00e5a0" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="text-xs font-mono text-brand uppercase tracking-widest">Captain Brief</p>
            {teamA && teamB && (
              <p className="text-xs text-slate-500 mt-0.5">{teamA} vs {teamB}</p>
            )}
          </div>
        </div>

        {/* Summary text */}
        <p className="text-slate-200 text-sm leading-relaxed font-body">
          {summary}
        </p>

        {/* Decorative line */}
        <div className="mt-4 h-px bg-gradient-to-r from-brand/30 via-brand/10 to-transparent" />
      </div>
    </div>
  )
}
