import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useMatch } from '../context/MatchContext'
import { MOCK_RECOMMENDATION } from '../utils/mockData'
import TacticalFieldView from '../components/TacticalFieldView'
import TacticalTimeline from '../components/TacticalTimeline'
import MatchContextPanel from '../components/MatchContextPanel'
import SectionHeader from '../components/SectionHeader'
import VenueWeatherCard from '../components/VenueWeatherCard'
import ContextChip from '../components/ContextChip'
import { modeColor, weatherIcon, pitchIcon } from '../utils/helpers'

function LivePulse() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
      <span className="text-xs font-mono text-brand uppercase tracking-widest">Live</span>
    </span>
  )
}

export default function SimulationPage() {
  const { recommendation, matchSetup } = useMatch()
  const rec = recommendation || MOCK_RECOMMENDATION
  const { simulation, context, next_2_over_decisions, signals, bowling_plan, fielding_changes } = rec

  const teamA = matchSetup?.teamA || 'India'
  const teamB = matchSetup?.teamB || 'Australia'

  // Animate timeline items one by one
  const [visibleItems, setVisibleItems] = useState(0)
  useEffect(() => {
    const timeline = simulation?.timeline || []
    if (visibleItems >= timeline.length) return
    const t = setTimeout(() => setVisibleItems(v => v + 1), 600)
    return () => clearTimeout(t)
  }, [visibleItems, simulation?.timeline])

  const timeline = simulation?.timeline || []

  return (
    <div className="min-h-screen bg-surface-900 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <p className="text-xs font-mono text-brand uppercase tracking-widest">Live Command View</p>
              <LivePulse />
            </div>
            <h1 className="font-display font-800 text-4xl text-white">
              Tactical Simulation
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {teamA} <span className="text-slate-600">vs</span> {teamB}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/brief"
              className="px-5 py-2.5 rounded-xl bg-surface-600 border border-surface-400 text-slate-300 font-display font-600 text-sm hover:bg-surface-500 transition-colors"
            >
              ← Captain Brief
            </Link>
            <Link
              to="/setup"
              className="px-5 py-2.5 rounded-xl bg-brand/15 text-brand border border-brand/30 font-display font-700 text-sm hover:bg-brand/25 transition-colors"
            >
              New Setup
            </Link>
          </div>
        </div>

        {/* Context panel */}
        <div className="mb-6">
          <MatchContextPanel context={context} />
        </div>

        {/* Main grid: Field + Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Tactical Field View */}
          <div className="bg-surface-700 border border-surface-500 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <SectionHeader label="Field Setup" title="Tactical Field Placement" accent="#00e5a0" />
              <span className={`text-xs font-mono px-3 py-1 rounded-full border ${modeColor(context?.tactical_mode)}`}>
                {context?.tactical_mode || 'Balanced'}
              </span>
            </div>

            <TacticalFieldView
              fieldSetup={simulation?.field_setup || []}
              pitchType={context?.pitch_type}
              tacticalMode={context?.tactical_mode}
            />

            {/* Field change notes */}
            {fielding_changes?.length > 0 && (
              <div className="mt-5 space-y-2">
                <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">
                  Active Field Changes
                </p>
                {fielding_changes.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 px-3 py-2 rounded-lg bg-surface-600 border border-surface-400"
                  >
                    <span className="text-purple-400 text-xs mt-0.5 flex-shrink-0">●</span>
                    <div>
                      <p className="text-xs font-display font-600 text-white">{c.title}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{c.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Decision Timeline */}
          <div className="bg-surface-700 border border-surface-500 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <SectionHeader label="Decision Feed" title="Over-by-Over Timeline" accent="#fbbf24" />
              <LivePulse />
            </div>

            <TacticalTimeline timeline={timeline.slice(0, visibleItems)} />

            {visibleItems < timeline.length && (
              <div className="mt-4 flex items-center gap-2">
                <div className="flex-1 h-px bg-surface-500" />
                <span className="text-xs font-mono text-slate-500 animate-pulse">Processing next decision…</span>
                <div className="flex-1 h-px bg-surface-500" />
              </div>
            )}

            {visibleItems >= timeline.length && timeline.length > 0 && (
              <div className="mt-4 text-center">
                <span className="text-xs font-mono text-brand bg-brand/10 border border-brand/20 px-3 py-1.5 rounded-full">
                  ✓ All decisions loaded
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bowling + Over Decisions side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Next 2 Over Plan */}
          <div className="bg-surface-700 border border-surface-500 rounded-2xl p-6">
            <SectionHeader label="Micro Strategy" title="Next 2 Over Decisions" accent="#f43f5e" />
            <div className="space-y-3">
              {(next_2_over_decisions || []).map((item, i) => {
                const mc = modeColor(item.mode)
                return (
                  <div
                    key={i}
                    className="bg-surface-600 border border-surface-400 rounded-xl p-4"
                    style={{ borderLeft: `3px solid ${i === 0 ? '#f43f5e' : '#38bdf8'}` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-slate-400">{item.over}</span>
                      <span className={`text-xs font-mono px-2.5 py-0.5 rounded-full border ${mc}`}>
                        {item.mode}
                      </span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed">{item.decision}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Bowling Assignments */}
          <div className="bg-surface-700 border border-surface-500 rounded-2xl p-6">
            <SectionHeader label="Bowling" title="Bowler Assignments" accent="#38bdf8" />
            <div className="space-y-3">
              {(bowling_plan || []).map((item, i) => (
                <div
                  key={i}
                  className="bg-surface-600 border border-surface-400 rounded-xl p-4"
                  style={{ borderLeft: '3px solid #38bdf8' }}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-xs font-mono text-info block mb-1">Over Slot {item.over_slot}</span>
                      <span className="font-display font-700 text-white text-sm">{item.bowler}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-500 block mb-0.5">targeting</span>
                      <span className="text-sm font-display font-600 text-slate-300">{item.target_batter}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.reason}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-surface-500 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${item.confidence}%`,
                          background: item.confidence >= 80 ? '#00e5a0' : '#fbbf24',
                        }}
                      />
                    </div>
                    <span className="text-xs font-mono text-slate-500">{item.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Venue & Weather */}
        <div className="mb-6">
          <SectionHeader label="Conditions" title="Venue & Weather Influence" accent="#38bdf8" />
          <VenueWeatherCard
            venue={context?.venue}
            weather={context?.weather}
            pitch={context?.pitch_type}
          />
        </div>

        {/* Tactical Signals Summary Row */}
        <div className="bg-surface-700 border border-surface-500 rounded-2xl p-6">
          <SectionHeader label="Intelligence" title="Tactical Signal Summary" accent="#a78bfa" />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {signals && Object.entries(signals).map(([key, val]) => {
              const isRisk = key === 'injury_risk'
              const displayColor = isRisk
                ? val < 30 ? '#00e5a0' : val < 60 ? '#fbbf24' : '#f43f5e'
                : val >= 80 ? '#00e5a0' : val >= 60 ? '#fbbf24' : '#f43f5e'

              return (
                <div key={key} className="text-center">
                  <div
                    className="text-2xl font-display font-800 mb-1"
                    style={{ color: displayColor }}
                  >
                    {val}
                  </div>
                  <p className="text-xs text-slate-500 leading-tight font-mono">
                    {key.replace(/_/g, ' ')}
                  </p>
                  <div className="mt-2 h-1 bg-surface-500 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${val}%`, background: displayColor }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
