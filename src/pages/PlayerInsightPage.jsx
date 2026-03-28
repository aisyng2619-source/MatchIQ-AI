import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchPlayerInsight } from '../api/api'
import { MOCK_PLAYER_INSIGHT } from '../utils/mockData'
import PlayerFormChart from '../components/PlayerFormChart'
import PhasePerformanceChart from '../components/PhasePerformanceChart'
import MetricBadge from '../components/MetricBadge'
import SectionHeader from '../components/SectionHeader'
import EmptyState from '../components/EmptyState'
import InsightCard from '../components/InsightCard'

const SIGNAL_META = {
  pressure_stability:  { label: 'Pressure Stability',  inverted: false, icon: '🧠' },
  acceleration_upside: { label: 'Acceleration Upside', inverted: false, icon: '⚡' },
  injury_risk:         { label: 'Injury Risk',         inverted: true,  icon: '⚕️' },
  matchup_strength:    { label: 'Matchup Strength',    inverted: false, icon: '🎯' },
}

const ROLE_COLOR = {
  'Opener':      '#38bdf8',
  'Anchor':      '#00e5a0',
  'Finisher':    '#f43f5e',
  'All-rounder': '#fbbf24',
  'Spinner':     '#a78bfa',
  'Pacer':       '#fb923c',
}

export default function PlayerInsightPage() {
  const { name } = useParams()
  const navigate = useNavigate()
  const [player, setPlayer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await fetchPlayerInsight(name)
        setPlayer(data)
      } catch {
        // Fallback: look up mock data by name
        const found = MOCK_PLAYER_INSIGHT[name]
          || Object.values(MOCK_PLAYER_INSIGHT)[0]
        setPlayer(found || null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [name])

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-brand/30 border-t-brand animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-500 font-mono">Loading player intelligence…</p>
        </div>
      </div>
    )
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-surface-900 pt-20">
        <EmptyState
          title="Player not found"
          message={`No insight data available for "${name}".`}
          actionLabel="Back to Brief"
          actionTo="/brief"
        />
      </div>
    )
  }

  const roleColor = ROLE_COLOR[player.role?.split('/')[0]?.trim()] || '#00e5a0'

  // Average runs from form trend
  const avgRuns = player.form_trend?.length
    ? Math.round(player.form_trend.reduce((s, d) => s + d.runs, 0) / player.form_trend.length)
    : '—'
  const avgSR = player.form_trend?.length
    ? Math.round(player.form_trend.reduce((s, d) => s + d.sr, 0) / player.form_trend.length)
    : '—'
  const highScore = player.form_trend?.length
    ? Math.max(...player.form_trend.map(d => d.runs))
    : '—'
  const bestPhase = player.phase_performance?.length
    ? player.phase_performance.reduce((a, b) => a.sr > b.sr ? a : b)
    : null

  return (
    <div className="min-h-screen bg-surface-900 pt-20 pb-20">
      <div className="max-w-5xl mx-auto px-6">

        {/* Breadcrumb */}
        <div className="pt-6 mb-2">
          <Link to="/brief" className="text-xs font-mono text-slate-500 hover:text-brand transition-colors">
            ← Captain Brief
          </Link>
        </div>

        {/* Player Hero */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-5 mb-8">
          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-display font-800 flex-shrink-0"
            style={{ background: `${roleColor}15`, border: `2px solid ${roleColor}40`, color: roleColor }}
          >
            {player.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>

          <div className="flex-1">
            <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: roleColor }}>
              Player Intelligence
            </p>
            <h1 className="font-display font-800 text-4xl text-white leading-tight">
              {player.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span
                className="text-xs font-mono px-2.5 py-0.5 rounded-full border"
                style={{ color: roleColor, background: `${roleColor}15`, borderColor: `${roleColor}30` }}
              >
                {player.role}
              </span>
              <span className="text-xs font-mono text-slate-500">·</span>
              <span className="text-xs font-mono text-slate-400">{player.team}</span>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-5 sm:gap-6">
            {[
              { label: 'Avg Runs', value: avgRuns },
              { label: 'Avg SR',   value: avgSR },
              { label: 'High',     value: highScore },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display font-800 text-2xl text-white">{s.value}</p>
                <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="bg-surface-700 border border-surface-500 rounded-2xl p-5">
            <SectionHeader label="Recent Form" title="Last 5 Innings" accent="#00e5a0" />
            <PlayerFormChart data={player.form_trend || []} />
          </div>
          <div className="bg-surface-700 border border-surface-500 rounded-2xl p-5">
            <SectionHeader label="Phase Analysis" title="Strike Rate by Phase" accent="#38bdf8" />
            <PhasePerformanceChart data={player.phase_performance || []} />
            {bestPhase && (
              <p className="text-xs text-slate-500 mt-3 font-mono text-center">
                Best phase: <span className="text-brand">{bestPhase.phase}</span> (SR {bestPhase.sr})
              </p>
            )}
          </div>
        </div>

        {/* Signal badges */}
        <div className="mb-6">
          <SectionHeader label="Intelligence" title="Player Tactical Signals" accent="#a78bfa" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(player.signals || {}).map(([key, val]) => {
              const meta = SIGNAL_META[key]
              return (
                <MetricBadge
                  key={key}
                  label={meta?.label || key.replace(/_/g, ' ')}
                  value={val}
                  description=""
                  inverted={meta?.inverted || false}
                />
              )
            })}
          </div>
        </div>

        {/* Insight cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <InsightCard
            icon="🏏"
            label="Best Against"
            value="Spin Bowling"
            sub="Exploits wrist spin and off-break with 360° game"
            accent="#00e5a0"
          />
          <InsightCard
            icon="⚠️"
            label="Weakness"
            value="Leg-spin (around wicket)"
            sub="Zampa / Rashid angle restricts scoring severely"
            accent="#f43f5e"
          />
          <InsightCard
            icon="📍"
            label="Optimal Phase"
            value={bestPhase?.phase || 'Middle Overs'}
            sub={`SR ${bestPhase?.sr || '—'} — highest impact window`}
            accent="#fbbf24"
          />
        </div>

        {/* Tactical summary */}
        <div className="bg-surface-700 border border-brand/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-brand/15 border border-brand/25 flex items-center justify-center text-sm">
              🧠
            </div>
            <p className="text-xs font-mono text-brand uppercase tracking-widest">Tactical Summary</p>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">{player.tactical_summary}</p>

          {/* Decorative separator */}
          <div className="mt-5 h-px bg-gradient-to-r from-brand/25 via-brand/10 to-transparent" />

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => navigate('/brief')}
              className="px-4 py-2 rounded-xl bg-surface-600 border border-surface-400 text-slate-300 font-display font-600 text-xs hover:bg-surface-500 transition-colors"
            >
              ← Back to Brief
            </button>
            <button
              onClick={() => navigate('/simulation')}
              className="px-4 py-2 rounded-xl bg-brand/15 border border-brand/30 text-brand font-display font-700 text-xs hover:bg-brand/25 transition-colors"
            >
              Simulation View →
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
