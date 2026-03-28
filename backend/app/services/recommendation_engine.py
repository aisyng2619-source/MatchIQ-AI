"""
Tactical Recommendation Engine - Core decision intelligence
"""
from typing import Dict, List


class RecommendationEngine:
    """Generates tactical recommendations"""

    def __init__(self, data_loader, scoring_engine):
        self.data_loader = data_loader
        self.scoring = scoring_engine

    def generate_batting_recommendation(self, team_players: List[Dict],
                                         context: Dict, signals: Dict) -> Dict:
        batter_scores = []
        for player in team_players:
            if player.get("role") in ["Batsman", "All-rounder"]:
                score_breakdown = self.scoring.compute_comprehensive_score(
                    player["name"], context, signals
                )
                batter_scores.append({
                    "player": player["name"],
                    "score": score_breakdown["total_score"],
                    "breakdown": score_breakdown
                })
        batter_scores.sort(key=lambda x: x["score"], reverse=True)
        if not batter_scores:
            return {
                "player": team_players[0]["name"] if team_players else "Unknown",
                "score": 50,
                "breakdown": {}
            }
        top = batter_scores[0]
        return {"player": top["player"], "score": top["score"], "breakdown": top["breakdown"]}

    def generate_bowling_plan(self, bowling_team_players: List[Dict],
                               batting_team_players: List[Dict],
                               context: Dict, signals: Dict) -> List[Dict]:
        bowling_plan = []
        bowlers = [p for p in bowling_team_players if p.get("role") in ["Bowler", "All-rounder"]]
        batters = [p for p in batting_team_players if p.get("role") in ["Batsman", "All-rounder"]]
        if not bowlers or not batters:
            return []

        match_phase = context.get("match_phase", "Middle Overs").lower()
        pitch_type = context.get("pitch_type", "").lower()

        if "spin" in pitch_type and "middle" in match_phase:
            spin_bowlers = [b for b in bowlers if "spin" in b.get("bowling_style", "").lower()]
            selected_bowlers = spin_bowlers[:2] if len(spin_bowlers) >= 2 else bowlers[:2]
        else:
            selected_bowlers = bowlers[:2]

        for i, bowler in enumerate(selected_bowlers[:2]):
            target_batter = batters[min(i, len(batters) - 1)]
            matchup_data = self.data_loader.get_matchup(target_batter["name"], bowler["name"])
            if matchup_data:
                edge_score = matchup_data.get("edge_score", 0)
                confidence = max(60, min(95, 75 - edge_score))
            else:
                confidence = 75
            bowling_plan.append({
                "over_slot": i + 1,
                "bowler": bowler["name"],
                "target_batter": target_batter["name"],
                "confidence": int(confidence),
                "reason": self._generate_bowling_reason(bowler, target_batter, context)
            })
        return bowling_plan

    def _generate_bowling_reason(self, bowler: Dict, batter: Dict, context: Dict) -> str:
        bowling_style = bowler.get("bowling_style", "").lower()
        match_phase = context.get("match_phase", "").lower()
        reasons = []
        if "spin" in bowling_style:
            reasons.append("Spin control in middle overs" if "middle" in match_phase else "Spin variation option")
        if "fast" in bowling_style or "pace" in bowling_style:
            if "powerplay" in match_phase:
                reasons.append("Pace threat in powerplay")
            elif "death" in match_phase:
                reasons.append("Death overs specialist")
            else:
                reasons.append("Pace variation")
        matchup = self.data_loader.get_matchup(batter["name"], bowler["name"])
        if matchup and matchup.get("edge_score", 0) < -10:
            reasons.append(f"Strong matchup advantage vs {batter['name']}")
        return reasons[0] if reasons else "Tactical bowling option"

    def generate_fielding_changes(self, context: Dict) -> List[Dict]:
        match_phase = context.get("match_phase", "").lower()
        pitch_type = context.get("pitch_type", "").lower()
        fielding_changes = []
        if "middle" in match_phase:
            if "spin" in pitch_type:
                fielding_changes.append({"title": "Bring slip in for spin", "reason": "Spin-friendly pitch increases edge chances"})
                fielding_changes.append({"title": "Protect deep midwicket", "reason": "Batters target leg-side boundaries vs spin"})
            else:
                fielding_changes.append({"title": "Deep point protection", "reason": "Middle overs acceleration phase"})
        if "death" in match_phase:
            fielding_changes.append({"title": "Set defensive long boundaries", "reason": "Death overs require boundary protection"})
            fielding_changes.append({"title": "Deep square leg and long on", "reason": "Power hitting zones in death overs"})
        if "powerplay" in match_phase:
            fielding_changes.append({"title": "Keep aggressive ring field", "reason": "Powerplay restrictions favor attacking fields"})
        if not fielding_changes:
            fielding_changes.append({"title": "Balanced field setup", "reason": "Adapt to match situation"})
        return fielding_changes[:3]

    def generate_next_2_over_decisions(self, context: Dict) -> List[Dict]:
        match_phase = context.get("match_phase", "").lower()
        pitch_type = context.get("pitch_type", "").lower()
        decisions = []
        if "middle" in match_phase:
            if "spin" in pitch_type:
                decisions.append({"over": "Current + 1", "mode": "Control", "decision": "Use spin pressure to build dot-ball pressure"})
                decisions.append({"over": "Current + 2", "mode": "Attack", "decision": "Aggressive field with slip for wicket chance"})
            else:
                decisions.append({"over": "Current + 1", "mode": "Contain", "decision": "Tight lines to restrict run flow"})
                decisions.append({"over": "Current + 2", "mode": "Attack", "decision": "Introduce variation for breakthrough"})
        if "death" in match_phase:
            decisions.append({"over": "Current + 1", "mode": "Defend", "decision": "Protect boundaries and bowl yorkers"})
            decisions.append({"over": "Current + 2", "mode": "Execute", "decision": "Stick to death bowling plans"})
        if "powerplay" in match_phase:
            decisions.append({"over": "Current + 1", "mode": "Attack", "decision": "Use new ball swing for early wickets"})
            decisions.append({"over": "Current + 2", "mode": "Pressure", "decision": "Maintain aggressive lines and attacking fields"})
        return decisions[:2]

    def generate_favorable_matchups(self, team_a_players: List[Dict], team_b_players: List[Dict]) -> List[Dict]:
        batters = [p for p in team_a_players if p.get("role") in ["Batsman", "All-rounder"]]
        bowlers = [p for p in team_b_players if p.get("role") in ["Bowler", "All-rounder"]]
        favorable = []
        for batter in batters:
            for bowler in bowlers:
                matchup = self.data_loader.get_matchup(batter["name"], bowler["name"])
                if matchup and matchup.get("edge_score", 0) > 50:
                    favorable.append({
                        "batter": batter["name"],
                        "bowler": bowler["name"],
                        "edge_score": matchup["edge_score"],
                        "explanation": matchup.get("context", "Strong matchup advantage")
                    })
        favorable.sort(key=lambda x: x["edge_score"], reverse=True)
        return favorable[:3]

    def generate_dangerous_matchups(self, team_a_players: List[Dict], team_b_players: List[Dict]) -> List[Dict]:
        batters = [p for p in team_a_players if p.get("role") in ["Batsman", "All-rounder"]]
        bowlers = [p for p in team_b_players if p.get("role") in ["Bowler", "All-rounder"]]
        dangerous = []
        for batter in batters:
            for bowler in bowlers:
                matchup = self.data_loader.get_matchup(batter["name"], bowler["name"])
                if matchup and matchup.get("edge_score", 0) < -10:
                    risk_score = abs(matchup["edge_score"])
                    dangerous.append({
                        "batter": batter["name"],
                        "bowler": bowler["name"],
                        "risk_score": min(100, risk_score),
                        "explanation": matchup.get("context", "Challenging matchup")
                    })
        dangerous.sort(key=lambda x: x["risk_score"], reverse=True)
        return dangerous[:3]
