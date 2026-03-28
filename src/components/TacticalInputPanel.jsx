import React from 'react'

const SIGNALS = [
  {
    key: 'form_matchups',
    label: 'Player Form & Matchups',
    icon: '📊',
    desc: 'Recent innings, head-to-head data',
    color: '#00e5a0',
  },
  {
    key: 'pressure_stability',
    label: 'Pressure Stability',
    icon: '🧠',
    desc: 'Performance under high-pressure situations',
    color: '#38bdf8',
  },
  {
    key: 'acceleration_upside',
    label: 'Acceleration Upside',
    icon: '⚡',
    desc: 'Boundary rate and strike-rate ceiling',
    color: '#fbbf24',
  },
  {
    key: 'opp_vulnerability',
    label: 'Opposition Vulnerability',
    icon: '🎯',
    desc: 'Opposition weak zones and dismissal patterns',
    color: '#a78bfa',
  },
  {
    key: 'context_scoring',
    label: 'Context-Aware Scoring',
    icon: '🔮',
    desc: 'Venue, pitch, phase adjusted intelligence',
    color: '#f43f5e',
  },
  {
    key: 'injury_risk',
    label: 'Injury / Availability Risk',
    icon: '⚕️',
    desc: 'Recent injury background, match fitness',
    color: '#fb923c',
  },
]

export default function TacticalInputPanel({ values, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {SIGNALS.map((s) => {
        const active = values[s.key] !== false
        return (
          <button
            key={s.key}
            type="button"
            onClick={() => onChange(s.key, !active)}
            className={`text-left p-4 rounded-xl border transition-all duration-200 ${
              active
                ? 'border-opacity-50 bg-opacity-10'
                : 'border-surface-400 bg-surface-600 opacity-50'
            }`}
            style={
              active
                ? {
                    borderColor: `${s.color}40`,
                    background: `${s.color}0d`,
                  }
                : {}
            }
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{s.icon}</span>
                <div>
                  <p className="text-sm font-display font-600 text-white leading-tight">{s.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
                </div>
              </div>
              {/* Toggle pill */}
              <div
                className={`w-10 h-5 rounded-full flex-shrink-0 mt-0.5 relative transition-all duration-200 ${
                  active ? '' : 'bg-surface-400'
                }`}
                style={active ? { background: `${s.color}50` } : {}}
              >
                <span
                  className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200"
                  style={{
                    background: active ? s.color : '#3a4a66',
                    left: active ? '22px' : '2px',
                  }}
                />
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
