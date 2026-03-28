"""
Match-related routes (prefixed with /match)
"""
from fastapi import APIRouter, HTTPException
from app.models.request_models import MatchContextRequest
from app.models.response_models import (
    TacticalRecommendationResponse,
    MatchSetupResponse,
    BattingRecommendation,
    ScoreBreakdown,
    TacticalSignals,
    ContextOutput,
    SimulationOutput
)
from app.services.data_loader import DataLoader
from app.services.scoring import ScoringEngine
from app.services.recommendation_engine import RecommendationEngine
from app.services.explanation import ExplanationGenerator
from app.services.simulation import SimulationGenerator

router = APIRouter()

# Initialize services
data_loader = DataLoader()
scoring_engine = ScoringEngine(data_loader)
recommendation_engine = RecommendationEngine(data_loader, scoring_engine)
explanation_generator = ExplanationGenerator(data_loader)
simulation_generator = SimulationGenerator()


@router.get("/setup", response_model=MatchSetupResponse)
async def get_match_setup():
    """Get match setup configuration — used by frontend on MatchSetupPage"""
    try:
        teams_data = data_loader.load_teams()
        venues_data = data_loader.load_venues()

        teams = [team["name"] for team in teams_data.get("teams", [])]
        venues = [venue["name"] for venue in venues_data.get("venues", [])]

        pitch_options = [
            "Spin-Friendly",
            "Pace-Friendly",
            "Balanced",
            "Dry / Turning",
            "Green / Seaming"
        ]
        weather_options = [
            "Hot / Dry",
            "Humid / Dew",
            "Overcast",
            "Clear",
            "Windy"
        ]
        match_phases = [
            "Powerplay",
            "Middle Overs",
            "Death Overs"
        ]

        playing_xi_defaults = {}
        for team in teams_data.get("teams", []):
            playing_xi_defaults[team["name"]] = team.get("default_xi", [])

        return MatchSetupResponse(
            teams=teams,
            venues=venues,
            pitch_options=pitch_options,
            weather_options=weather_options,
            match_phases=match_phases,
            playing_xi_defaults=playing_xi_defaults
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading match setup: {str(e)}")


@router.post("/generate-recommendation", response_model=TacticalRecommendationResponse)
async def generate_recommendation(request: MatchContextRequest):
    """
    Generate tactical recommendation (also available at root /generate-recommendation).
    This /match-prefixed version is kept for API docs / Swagger testing.
    """
    try:
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
        captain_summary = explanation_generator.generate_captain_summary(
            batting_rec_data, bowling_plan, context
        )

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
        tactical_timeline = simulation_generator.generate_tactical_timeline(
            context, bowling_plan, next_2_over_decisions
        )
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendation: {str(e)}")
