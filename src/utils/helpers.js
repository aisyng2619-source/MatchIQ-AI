/**
 * Returns a color class based on a 0–100 confidence/score value.
 */
export function scoreColor(val) {
  if (val >= 80) return 'text-brand'
  if (val >= 60) return 'text-amber-400'
  return 'text-danger'
}

export function scoreBg(val) {
  if (val >= 80) return 'bg-brand/10 border-brand/30'
  if (val >= 60) return 'bg-amber-400/10 border-amber-400/30'
  return 'bg-danger/10 border-danger/30'
}

export function scoreBarColor(val) {
  if (val >= 80) return '#00e5a0'
  if (val >= 60) return '#fbbf24'
  return '#f43f5e'
}

/**
 * Returns label for a confidence value.
 */
export function confidenceLabel(val) {
  if (val >= 85) return 'Very High'
  if (val >= 70) return 'High'
  if (val >= 55) return 'Moderate'
  return 'Low'
}

/**
 * Returns tactical mode badge color.
 */
export function modeColor(mode) {
  if (!mode) return 'bg-slate-700 text-slate-300'
  const m = mode.toLowerCase()
  if (m.includes('attack')) return 'bg-danger/20 text-danger border border-danger/40'
  if (m.includes('contain')) return 'bg-info/20 text-info border border-info/40'
  if (m.includes('spin')) return 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
  if (m.includes('pace')) return 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
  return 'bg-brand/20 text-brand border border-brand/30'
}

/**
 * Clamp a number.
 */
export function clamp(val, min = 0, max = 100) {
  return Math.min(max, Math.max(min, val))
}

/**
 * Sleep helper for artificial delays.
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Weather icon text.
 */
export function weatherIcon(w) {
  if (!w) return '☁️'
  const lw = w.toLowerCase()
  if (lw.includes('dew'))      return '💧'
  if (lw.includes('overcast')) return '🌥️'
  if (lw.includes('humid'))    return '🌫️'
  if (lw.includes('hot'))      return '☀️'
  if (lw.includes('dry'))      return '☀️'
  return '⛅'
}

/**
 * Pitch icon.
 */
export function pitchIcon(p) {
  if (!p) return '🏟️'
  const lp = p.toLowerCase()
  if (lp.includes('spin'))  return '🌀'
  if (lp.includes('pace'))  return '⚡'
  if (lp.includes('flat'))  return '📏'
  return '🏟️'
}
