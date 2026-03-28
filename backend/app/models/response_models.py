"""
Response Models for MatchIQ AI
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class ScoreBreakdown(BaseModel):
    form: int = Field(..., ge=0, le=100)
    matchup: int = Field(..., ge=0, le=100)
    phase: int = Field(..., ge=0, le=100)
    pressure: int = Field(..., ge=0, le=100)
    explosion: int = Field(..., ge=0, le=100)
    availability: int = Field(..., ge=0, le=100)


class BattingRecommendation(BaseModel):
    title: str
    player: str
    score: int = Field(..., ge=0, le=100)
    confidence: int = Field(..., ge=0, le=100)
    risk_note: str
    reasoning: List[str]
    score_breakdown: Optional[ScoreBreakdown] = None


class BowlingPlanItem(BaseModel):
    over_slot: int
    bowler: str
    target_batter: str
    confidence: int = Field(..., ge=0, le=100)
    reason: str


class FieldingChange(BaseModel):
    title: str
    reason: str


class NextOverDecision(BaseModel):
    over: str
    mode: str
    decision: str


class FavorableMatchup(BaseModel):
    batter: str
    bowler: str
    edge_score: int = Field(..., ge=0, le=100)
    explanation: str


class DangerousMatchup(BaseModel):
    batter: str
    bowler: str
    risk_score: int = Field(..., ge=0, le=100)
    explanation: str


class TacticalSignals(BaseModel):
    pressure_stability: int = Field(..., ge=0, le=100)
    acceleration_upside: int = Field(..., ge=0, le=100)
    opposition_vulnerability: int = Field(..., ge=0, le=100)
    matchup_strength: int = Field(..., ge=0, le=100)
    context_fit: int = Field(..., ge=0, le=100)
    injury_risk: int = Field(..., ge=0, le=100)
    confidence: int = Field(..., ge=0, le=100)


class ContextOutput(BaseModel):
    venue: str
    weather: str
    pitch_type: str
    match_phase: str
    tactical_mode: str


class FieldPosition(BaseModel):
    role: str
    x: int = Field(..., ge=0, le=100)
    y: int = Field(..., ge=0, le=100)


class SimulationOutput(BaseModel):
    field_setup: List[FieldPosition]
    timeline: List[str]


class TacticalRecommendationResponse(BaseModel):
    batting_recommendation: BattingRecommendation
    bowling_plan: List[BowlingPlanItem]
    fielding_changes: List[FieldingChange]
    next_2_over_decisions: List[NextOverDecision]
    favorable_matchups: List[FavorableMatchup]
    dangerous_matchups: List[DangerousMatchup]
    captain_summary: str
    signals: TacticalSignals
    context: ContextOutput
    simulation: SimulationOutput


class MatchSetupResponse(BaseModel):
    teams: List[str]
    venues: List[str]
    pitch_options: List[str]
    weather_options: List[str]
    match_phases: List[str]
    playing_xi_defaults: Dict[str, List[str]]


class PlayerPhasePerformance(BaseModel):
    powerplay: Dict[str, Any]
    middle_overs: Dict[str, Any]
    death_overs: Dict[str, Any]


class PlayerMatchupStats(BaseModel):
    vs_pace: Dict[str, Any]
    vs_spin: Dict[str, Any]


class PlayerInsightResponse(BaseModel):
    player_name: str
    form_trend: Dict[str, Any]
    phase_performance: PlayerPhasePerformance
    matchup_stats: PlayerMatchupStats
    pressure_stability: int = Field(..., ge=0, le=100)
    acceleration_upside: int = Field(..., ge=0, le=100)
    injury_availability: Dict[str, Any]
    tactical_summary: str
