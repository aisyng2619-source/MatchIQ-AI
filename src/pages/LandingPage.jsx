import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import FeatureCard from '../components/FeatureCard'

const FEATURES = [
  {
    icon: '🧠',
    title: 'Tactical Decision Engine',
    description: 'AI-powered batting order, bowling plan, and fielding changes tailored to match context.',
    accent: '#00e5a0',
  },
  {
    icon: '🎯',
    title: 'Matchup Intelligence',
    description: 'Identify favorable and dangerous batter–bowler matchups before they play out on the field.',
    accent: '#38bdf8',
  },
  {
    icon: '🌀',
    title: 'Context-Aware Analysis',
    description: 'Venue, pitch, weather, and phase modifiers baked into every recommendation.',
    accent: '#a78bfa',
  },
  {
    icon: '⚡',
    title: 'Live Simulation View',
    description: 'Visual field placement and over-by-over tactical decision timeline.',
    accent: '#fbbf24',
  },
  {
    icon: '📊',
    title: 'Pressure & Form Signals',
    description: 'Pressure stability, acceleration upside, and injury risk scored per player.',
    accent: '#f43f5e',
  },
  {
    icon: '🔮',
    title: 'Captain\'s Brief',
    description: 'A concise AI brief — what a smart analyst would tell the captain in 20 seconds.',
    accent: '#fb923c',
  },
]

const STATS = [
  { value: '11', label: 'Tactical Signals' },
  { value: '3ms', label: 'Analysis Time' },
  { value: 'T20', label: 'Format Optimized' },
  { value: '360°', label: 'Field Coverage' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)

  /* Animated particle field */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    const W = canvas.width  = canvas.offsetWidth
    const H = canvas.height = canvas.offsetHeight

    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.4 + 0.1,
    }))

    function draw() {
      ctx.clearRect(0, 0, W, H)
      dots.forEach((d) => {
        d.x += d.vx; d.y += d.vy
        if (d.x < 0) d.x = W; if (d.x > W) d.x = 0
        if (d.y < 0) d.y = H; if (d.y > H) d.y = 0
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,229,160,${d.alpha})`
        ctx.fill()
      })
      // Draw lines between close dots
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x
          const dy = dots[i].y - dots[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 90) {
            ctx.beginPath()
            ctx.moveTo(dots[i].x, dots[i].y)
            ctx.lineTo(dots[j].x, dots[j].y)
            ctx.strokeStyle = `rgba(0,229,160,${0.07 * (1 - dist / 90)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-surface-900">
      {/* Canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
      />

      {/* Hero gradient */}
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />

      {/* Radial accent */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 pt-28 pb-20 px-6 max-w-7xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-20 animate-slide_up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/25 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="text-xs font-mono text-brand uppercase tracking-widest">
              AI Tactical Intelligence · T20 Cricket
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display font-800 text-6xl sm:text-8xl tracking-tight text-white mb-4 leading-none">
            MATCH<span className="text-brand">IQ</span>{' '}
            <span className="text-slate-400">AI</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl sm:text-2xl text-slate-300 font-display font-500 mb-4">
            Explainable AI for cricket decisions
          </p>
          <p className="text-sm text-slate-500 max-w-lg mx-auto mb-10 leading-relaxed">
            Turn raw cricket data into tactical match-winning recommendations.
            Built for captains, analysts, and coaches who want to think one step ahead.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/setup')}
              className="px-8 py-3.5 rounded-2xl bg-brand text-surface-900 font-display font-800 text-base tracking-wide hover:bg-brand-dark transition-all shadow-brand hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0"
            >
              Start Simulation →
            </button>
            <button
              onClick={() => navigate('/brief')}
              className="px-8 py-3.5 rounded-2xl bg-surface-700 border border-surface-400 text-slate-300 font-display font-700 text-base hover:border-slate-500 hover:text-white transition-all"
            >
              View Demo Brief
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-20">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="text-center bg-surface-700/50 border border-surface-500 rounded-2xl py-5 px-4"
            >
              <p className="font-display font-800 text-3xl text-brand mb-1">{s.value}</p>
              <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Separator */}
        <div className="sep mb-16" />

        {/* Features */}
        <div className="text-center mb-10">
          <p className="text-xs font-mono text-brand uppercase tracking-widest mb-2">Core Intelligence Modules</p>
          <h2 className="font-display font-800 text-3xl text-white">
            Everything a captain needs
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {FEATURES.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="relative text-center bg-surface-700/60 border border-brand/20 rounded-3xl p-12 overflow-hidden">
          <div className="absolute inset-0 bg-brand/3 pointer-events-none" />
          <div className="relative z-10">
            <p className="text-xs font-mono text-brand uppercase tracking-widest mb-3">Ready to analyze</p>
            <h3 className="font-display font-800 text-4xl text-white mb-4">
              Set up your match now
            </h3>
            <p className="text-sm text-slate-400 mb-8 max-w-md mx-auto">
              Configure teams, venue, pitch, and weather — and let the tactical engine do the rest.
            </p>
            <button
              onClick={() => navigate('/setup')}
              className="px-10 py-4 rounded-2xl bg-brand text-surface-900 font-display font-800 text-base tracking-wide hover:bg-brand-dark transition-all shadow-brand"
            >
              Launch Match Setup
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
