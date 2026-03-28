import React from 'react'
import { Link } from 'react-router-dom'

export default function EmptyState({
  title = 'No data yet',
  message = 'Set up your match to generate tactical intelligence.',
  actionLabel = 'Start Match Setup',
  actionTo = '/setup',
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-surface-600 border border-surface-400 flex items-center justify-center mb-5">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="12" stroke="#2d3a52" strokeWidth="1.5"/>
          <path d="M14 8v8M14 18v2" stroke="#3a4a66" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <h3 className="font-display font-700 text-lg text-slate-300 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-6">{message}</p>
      {actionTo && (
        <Link
          to={actionTo}
          className="px-5 py-2.5 rounded-xl bg-brand text-surface-900 font-display font-700 text-sm hover:bg-brand-dark transition-colors shadow-brand"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
