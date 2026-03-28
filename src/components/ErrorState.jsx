import React from 'react'

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-danger/10 border border-danger/30 flex items-center justify-center mb-5">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="12" stroke="#f43f5e" strokeWidth="1.5"/>
          <path d="M14 8v8M14 18v2" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <h3 className="font-display font-700 text-lg text-danger mb-2">Analysis Failed</h3>
      <p className="text-sm text-slate-400 max-w-xs mb-2">{message}</p>
      <p className="text-xs text-slate-600 mb-6 font-mono">Using mock fallback data for demo.</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2.5 rounded-xl bg-surface-600 border border-surface-400 text-slate-300 font-display font-600 text-sm hover:bg-surface-500 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  )
}
