"""
Request Models for MatchIQ AI
"""
from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict


class TacticalSignalsInput(BaseModel):
    """Tactical intelligence input signals"""
    player_form_and_matchups: bool = True
    pressure_stability: bool = True
    acceleration_upside: bool = True
    opposition_vulnerability: bool = True
    context_aware_scoring_logic: bool = True
    injury_background: bool = True


class MatchContextRequest(BaseModel):
    """Main request model for tactical recommendation generation"""
    team_a: str = Field(..., description="First team name")
    team_b: str = Field(..., description="Second team name")
    venue: str = Field(..., description="Match venue")
    pitch_type: str = Field(..., description="Pitch type (e.g., Spin-Friendly, Pace-Friendly)")
    weather: str = Field(..., description="Weather conditions")
    match_phase: str = Field(..., description="Current match phase (e.g., Powerplay, Middle Overs)")
    playing_xi_team_a: List[str] = Field(..., description="Playing XI for team A")
    playing_xi_team_b: List[str] = Field(..., description="Playing XI for team B")
    signals: Optional[TacticalSignalsInput] = Field(default_factory=TacticalSignalsInput)

    @validator('team_a', 'team_b')
    def validate_team_names(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError("Team name cannot be empty")
        return v.strip()

    @validator('playing_xi_team_a', 'playing_xi_team_b')
    def validate_playing_xi(cls, v):
        if len(v) < 1:
            raise ValueError("Playing XI must have at least 1 player")
        if len(v) > 11:
            raise ValueError("Playing XI cannot exceed 11 players")
        return v

    class Config:
        schema_extra = {
            "example": {
                "team_a": "India",
                "team_b": "Australia",
                "venue": "Chennai",
                "pitch_type": "Spin-Friendly",
                "weather": "Hot / Dry",
                "match_phase": "Middle Overs",
                "playing_xi_team_a": [
                    "Rohit Sharma", "Virat Kohli", "Suryakumar Yadav",
                    "Hardik Pandya", "Ravindra Jadeja", "Rishabh Pant",
                    "Axar Patel", "Kuldeep Yadav", "Jasprit Bumrah",
                    "Mohammed Shami", "Mohammed Siraj"
                ],
                "playing_xi_team_b": [
                    "Travis Head", "David Warner", "Steve Smith",
                    "Glenn Maxwell", "Marcus Stoinis", "Tim David",
                    "Matthew Wade", "Pat Cummins", "Mitchell Starc",
                    "Adam Zampa", "Josh Hazlewood"
                ],
                "signals": {
                    "player_form_and_matchups": True,
                    "pressure_stability": True,
                    "acceleration_upside": True,
                    "opposition_vulnerability": True,
                    "context_aware_scoring_logic": True,
                    "injury_background": True
                }
            }
        }
