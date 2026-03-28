import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMatch } from '../context/MatchContext'
import { generateRecommendation } from '../api/api'
import { TEAMS, VENUES, getXI, MOCK_RECOMMENDATION } from '../utils/mockData'
import PlayingXIPanel from '../components/PlayingXIPanel'
import TacticalInputPanel from '../components/TacticalInputPanel'
import SectionHeader from '../components/SectionHeader'
import { sleep } from '../utils/helpers'

const PITCHES  = ['Flat Pitch', 'Spin-Friendly', 'Pace-Friendly']
const WEATHERS = ['Hot / Dry', 'Humid', 'Overcast', 'Dew Expected']
const PHASES   = ['Powerplay', 'Middle Overs', 'Death Overs']

function Select({ label, value, onChange, options, placeholder = 'Select…' }) {
  return (
    <div>
      <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface-600 border border-surface-400 rounded-xl px-4 py-3 text-sm text-slate-200 font-body appearance-none focus:outline-none focus:border-brand/50 transition-colors cursor-pointer"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  )
}

function PillSelector({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={`px-4 py-2 rounded-xl text-sm font-display font-600 border transition-all duration-200 ${
              value === o
                ? 'bg-brand/15 text-brand border-brand/40 shadow-brand'
                : 'bg-surface-600 text-slate-400 border-surface-400 hover:border-slate-500 hover:text-slate-200'
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function MatchSetupPage() {
  const navigate = useNavigate()
  const { setMatchSetup, setRecommendation, setLoading, setError } = useMatch()

  const [teamA,    setTeamA]    = useState('India')
  const [teamB,    setTeamB]    = useState('Australia')
  const [venue,    setVenue]    = useState(VENUES[0])
  const [pitch,    setPitch]    = useState('Spin-Friendly')
  const [weather,  setWeather]  = useState('Hot / Dry')
  const [phase,    setPhase]    = useState('Middle Overs')
  const [signals,  setSignals]  = useState({
    form_matchups:       true,
    pressure_stability:  true,
    acceleration_upside: true,
    opp_vulnerability:   true,
    context_scoring:     true,
    injury_risk:         true,
  })

  const xiA = getXI(teamA)
  const xiB = getXI(teamB)

  function handleSignalChange(key, val) {
    setSignals((prev) => ({ ...prev, [key]: val }))
  }

  async function handleGenerate() {
    if (!teamA || !teamB || !venue) return
    const setup = { teamA, teamB, venue, pitch, weather, phase, signals }
    setMatchSetup(setup)
    setLoading(true)
    navigate('/analyzing')

    const payload = {
      team_a: teamA,
      team_b: teamB,
      venue,
      pitch_type: pitch,
      weather,
      match_phase: phase,
      tactical_signals: signals,
      playing_xi_a: xiA,
      playing_xi_b: xiB,
    }

    try {
      await sleep(3800) // Allow animation to play
      const data = await generateRecommendation(payload)
      setRecommendation(data)
      setError(null)
    } catch (err) {
      // Fallback to mock data — backend unavailable
      setRecommendation({
        ...MOCK_RECOMMENDATION,
        context: {
          venue,
          weather,
          pitch_type: pitch,
          match_phase: phase,
          tactical_mode:
            pitch === 'Spin-Friendly'
              ? 'Spin Pressure Mode'
              : pitch === 'Pace-Friendly'
              ? 'Pace Attack Mode'
              : 'Balanced Mode',
        },
      })
      setError('Backend unavailable — showing demo data.')
    } finally {
      setLoading(false)
      navigate('/brief')
    }
  }

  const canGenerate = teamA && teamB && teamA !== teamB && venue

  return (
    <div className="min-h-screen bg-surface-900 pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Page header */}
        <div className="mb-10 pt-6">
          <p className="text-xs font-mono text-brand uppercase tracking-widest mb-2">Match Intelligence</p>
          <h1 className="font-display font-800 text-4xl text-white mb-2">Match Setup</h1>
          <p className="text-slate-400 text-sm">Configure match context to generate your tactical plan.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Main form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Match Setup Card */}
            <div className="bg-surface-700 border border-surface-500 rounded-2xl p-6">
              <SectionHeader label="Step 1" title="Match Setup" accent="#00e5a0" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Select label="Team A (Batting / Home)" value={teamA} onChange={setTeamA} options={TEAMS} />
                <Select label="Team B (Bowling / Away)" value={teamB} onChange={setTeamB} options={TEAMS} />
                <div className="sm:col-span-2">
                  <Select label="Venue" value={venue} onChange={setVenue} options={VENUES} />
                </div>
                {/* Format — fixed */}
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">
                    Format
                  </label>
                  <div className="bg-surface-600 border border-brand/30 rounded-xl px-4 py-3 flex items-center gap-2">
                    <span className="text-brand font-display font-700 text-sm">T20</span>
                    <span className="text-xs text-slate-500 font-mono">— Fixed</span>
                  </div>
                </div>
                {/* Phase */}
                <div>
                  <Select label="Match Phase" value={phase} onChange={setPhase} options={PHASES} />
                </div>
              </div>
            </div>

            {/* Conditions Card */}
            <div className="bg-surface-700 border border-surface-500 rounded-2xl p-6">
              <SectionHeader label="Step 2" title="Pitch & Weather Conditions" accent="#38bdf8" />
              <div className="space-y-6">
                <PillSelector label="Pitch Type" value={pitch} onChange={setPitch} options={PITCHES} />
                <PillSelector label="Weather Condition" value={weather} onChange={setWeather} options={WEATHERS} />
              </div>

              {/* Live condition preview */}
              <div className="mt-6 p-4 rounded-xl bg-surface-600 border border-surface-400">
                <p className="text-xs font-mono text-slate-500 mb-2">CONDITION SUMMARY</p>
                <div className="flex flex-wrap gap-2">
                  {pitch === 'Spin-Friendly' && (
                    <span className="text-xs bg-purple-500/15 text-purple-300 border border-purple-500/25 rounded-full px-3 py-1 font-mono">
                      🌀 Spin boost +18%
                    </span>
                  )}
                  {pitch === 'Pace-Friendly' && (
                    <span className="text-xs bg-orange-500/15 text-orange-300 border border-orange-500/25 rounded-full px-3 py-1 font-mono">
                      ⚡ Seam swing +22%
                    </span>
                  )}
                  {pitch === 'Flat Pitch' && (
                    <span className="text-xs bg-brand/15 text-brand border border-brand/25 rounded-full px-3 py-1 font-mono">
                      📏 High run rate expected
                    </span>
                  )}
                  {weather === 'Dew Expected' && (
                    <span className="text-xs bg-info/15 text-info border border-info/25 rounded-full px-3 py-1 font-mono">
                      💧 Spin control reduced
                    </span>
                  )}
                  {weather === 'Overcast' && (
                    <span className="text-xs bg-info/15 text-info border border-info/25 rounded-full px-3 py-1 font-mono">
                      🌥️ Swing probability +28%
                    </span>
                  )}
                  {weather === 'Hot / Dry' && (
                    <span className="text-xs bg-amber-400/15 text-amber-300 border border-amber-400/25 rounded-full px-3 py-1 font-mono">
                      ☀️ Ball hardness maintained
                    </span>
                  )}
                  {weather === 'Humid' && (
                    <span className="text-xs bg-slate-500/20 text-slate-300 border border-slate-500/30 rounded-full px-3 py-1 font-mono">
                      🌫️ Late swing likely
                    </span>
                  )}
                  <span className="text-xs bg-surface-500 text-slate-400 border border-surface-400 rounded-full px-3 py-1 font-mono">
                    🎯 {phase}
                  </span>
                </div>
              </div>
            </div>

            {/* Tactical Signals Card */}
            <div className="bg-surface-700 border border-surface-500 rounded-2xl p-6">
              <SectionHeader label="Step 3" title="Tactical Intelligence Signals" accent="#a78bfa" />
              <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                Toggle the AI signal modules that should influence the tactical recommendation.
              </p>
              <TacticalInputPanel values={signals} onChange={handleSignalChange} />
            </div>
          </div>

          {/* RIGHT: Playing XI + CTA */}
          <div className="space-y-5">
            {/* Playing XI */}
            {teamA && <PlayingXIPanel team={teamA} players={xiA} />}
            {teamB && teamB !== teamA && <PlayingXIPanel team={teamB} players={xiB} />}

            {/* Generate CTA */}
            <div className="sticky top-20">
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className={`w-full py-4 rounded-2xl font-display font-800 text-base tracking-wide transition-all duration-200 ${
                  canGenerate
                    ? 'bg-brand text-surface-900 shadow-brand hover:bg-brand-dark hover:-translate-y-0.5 active:translate-y-0'
                    : 'bg-surface-600 text-slate-500 cursor-not-allowed'
                }`}
              >
                Generate Tactical Plan →
              </button>
              {!canGenerate && (
                <p className="text-xs text-slate-500 text-center mt-2 font-mono">
                  Select two different teams and a venue
                </p>
              )}
              <p className="text-xs text-slate-600 text-center mt-3 font-mono">
                Falls back to demo data if backend is offline
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
