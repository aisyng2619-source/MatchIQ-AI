import React from 'react'
import ConfidenceIndicator from './ConfidenceIndicator'

export default function RecommendationCard({ title, badge, children, confidence, accentColor = '#00e5a0', className = '' }) {
  return (
    <div
      className={`bg-surface-700 border border-surface-500 rounded-2xl overflow-hidden card-hover ${className}`}
      style={{ borderLeft: `3px solid ${accentColor}` }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            {badge && (
              <span className="inline-block text-xs font-mono uppercase tracking-widest mb-1.5"
                style={{ color: accentColor }}>
                {badge}
              </span>
            )}
            <h3 className="font-display font-700 text-lg text-white leading-tight">{title}</h3>
          </div>
        </div>
        {children}
        {confidence !== undefined && (
          <div className="mt-4 pt-4 border-t border-surface-500">
            <ConfidenceIndicator value={confidence} size="sm" />
          </div>
        )}
      </div>
    </div>
  )
}
