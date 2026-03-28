import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Setup',      path: '/setup' },
  { label: 'Brief',      path: '/brief' },
  { label: 'Simulation', path: '/simulation' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const isLanding = pathname === '/'

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${isLanding ? 'bg-transparent' : 'bg-surface-900/90 backdrop-blur-md border-b border-white/5'}`}>
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded bg-brand flex items-center justify-center shadow-brand">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="#07090f" strokeWidth="1.5"/>
              <path d="M4 7h6M7 4v6" stroke="#07090f" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-display font-700 text-lg tracking-wide text-white group-hover:text-brand transition-colors">
            MATCH<span className="text-brand">IQ</span>
          </span>
          <span className="hidden sm:block text-xs text-slate-500 font-mono ml-1 mt-0.5">AI</span>
        </Link>

        {/* Nav links */}
        {!isLanding && (
          <nav className="flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className={`px-3 py-1.5 rounded text-xs font-display font-600 tracking-widest uppercase transition-all ${
                  pathname === l.path
                    ? 'bg-brand/15 text-brand border border-brand/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Status pill */}
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
          <span className="text-xs text-slate-500 font-mono hidden sm:block">LIVE</span>
        </div>
      </div>
    </header>
  )
}
