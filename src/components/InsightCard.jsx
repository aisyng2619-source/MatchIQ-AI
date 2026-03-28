import React from 'react'

export default function InsightCard({ icon, label, value, sub, accent = '#00e5a0' }) {
  return (
    <div className="bg-surface-700 border border-surface-500 rounded-xl p-4 flex items-start gap-3 card-hover">
      {icon && (
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
          style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
        >
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs text-slate-500 uppercase tracking-widest font-mono mb-0.5">{label}</p>
        <p className="font-display font-700 text-white text-base leading-tight">{value}</p>
        {sub && <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{sub}</p>}
      </div>
    </div>
  )
}
