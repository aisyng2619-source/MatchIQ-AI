import React from 'react'
import ConfidenceIndicator from './ConfidenceIndicator'

export default function BowlingPlanCard({ plan = [] }) {
  return (
    <div className="space-y-3">
      {plan.map((item, i) => (
        <div
          key={i}
          className="bg-surface-600 border border-surface-400 rounded-xl p-4 card-hover"
          style={{ borderLeft: '3px solid #38bdf8' }}
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <span className="text-xs font-mono text-info uppercase tracking-widest block mb-1">
                Over Slot {item.over_slot}
              </span>
              <span className="font-display font-700 text-white text-base">{item.bowler}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block mb-1">vs</span>
              <span className="text-sm font-display font-600 text-slate-300">{item.target_batter}</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-3 leading-relaxed">{item.reason}</p>
          <ConfidenceIndicator value={item.confidence} size="sm" />
        </div>
      ))}
    </div>
  )
}
