"""
Health, root-level generate-recommendation, and simulation-state routes.

The frontend api.js calls:
  POST /generate-recommendation       (NOT /match/generate-recommendation)
  GET  /simulation-state
  GET  /health

These are handled here at the root level. The /match prefix router
handles /match/setup and /match/generate-recommendation (for Swagger).
"""
from fastapi import APIRouter, HTTPException
from app.models.request_models import MatchContextRequest
from app.models.response_models import (
    TacticalRecommendationResponse,
    BattingRecommendation,
    ScoreBreakdown,
    TacticalSignals,
    ContextOutput,
    SimulationOutput,
)
from app.services.data_loader import DataLoader
from app.services.scoring import ScoringEngine
from app.services.recommendation_engine import RecommendationEngine
from app.services.explanation import ExplanationGenerator
from app.services.simulation import SimulationGenerator

router = APIRouter()

# Shared service instances
_data_loader = DataLoader()
_scoring_engine = ScoringEngine(_data_loader)
_recommendation_engine = RecommendationEngine(_data_loader, _scoring_engine)
_explanation_generator = ExplanationGenerator(_data_loader)
_simulation_generator = SimulationGenerator()


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "MatchIQ AI",
        "version": "1.0.0"
    }


def _build_recommendation_response(request: MatchContextRequest) -> TacticalRecommendationResponse:
    """Shared logic to build the full tactical recommendation response."""
    data_loader = _data_loader
    recommendation_engine = _recommendation_engine
    explanation_generator = _explanation_generator
    simulation_generator = _simulation_generator

    team_a_players = data_loader.get_team_players(request.team_a, request.playing_xi_team_a)
    team_b_players = data_loader.get_team_players(request.team_b, request.playing_xi_team_b)

    context = {
        "venue": request.venue,
        "pitch_type": request.pitch_type,
        "weather": request.weather,
        "match_phase": request.match_phase,
        "team_a_players": team_a_players,
        "team_b_players": team_b_players,
        "opposition_players": team_b_players
    }
    signals_dict = request.signals.dict() if request.signals else {}

    # Batting recommendation
    batting_rec_data = recommendation_engine.generate_batting_recommendation(
        team_a_players, context, signals_dict
    )
    reasoning = explanation_generator.generate_batting_reasoning(
        batting_rec_data["player"], batting_rec_data["breakdown"], context
    )
    risk_note = explanation_generator.generate_risk_note(
        batting_rec_data["player"], batting_rec_data["breakdown"]
    )
    score_breakdown = batting_rec_data["breakdown"]

    batting_recommendation = BattingRecommendation(
        title=f"Promote {batting_rec_data['player']}",
        player=batting_rec_data["player"],
        score=batting_rec_data["score"],
        confidence=score_breakdown.get("confidence", 75),
        risk_note=risk_note,
        reasoning=reasoning,
        score_breakdown=ScoreBreakdown(
            form=score_breakdown.get("form", 50),
            matchup=score_breakdown.get("matchup", 50),
            phase=score_breakdown.get("phase", 50),
            pressure=score_breakdown.get("pressure", 50),
            explosion=score_breakdown.get("explosion", 50),
            availability=score_breakdown.get("availability", 50)
        )
    )

    bowling_plan = recommendation_engine.generate_bowling_plan(
        team_b_players, team_a_players, context, signals_dict
    )
    fielding_changes = recommendation_engine.generate_fielding_changes(context)
    next_2_over_decisions = recommendation_engine.generate_next_2_over_decisions(context)
    favorable_matchups = recommendation_engine.generate_favorable_matchups(team_a_players, team_b_players)
    dangerous_matchups = recommendation_engine.generate_dangerous_matchups(team_a_players, team_b_players)
    captain_summary = explanation_generator.generate_captain_summary(batting_rec_data, bowling_plan, context)

    signals = TacticalSignals(
        pressure_stability=score_breakdown.get("pressure", 75),
        acceleration_upside=score_breakdown.get("explosion", 80),
        opposition_vulnerability=76,
        matchup_strength=score_breakdown.get("matchup", 75),
        context_fit=score_breakdown.get("phase", 80),
        injury_risk=100 - score_breakdown.get("availability", 90),
        confidence=score_breakdown.get("confidence", 78)
    )
    tactical_mode = explanation_generator.determine_tactical_mode(context)
    context_output = ContextOutput(
        venue=request.venue,
        weather=request.weather,
        pitch_type=request.pitch_type,
        match_phase=request.match_phase,
        tactical_mode=tactical_mode
    )

    field_setup = simulation_generator.generate_field_setup(context, fielding_changes)
    tactical_timeline = simulation_generator.generate_tactical_timeline(context, bowling_plan, next_2_over_decisions)
    simulation = SimulationOutput(field_setup=field_setup, timeline=tactical_timeline)

    return TacticalRecommendationResponse(
        batting_recommendation=batting_recommendation,
        bowling_plan=bowling_plan,
        fielding_changes=fielding_changes,
        next_2_over_decisions=next_2_over_decisions,
        favorable_matchups=favorable_matchups,
        dangerous_matchups=dangerous_matchups,
        captain_summary=captain_summary,
        signals=signals,
        context=context_output,
        simulation=simulation
    )


@router.post("/generate-recommendation", response_model=TacticalRecommendationResponse)
async def generate_recommendation_root(request: MatchContextRequest):
    """
    Generate tactical recommendation — root-level endpoint used by the frontend.
    Frontend api.js calls POST /generate-recommendation (not /match/generate-recommendation).
    """
    try:
        return _build_recommendation_response(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendation: {str(e)}")


@router.get("/simulation-state")
async def get_simulation_state():
    """
    Returns the last recommendation's simulation state.
    Frontend SimulationPage calls GET /simulation-state.
    Since the backend is stateless, this returns a default/empty state;
    the frontend falls back to its own stored recommendation from context.
    """
    return {
        "status": "ready",
        "message": "Use POST /generate-recommendation to create a new simulation state.",
        "simulation": None
    }
