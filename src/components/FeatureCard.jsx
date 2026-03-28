import React from 'react'

export default function FeatureCard({ icon, title, description, accent = '#00e5a0' }) {
  return (
    <div className="bg-surface-700/60 border border-surface-500 rounded-2xl p-6 card-hover group">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4 transition-transform group-hover:scale-110"
        style={{ background: `${accent}15`, border: `1px solid ${accent}25` }}
      >
        {icon}
      </div>
      <h3 className="font-display font-700 text-white text-base mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
  )
}
