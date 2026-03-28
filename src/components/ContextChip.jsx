import React from 'react'

export default function ContextChip({ label, icon, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-surface-600 text-slate-300 border-surface-400',
    brand:   'bg-brand/15 text-brand border-brand/30',
    warning: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
    danger:  'bg-danger/15 text-danger border-danger/30',
    info:    'bg-info/15 text-info border-info/30',
    purple:  'bg-purple-500/15 text-purple-300 border-purple-500/30',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border ${variants[variant]} ${className}`}>
      {icon && <span>{icon}</span>}
      {label}
    </span>
  )
}
