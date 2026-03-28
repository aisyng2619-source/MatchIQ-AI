"""
Explanation Generator - Converts scores to human-readable insights
"""
from typing import Dict, List


class ExplanationGenerator:
    """Generates explanations and reasoning for tactical decisions"""

    def __init__(self, data_loader):
        self.data_loader = data_loader

    def generate_batting_reasoning(self, player_name: str, score_breakdown: Dict, context: Dict) -> List[str]:
        reasoning = []
        player_data = self.data_loader.get_player_by_name(player_name)
        if not player_data:
            return ["Strong tactical option for current situation"]

        if score_breakdown.get("form", 0) > 75:
            reasoning.append("Excellent recent form with consistent performances")
        elif score_breakdown.get("form", 0) < 40:
            reasoning.append("Recent form below par, use tactically")

        if score_breakdown.get("explosion", 0) > 85:
            reasoning.append("High acceleration upside for quick runs")

        if score_breakdown.get("pressure", 0) > 80:
            reasoning.append("Reliable under pressure situations")

        match_phase = context.get("match_phase", "").lower()
        pitch_type = context.get("pitch_type", "").lower()

        if "spin" in pitch_type:
            matchup_stats = player_data.get("matchup_stats", {})
            vs_spin = matchup_stats.get("vs_spin", {})
            if vs_spin.get("sr", 0) > 160:
                reasoning.append("Excels against spin on turning tracks")

        if "middle" in match_phase and score_breakdown.get("phase", 0) > 75:
            reasoning.append("Ideal for middle overs acceleration")

        if score_breakdown.get("matchup", 0) > 70:
            reasoning.append("Favorable matchup against opposition attack")

        if not reasoning:
            reasoning.append("Tactical option based on match situation")
        return reasoning[:4]

    def generate_risk_note(self, player_name: str, score_breakdown: Dict) -> str:
        player_data = self.data_loader.get_player_by_name(player_name)
        if not player_data:
            return "Moderate risk option"

        recent_form = player_data.get("recent_form", {})
        runs_last_5 = recent_form.get("runs_last_5", [])
        if runs_last_5:
            variance = max(runs_last_5) - min(runs_last_5)
            if variance > 50:
                return "High variance player - risk/reward profile"

        if score_breakdown.get("availability", 100) < 90:
            return "Minor injury concerns - monitor workload"

        if score_breakdown.get("pressure", 0) < 60:
            return "Lower reliability under extreme pressure"

        if score_breakdown.get("explosion", 0) > 90:
            return "High upside but aggressive approach"

        return "Balanced risk profile"

    def generate_captain_summary(self, batting_rec: Dict, bowling_plan: List[Dict], context: Dict) -> str:
        match_phase = context.get("match_phase", "").lower()
        pitch_type = context.get("pitch_type", "").lower()
        summaries = []

        if batting_rec:
            player = batting_rec.get("player", "")
            if "middle" in match_phase:
                summaries.append(f"Promote {player} for middle-overs acceleration")
            else:
                summaries.append(f"Use {player} as key tactical option")

        if bowling_plan and len(bowling_plan) > 0:
            primary_bowler = bowling_plan[0].get("bowler", "")
            if "spin" in pitch_type:
                summaries.append(f"Deploy {primary_bowler} to exploit spin-friendly conditions")
            else:
                summaries.append(f"Use {primary_bowler} for breakthrough")

        if "death" in match_phase:
            summaries.append("Focus on boundary protection and yorker execution")
        elif "powerplay" in match_phase:
            summaries.append("Attack early with aggressive fields")
        elif "middle" in match_phase:
            summaries.append("Build pressure through tight bowling and smart field placements")

        return ". ".join(summaries[:3]) + "."

    def determine_tactical_mode(self, context: Dict) -> str:
        match_phase = context.get("match_phase", "").lower()
        pitch_type = context.get("pitch_type", "").lower()
        weather = context.get("weather", "").lower()

        if "spin" in pitch_type and "middle" in match_phase:
            return "Spin Pressure Mode"
        if "pace" in pitch_type and "powerplay" in match_phase:
            return "Pace Attack Mode"
        if "death" in match_phase:
            return "Death Overs Defense Mode"
        if "dew" in weather or "humid" in weather:
            return "Dew-Adjusted Strategy"
        return "Balanced Tactical Mode"
