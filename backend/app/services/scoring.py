"""
Scoring Engine - Computes tactical scores and metrics
"""
from typing import Dict, List, Optional
import statistics


class ScoringEngine:
    """Computes tactical intelligence scores"""

    def __init__(self, data_loader):
        self.data_loader = data_loader

    def compute_form_score(self, player_data: Dict) -> int:
        if not player_data or "recent_form" not in player_data:
            return 50
        recent_form = player_data["recent_form"]
        runs_last_5 = recent_form.get("runs_last_5", [])
        if not runs_last_5:
            return 50
        avg_runs = statistics.mean(runs_last_5)
        if len(runs_last_5) > 1:
            std_dev = statistics.stdev(runs_last_5)
            consistency = max(0, 100 - (std_dev / 2))
        else:
            consistency = 50
        if len(runs_last_5) >= 2:
            trend = (runs_last_5[-1] - runs_last_5[-2]) / max(runs_last_5[-2], 1)
            trend_bonus = min(20, max(-20, trend * 50))
        else:
            trend_bonus = 0
        base_score = min(100, (avg_runs / 50) * 50)
        form_score = int((base_score * 0.6) + (consistency * 0.3) + (trend_bonus * 0.1))
        return max(0, min(100, form_score))

    def compute_matchup_score(self, batter: str, bowler: str, context: Dict) -> int:
        matchup_data = self.data_loader.get_matchup(batter, bowler)
        if not matchup_data:
            return 50
        edge_score = matchup_data.get("edge_score", 0)
        normalized_score = int(((edge_score + 30) / 120) * 100)
        return max(0, min(100, normalized_score))

    def compute_pressure_stability(self, player_data: Dict) -> int:
        if not player_data:
            return 50
        if "pressure_rating" in player_data:
            return player_data["pressure_rating"]
        phase_stats = player_data.get("phase_stats", {})
        death_stats = phase_stats.get("death_overs", {})
        death_avg = death_stats.get("avg", 30)
        death_sr = death_stats.get("sr", 140)
        avg_component = min(50, (death_avg / 40) * 50)
        sr_component = min(50, ((death_sr - 120) / 80) * 50)
        return max(0, min(100, int(avg_component + sr_component)))

    def compute_acceleration_upside(self, player_data: Dict) -> int:
        if not player_data:
            return 50
        if "acceleration_rating" in player_data:
            return player_data["acceleration_rating"]
        recent_form = player_data.get("recent_form", {})
        strike_rates = recent_form.get("strike_rate_last_5", [])
        if not strike_rates:
            return 50
        avg_sr = statistics.mean(strike_rates)
        if len(strike_rates) > 1:
            variance = statistics.stdev(strike_rates)
        else:
            variance = 0
        sr_score = min(60, ((avg_sr - 100) / 100) * 60)
        explosive_score = min(40, (variance / 40) * 40)
        return max(0, min(100, int(sr_score + explosive_score)))

    def compute_opposition_vulnerability(self, batter: str, opposition_bowling: List[str],
                                          pitch_type: str, context: Dict) -> int:
        batter_data = self.data_loader.get_player_by_name(batter)
        if not batter_data:
            return 50
        matchup_stats = batter_data.get("matchup_stats", {})
        vulnerability_scores = []
        if "spin" in pitch_type.lower():
            vs_spin = matchup_stats.get("vs_spin", {})
            spin_sr = vs_spin.get("sr", 130)
            spin_dismissals = vs_spin.get("dismissals", 10)
            spin_score = min(100, ((spin_sr - 100) / 100) * 70 - (spin_dismissals * 2))
            vulnerability_scores.append(spin_score)
        if "pace" in pitch_type.lower():
            vs_pace = matchup_stats.get("vs_pace", {})
            pace_sr = vs_pace.get("sr", 140)
            pace_dismissals = vs_pace.get("dismissals", 10)
            pace_score = min(100, ((pace_sr - 100) / 100) * 70 - (pace_dismissals * 2))
            vulnerability_scores.append(pace_score)
        if vulnerability_scores:
            return max(0, min(100, int(statistics.mean(vulnerability_scores))))
        return 50

    def compute_context_fit(self, player_data: Dict, match_phase: str,
                             pitch_type: str, weather: str) -> int:
        if not player_data:
            return 50
        phase_stats = player_data.get("phase_stats", {})
        phase_map = {
            "powerplay": "powerplay",
            "middle overs": "middle_overs",
            "death overs": "death_overs"
        }
        phase_key = phase_map.get(match_phase.lower(), "middle_overs")
        phase_data = phase_stats.get(phase_key, {})
        phase_avg = phase_data.get("avg", 35)
        phase_sr = phase_data.get("sr", 140)
        context_bonus = 0
        if "spin" in pitch_type.lower():
            matchup_stats = player_data.get("matchup_stats", {})
            vs_spin = matchup_stats.get("vs_spin", {})
            if vs_spin.get("sr", 0) > 150:
                context_bonus += 15
        if "hot" in weather.lower() and phase_key == "death_overs":
            if phase_sr > 170:
                context_bonus += 10
        avg_component = min(40, (phase_avg / 50) * 40)
        sr_component = min(40, ((phase_sr - 100) / 100) * 40)
        return max(0, min(100, int(avg_component + sr_component + context_bonus)))

    def compute_injury_risk(self, player_data: Dict) -> int:
        if not player_data:
            return 30
        availability = player_data.get("availability", 95)
        return max(0, min(100, 100 - availability))

    def compute_confidence_score(self, form_score: int, matchup_score: int,
                                  context_fit: int, injury_risk: int) -> int:
        confidence = int(
            (form_score * 0.3) +
            (matchup_score * 0.25) +
            (context_fit * 0.25) +
            ((100 - injury_risk) * 0.2)
        )
        return max(0, min(100, confidence))

    def compute_comprehensive_score(self, player_name: str, context: Dict, signals: Dict) -> Dict:
        player_data = self.data_loader.get_player_by_name(player_name)
        if not player_data:
            return {
                "total_score": 50, "form": 50, "matchup": 50, "phase": 50,
                "pressure": 50, "explosion": 50, "availability": 50, "confidence": 50
            }

        form_score = self.compute_form_score(player_data) if signals.get("player_form_and_matchups") else 50

        opposition_players = context.get("opposition_players", [])
        matchup_score = 50
        if opposition_players:
            for opp in opposition_players:
                if opp.get("role") == "Bowler":
                    matchup_score = self.compute_matchup_score(player_name, opp["name"], context)
                    break

        pressure_score = self.compute_pressure_stability(player_data) if signals.get("pressure_stability") else 50
        acceleration_score = self.compute_acceleration_upside(player_data) if signals.get("acceleration_upside") else 50

        opposition_bowling = [p["name"] for p in opposition_players if p.get("role") == "Bowler"]
        vulnerability_score = self.compute_opposition_vulnerability(
            player_name, opposition_bowling,
            context.get("pitch_type", ""), context
        ) if signals.get("opposition_vulnerability") else 50

        context_fit_score = self.compute_context_fit(
            player_data,
            context.get("match_phase", ""),
            context.get("pitch_type", ""),
            context.get("weather", "")
        ) if signals.get("context_aware_scoring_logic") else 50

        injury_risk_score = self.compute_injury_risk(player_data) if signals.get("injury_background") else 20
        availability_score = 100 - injury_risk_score

        confidence_score = self.compute_confidence_score(
            form_score, matchup_score, context_fit_score, injury_risk_score
        )

        total_score = int(
            (form_score * 0.20) +
            (matchup_score * 0.15) +
            (context_fit_score * 0.20) +
            (pressure_score * 0.15) +
            (acceleration_score * 0.15) +
            (availability_score * 0.15)
        )

        return {
            "total_score": max(0, min(100, total_score)),
            "form": form_score,
            "matchup": matchup_score,
            "phase": context_fit_score,
            "pressure": pressure_score,
            "explosion": acceleration_score,
            "availability": availability_score,
            "confidence": confidence_score
        }
