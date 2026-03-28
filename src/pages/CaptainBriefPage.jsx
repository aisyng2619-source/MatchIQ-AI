import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMatch } from '../context/MatchContext'
import { MOCK_RECOMMENDATION } from '../utils/mockData'
import SummaryCard from '../components/SummaryCard'
import RecommendationCard from '../components/RecommendationCard'
import BowlingPlanCard from '../components/BowlingPlanCard'
import FieldingPlanCard from '../components/FieldingPlanCard'
import OverDecisionCard from '../components/OverDecisionCard'
import MatchupCard from '../components/MatchupCard'
import MetricBadge from '../components/MetricBadge'
import VenueWeatherCard from '../components/VenueWeatherCard'
import MatchContextPanel from '../components/MatchContextPanel'
import SectionHeader from '../components/SectionHeader'
import EmptyState from '../components/EmptyState'

const SIGNAL_META = {
  pressure_stability:     { label: 'Pressure Stability',     desc: 'Composure under match pressure',      inverted: false },
  acceleration_upside:    { label: 'Acceleration Upside',    desc: 'Boundary rate & scoring ceiling',     inverted: false },
  opposition_vulnerability:{ label: 'Opp. Vulnerability',    desc: 'Opposition weak zone exposure',       inverted: false },
  matchup_strength:       { label: 'Matchup Strength',       desc: 'Favourable head-to-head advantage',   inverted: false },
  context_fit:            { label: 'Context Fit',            desc: 'How well plan fits conditions',       inverted: false },
  injury_risk:            { label: 'Injury Risk',            desc: 'Player fitness / availability risk',  inverted: true  },
  confidence:             { label: 'Confidence Score',       desc: 'Overall AI recommendation confidence',inverted: false },
}

