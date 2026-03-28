"""
Data Loader Service - Loads and manages cricket data
"""
import json
from pathlib import Path
from typing import Dict, List, Optional


class DataLoader:
    """Manages loading and caching of cricket data"""

    def __init__(self):
        self.data_dir = Path(__file__).parent.parent / "data"
        self._teams = None
        self._players = None
        self._venues = None
        self._matchups = None
        self._player_insights = None

    def load_teams(self) -> Dict:
        if self._teams is None:
            with open(self.data_dir / "teams.json", "r") as f:
                self._teams = json.load(f)
        return self._teams

    def load_players(self) -> Dict:
        if self._players is None:
            with open(self.data_dir / "players.json", "r") as f:
                self._players = json.load(f)
        return self._players

    def load_venues(self) -> Dict:
        if self._venues is None:
            with open(self.data_dir / "venues.json", "r") as f:
                self._venues = json.load(f)
        return self._venues

    def load_matchups(self) -> Dict:
        if self._matchups is None:
            with open(self.data_dir / "matchups.json", "r") as f:
                self._matchups = json.load(f)
        return self._matchups

    def load_player_insights(self) -> Dict:
        if self._player_insights is None:
            with open(self.data_dir / "player_insights.json", "r") as f:
                self._player_insights = json.load(f)
        return self._player_insights

    def get_player_by_name(self, player_name: str) -> Optional[Dict]:
        players_data = self.load_players()
        for player in players_data.get("players", []):
            if player["name"].lower() == player_name.lower():
                return player
        return None

    def get_team_by_name(self, team_name: str) -> Optional[Dict]:
        teams_data = self.load_teams()
        for team in teams_data.get("teams", []):
            if team["name"].lower() == team_name.lower():
                return team
        return None

    def get_venue_by_name(self, venue_name: str) -> Optional[Dict]:
        venues_data = self.load_venues()
        for venue in venues_data.get("venues", []):
            if venue["name"].lower() == venue_name.lower():
                return venue
        return None

    def get_matchup(self, batter: str, bowler: str) -> Optional[Dict]:
        matchups_data = self.load_matchups()
        for matchup in matchups_data.get("matchups", []):
            if (matchup["batter"].lower() == batter.lower() and
                    matchup["bowler"].lower() == bowler.lower()):
                return matchup
        return None

    def get_player_insight(self, player_name: str) -> Optional[Dict]:
        insights_data = self.load_player_insights()
        for insight in insights_data.get("player_insights", []):
            if insight["player_name"].lower() == player_name.lower():
                return insight
        return None

    def get_team_players(self, team_name: str, playing_xi: List[str]) -> List[Dict]:
        players = []
        for player_name in playing_xi:
            player_data = self.get_player_by_name(player_name)
            if player_data:
                players.append(player_data)
            else:
                # Return a minimal placeholder so the XI is always populated
                players.append({
                    "name": player_name,
                    "role": "Batsman",
                    "batting_style": "Right-hand",
                    "bowling_style": "Unknown",
                    "recent_form": {"runs_last_5": [30, 35, 40, 28, 38], "strike_rate_last_5": [135, 140, 130, 128, 138], "average_last_5": 34.2},
                    "phase_stats": {
                        "powerplay": {"avg": 30, "sr": 135},
                        "middle_overs": {"avg": 35, "sr": 138},
                        "death_overs": {"avg": 28, "sr": 150}
                    },
                    "matchup_stats": {
                        "vs_pace": {"avg": 32, "sr": 138, "dismissals": 10},
                        "vs_spin": {"avg": 30, "sr": 130, "dismissals": 10}
                    },
                    "pressure_rating": 65,
                    "acceleration_rating": 65,
                    "injury_history": "none",
                    "availability": 95
                })
        return players
