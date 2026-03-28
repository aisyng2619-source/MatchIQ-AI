import React from 'react'
import { modeColor } from '../utils/helpers'

export default function TacticalTimeline({ timeline = [] }) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[18px] top-0 bottom-0 w-px bg-gradient-to-b from-brand/40 via-surface-400 to-transparent" />

      <div className="space-y-3">
        {timeline.map((item, i) => {
          const isLast = i === timeline.length - 1
          const modeClass = modeColor(item.mode)
          return (
            <div key={i} className="flex items-start gap-4 animate-slide_up" style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}>
              {/* Dot */}
              <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-mono font-600 border
                ${isLast ? 'bg-brand text-surface-900 border-brand shadow-brand' : 'bg-surface-600 text-slate-400 border-surface-400'}`}>
                {item.over || String(i + 1).padStart(2, '0')}
              </div>

              {/* Content */}
              <div className={`flex-1 bg-surface-700 border border-surface-500 rounded-xl p-3 mb-1 ${isLast ? 'border-brand/30' : ''}`}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs text-slate-300 font-body leading-relaxed">{item.action}</span>
                  {item.mode && (
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full flex-shrink-0 ${modeClass}`}>
                      {item.mode}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
