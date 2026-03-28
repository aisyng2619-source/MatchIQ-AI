import React from 'react'
import { weatherIcon, pitchIcon, modeColor } from '../utils/helpers'
import ContextChip from './ContextChip'

export default function MatchContextPanel({ context = {} }) {
  const { venue, weather, pitch_type, match_phase, tactical_mode } = context

  return (
    <div className="bg-surface-700 border border-surface-500 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
        <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Live Match Context</span>
      </div>

      {/* Main context bar */}
      <div className="flex flex-wrap gap-2 mb-4">
        {venue && (
          <ContextChip icon="📍" label={venue} variant="default" />
        )}
        {weather && (
          <ContextChip icon={weatherIcon(weather)} label={weather} variant="warning" />
        )}
        {pitch_type && (
          <ContextChip icon={pitchIcon(pitch_type)} label={pitch_type} variant="brand" />
        )}
        {match_phase && (
          <ContextChip icon="🎯" label={match_phase} variant="info" />
        )}
      </div>

      {/* Tactical mode */}
      {tactical_mode && (
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-display font-700 tracking-wide ${modeColor(tactical_mode)}`}>
          <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
          {tactical_mode}
        </div>
      )}
    </div>
  )
}
