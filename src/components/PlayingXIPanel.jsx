import React from 'react'

const ROLE_STYLES = {
  'Opener':      { color: '#38bdf8', bg: '#38bdf815' },
  'Anchor':      { color: '#00e5a0', bg: '#00e5a015' },
  'Finisher':    { color: '#f43f5e', bg: '#f43f5e15' },
  'All-rounder': { color: '#fbbf24', bg: '#fbbf2415' },
  'Spinner':     { color: '#a78bfa', bg: '#a78bfa15' },
  'Pacer':       { color: '#fb923c', bg: '#fb923c15' },
}

export default function PlayingXIPanel({ team, players = [] }) {
  return (
    <div className="bg-surface-700 border border-surface-500 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-700 text-white text-base">{team}</h3>
        <span className="text-xs font-mono text-slate-500">XI</span>
      </div>

      <div className="space-y-1.5">
        {players.map((p, i) => {
          const style = ROLE_STYLES[p.role] || { color: '#64748b', bg: '#64748b15' }
          return (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-600 transition-colors"
            >
              {/* Number */}
              <span className="text-xs font-mono text-slate-600 w-4 flex-shrink-0">{i + 1}</span>

              {/* Player name */}
              <span className="flex-1 text-sm text-slate-200 font-body">{p.name}</span>

              {/* Role badge */}
              <span
                className="text-xs font-mono px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ color: style.color, background: style.bg }}
              >
                {p.role}
              </span>

              {/* Type dot */}
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                p.type === 'bat' ? 'bg-info' :
                p.type === 'bowl' ? 'bg-orange-400' :
                'bg-amber-400'
              }`} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
