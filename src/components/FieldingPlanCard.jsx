import React from 'react'

export default function FieldingPlanCard({ changes = [] }) {
  return (
    <div className="space-y-3">
      {changes.map((item, i) => (
        <div
          key={i}
          className="bg-surface-600 border border-surface-400 rounded-xl p-4 card-hover flex gap-3"
          style={{ borderLeft: '3px solid #a78bfa' }}
        >
          <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center flex-shrink-0 text-sm">
            🎯
          </div>
          <div>
            <p className="font-display font-700 text-white text-sm mb-1">{item.title}</p>
            <p className="text-xs text-slate-400 leading-relaxed">{item.reason}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
