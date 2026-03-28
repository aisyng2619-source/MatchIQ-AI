import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMatch } from '../context/MatchContext'

const STEPS = [
  { label: 'Analyzing recent player form…',             duration: 600 },
  { label: 'Scoring pressure resilience…',              duration: 700 },
  { label: 'Evaluating matchup risks…',                 duration: 650 },
  { label: 'Adjusting for venue and weather…',          duration: 500 },
  { label: 'Mapping field placement strategy…',         duration: 600 },
  { label: 'Generating over-by-over decisions…',        duration: 700 },
  { label: 'Generating tactical command brief…',        duration: 800 },
]

export default function AnalysisLoadingPage() {
  const navigate = useNavigate()
  const { recommendation, loading } = useMatch()
  const [currentStep, setCurrentStep] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let idx = 0
    let cancelled = false
    function advance() {
      if (cancelled) return
      if (idx < STEPS.length) {
        setCurrentStep(idx)
        idx++
        setTimeout(advance, STEPS[idx - 1]?.duration || 600)
      } else {
        setDone(true)
      }
    }
    advance()
    return () => { cancelled = true }
  }, [])

  // When backend/mock data is ready and animation done
  useEffect(() => {
    if (done && !loading && recommendation) {
      setTimeout(() => navigate('/brief'), 400)
    }
  }, [done, loading, recommendation, navigate])

  const progress = Math.round(((currentStep + 1) / STEPS.length) * 100)

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center px-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-12">
          {/* Animated icon */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-brand/20 animate-ping" />
            <div className="absolute inset-2 rounded-full border border-brand/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-brand/20 border border-brand/40 flex items-center justify-center text-xl">
                🧠
              </div>
            </div>
          </div>
          <h2 className="font-display font-800 text-2xl text-white mb-2">
            Analyzing Match Intelligence
          </h2>
          <p className="text-sm text-slate-500 font-mono">
            Generating tactical command brief…
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-500">Processing</span>
            <span className="text-xs font-mono text-brand">{progress}%</span>
          </div>
          <div className="h-1.5 bg-surface-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, boxShadow: '0 0 8px #00e5a080' }}
            />
          </div>
        </div>

        {/* Step list */}
        <div className="space-y-3">
          {STEPS.map((step, i) => {
            const isActive   = i === currentStep
            const isComplete = i < currentStep

            return (
              <div
                key={i}
                className={`flex items-center gap-4 transition-opacity duration-300 ${
                  i > currentStep ? 'opacity-25' : 'opacity-100'
                }`}
              >
                {/* Icon */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  isComplete
                    ? 'bg-brand text-surface-900'
                    : isActive
                    ? 'bg-brand/20 border border-brand/50'
                    : 'bg-surface-600 border border-surface-400'
                }`}>
                  {isComplete ? (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#07090f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : isActive ? (
                    <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-surface-400" />
                  )}
                </div>

                {/* Label */}
                <span className={`text-sm font-body transition-colors duration-300 ${
                  isComplete ? 'text-slate-400' : isActive ? 'text-white' : 'text-slate-600'
                }`}>
                  {step.label}
                </span>

                {/* Active indicator */}
                {isActive && (
                  <span className="ml-auto text-xs font-mono text-brand animate-pulse">
                    Running…
                  </span>
                )}
                {isComplete && (
                  <span className="ml-auto text-xs font-mono text-brand/60">Done</span>
                )}
              </div>
            )
          })}
        </div>

        {/* Scan line visual */}
        {!done && (
          <div className="mt-10 relative h-px bg-surface-600 overflow-hidden rounded-full">
            <div
              className="absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-transparent via-brand to-transparent"
              style={{
                animation: 'scanLine 1.8s ease-in-out infinite',
              }}
            />
          </div>
        )}

        {done && (
          <p className="text-center text-xs text-brand font-mono mt-10 animate-fade_in">
            ✓ Analysis complete — loading brief…
          </p>
        )}
      </div>

      <style>{`
        @keyframes scanLine {
          0%   { left: -4rem; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  )
}
