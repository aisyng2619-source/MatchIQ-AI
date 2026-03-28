import React from 'react'
import { weatherIcon, pitchIcon } from '../utils/helpers'

const VENUE_EFFECTS = {
  'Spin-Friendly': [
    { label: 'Spin advantage', effect: '+18% turn', positive: true },
    { label: 'Seam movement', effect: 'Minimal', positive: false },
    { label: 'Boundary size', effect: 'Tight (~65m)', positive: true },
  ],
  'Pace-Friendly': [
    { label: 'Seam movement', effect: '+22% swing', positive: true },
    { label: 'Bounce', effect: 'Extra', positive: true },
    { label: 'Spin effectiveness', effect: 'Reduced', positive: false },
  ],
  'Flat Pitch': [
    { label: 'Run scoring', effect: 'Easy', positive: false },
    { label: 'Acceleration', effect: 'High upside', positive: true },
    { label: 'Total projection', effect: '185–205', positive: false },
  ],
}

const WEATHER_EFFECTS = {
  'Hot / Dry': [
    { label: 'Pitch wear', effect: 'Accelerated', positive: true },
    { label: 'Ball hardness', effect: 'Maintained', positive: true },
    { label: 'Dew factor', effect: 'None', positive: true },
  ],
  'Overcast': [
    { label: 'Swing probability', effect: '+28%', positive: true },
    { label: 'Seam movement', effect: 'High', positive: true },
    { label: 'Visibility', effect: 'Slightly low', positive: false },
  ],
  'Dew Expected': [
    { label: 'Spin control', effect: 'Reduced', positive: false },
    { label: 'Pace effectiveness', effect: 'Higher', positive: true },
    { label: 'Ball grip', effect: 'Poor in 2nd half', positive: false },
  ],
  'Humid': [
    { label: 'Swing', effect: 'Late swing likely', positive: true },
    { label: 'Fatigue factor', effect: 'High', positive: false },
    { label: 'Pitch pace', effect: 'Slower', positive: false },
  ],
}

export default function VenueWeatherCard({ venue, weather, pitch }) {
  const pitchEffects   = VENUE_EFFECTS[pitch]   || VENUE_EFFECTS['Flat Pitch']
  const weatherEffects = WEATHER_EFFECTS[weather] || WEATHER_EFFECTS['Hot / Dry']

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Pitch */}
      <div className="bg-surface-700 border border-surface-500 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{pitchIcon(pitch)}</span>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">Pitch</p>
            <p className="font-display font-700 text-white text-sm">{pitch}</p>
          </div>
        </div>
        <div className="space-y-2">
          {pitchEffects.map((e, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{e.label}</span>
              <span className={`text-xs font-mono font-500 ${e.positive ? 'text-brand' : 'text-danger'}`}>
                {e.effect}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Weather */}
      <div className="bg-surface-700 border border-surface-500 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{weatherIcon(weather)}</span>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">Weather</p>
            <p className="font-display font-700 text-white text-sm">{weather}</p>
          </div>
        </div>
        <div className="space-y-2">
          {weatherEffects.map((e, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{e.label}</span>
              <span className={`text-xs font-mono font-500 ${e.positive ? 'text-brand' : 'text-danger'}`}>
                {e.effect}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
