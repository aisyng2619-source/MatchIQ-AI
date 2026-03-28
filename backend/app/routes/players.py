"""
Player insight routes
"""
from fastapi import APIRouter, HTTPException, Path
from app.models.response_models import PlayerInsightResponse
from app.services.data_loader import DataLoader

router = APIRouter()
data_loader = DataLoader()


@router.get("/{player_name}", response_model=PlayerInsightResponse)
async def get_player_insight(
    player_name: str = Path(..., description="Player name")
):
    """Get detailed player insights and analytics"""
    try:
        insight_data = data_loader.get_player_insight(player_name)
        if not insight_data:
            raise HTTPException(
                status_code=404,
                detail=f"Player insight not found for: {player_name}"
            )

        response = PlayerInsightResponse(
            player_name=insight_data["player_name"],
            form_trend=insight_data.get("form_trend", {}),
            phase_performance=insight_data.get("phase_breakdown", {}),
            matchup_stats=insight_data.get("matchup_analysis", {}),
            pressure_stability=insight_data.get("pressure_metrics", {}).get("pressure_stability", 75),
            acceleration_upside=insight_data.get("acceleration_metrics", {}).get("acceleration_upside", 75),
            injury_availability=insight_data.get("injury_status", {}),
            tactical_summary=insight_data.get("tactical_summary", "")
        )
        return response

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching player insight: {str(e)}")