export default function CaptainBriefPage() {
  const navigate = useNavigate()
  const { recommendation, matchSetup, error } = useMatch()
  const rec = recommendation || MOCK_RECOMMENDATION

  if (!rec) {
    return (
      <div className="min-h-screen bg-surface-900 pt-20">
        <EmptyState
          title="No tactical brief yet"
          message="Set up your match and run the analysis to see the captain's brief."
          actionLabel="Go to Setup"
          actionTo="/setup"
        />
      </div>
    )
  }

  const {
    batting_recommendation: bat,
    bowling_plan,
    fielding_changes,
    next_2_over_decisions,
    favorable_matchups,
    dangerous_matchups,
    captain_summary,
    signals,
    context,
    simulation,
  } = rec

  const teamA = matchSetup?.teamA || 'India'
  const teamB = matchSetup?.teamB || 'Australia'

  return (
    <div className="min-h-screen bg-surface-900 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 mb-8">
          <div>
            <p className="text-xs font-mono text-brand uppercase tracking-widest mb-1">Tactical Command Brief</p>
            <h1 className="font-display font-800 text-4xl text-white leading-tight">
              {teamA} <span className="text-slate-600">vs</span> {teamB}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {error && (
              <span className="text-xs font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-xl">
                ⚠ Demo data
              </span>
            )}
            <Link
              to="/simulation"
              className="px-5 py-2.5 rounded-xl bg-brand/15 text-brand border border-brand/30 font-display font-700 text-sm hover:bg-brand/25 transition-colors"
            >
              Simulation View →
            </Link>
            <button
              onClick={() => navigate('/setup')}
              className="px-5 py-2.5 rounded-xl bg-surface-600 border border-surface-400 text-slate-300 font-display font-600 text-sm hover:bg-surface-500 transition-colors"
            >
              New Setup
            </button>
          </div>
        </div>

        {/* Match Context Banner */}
        <div className="mb-6">
          <MatchContextPanel context={context} />
        </div>

        {/* Captain Summary */}
        <div className="mb-6">
          <SummaryCard summary={captain_summary} teamA={teamA} teamB={teamB} />
        </div>

        {/* Tactical Signals Grid */}
        <div className="mb-8">
          <SectionHeader label="AI Signals" title="Tactical Intelligence Scores" accent="#a78bfa" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(signals || {}).map(([key, val]) => {
              const meta = SIGNAL_META[key]
              if (!meta) return null
              return (
                <MetricBadge
                  key={key}
                  label={meta.label}
                  value={val}
                  description={meta.desc}
                  inverted={meta.inverted}
                />
              )
            })}
          </div>
        </div>

        {/* Venue + Weather */}
        <div className="mb-8">
          <SectionHeader label="Conditions" title="Venue & Weather Modifiers" accent="#38bdf8" />
          <VenueWeatherCard
            venue={context?.venue}
            weather={context?.weather}
            pitch={context?.pitch_type}
          />
        </div>

        {/* Main recommendations grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Batting Recommendation */}
          <RecommendationCard
            badge="Batting"
            title={bat?.title}
            confidence={bat?.confidence}
            accentColor="#00e5a0"
          >
            {bat?.risk_note && (
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs bg-danger/15 text-danger border border-danger/25 rounded-full px-2.5 py-0.5 font-mono">
                  Risk: {bat.risk_note}
                </span>
              </div>
            )}
            {bat?.reasoning?.length > 0 && (
              <ul className="space-y-2">
                {bat.reasoning.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                    <span className="text-brand mt-0.5 flex-shrink-0">→</span>
                    {r}
                  </li>
                ))}
              </ul>
            )}
          </RecommendationCard>

          {/* Bowling Plan */}
          <div className="bg-surface-700 border border-surface-500 rounded-2xl p-5">
            <SectionHeader label="Bowling Plan" title="Next 2 Overs" accent="#38bdf8" />
            <BowlingPlanCard plan={bowling_plan} />
          </div>

          {/* Fielding Changes */}
          <div className="bg-surface-700 border border-surface-500 rounded-2xl p-5">
            <SectionHeader label="Fielding" title="Field Placement Changes" accent="#a78bfa" />
            <FieldingPlanCard changes={fielding_changes} />
          </div>

          {/* Over Decisions */}
          <div className="bg-surface-700 border border-surface-500 rounded-2xl p-5">
            <SectionHeader label="Micro Strategy" title="Next 2 Over Decisions" accent="#fbbf24" />
            <OverDecisionCard decisions={next_2_over_decisions} />
          </div>
        </div>

        {/* Matchups */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Favorable */}
          <div>
            <SectionHeader label="Exploit" title="Favorable Matchups" accent="#00e5a0" />
            <div className="space-y-3">
              {(favorable_matchups || []).map((m, i) => (
                <MatchupCard key={i} {...m} variant="favorable" />
              ))}
            </div>
          </div>

          {/* Dangerous */}
          <div>
            <SectionHeader label="Beware" title="Dangerous Matchups" accent="#f43f5e" />
            <div className="space-y-3">
              {(dangerous_matchups || []).map((m, i) => (
                <MatchupCard key={i} {...m} variant="danger" />
              ))}
            </div>
          </div>
        </div>

        {/* Decision Timeline preview */}
        {simulation?.timeline?.length > 0 && (
          <div className="bg-surface-700 border border-brand/20 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-5">
              <SectionHeader label="Live Simulation" title="Tactical Decision Timeline" accent="#fbbf24" />
              <Link
                to="/simulation"
                className="text-xs font-mono text-brand hover:text-brand-dark transition-colors flex-shrink-0"
              >
                Full Simulation →
              </Link>
            </div>
            <div className="space-y-2">
              {simulation.timeline.slice(0, 4).map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-surface-600">
                  <span className="text-xs font-mono text-brand w-12 flex-shrink-0">
                    {typeof item === 'string' ? item.split('→')[0].trim() : item.over}
                  </span>
                  <span className="text-sm text-slate-300">
                    {typeof item === 'string' ? item.split('→')[1]?.trim() : item.action}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA to simulation */}
        <div className="text-center">
          <Link
            to="/simulation"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-brand text-surface-900 font-display font-800 text-sm hover:bg-brand-dark transition-all shadow-brand"
          >
            Open Full Simulation View →
          </Link>
        </div>
      </div>
    </div>
  )
}
