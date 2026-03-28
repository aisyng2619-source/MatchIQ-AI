import React from 'react'

export default function SectionHeader({ label, title, accent = '#00e5a0', right }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div>
        {label && (
          <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: accent }}>
            {label}
          </p>
        )}
        <h2 className="font-display font-800 text-xl text-white">{title}</h2>
      </div>
      {right && <div className="flex-shrink-0">{right}</div>}
    </div>
  )
}
