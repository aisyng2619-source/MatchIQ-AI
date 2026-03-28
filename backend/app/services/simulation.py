"""
Simulation Generator - Creates tactical visualization data
"""
from typing import Dict, List


class SimulationGenerator:
    """Generates simulation data for tactical visualization"""

    def generate_field_setup(self, context: Dict, fielding_changes: List[Dict]) -> List[Dict]:
        match_phase = context.get("match_phase", "").lower()
        pitch_type = context.get("pitch_type", "").lower()

        if "powerplay" in match_phase:
            field_positions = [
                {"role": "slip", "x": 85, "y": 48},
                {"role": "point", "x": 72, "y": 28},
                {"role": "cover", "x": 58, "y": 22},
                {"role": "mid_off", "x": 42, "y": 18},
                {"role": "mid_on", "x": 38, "y": 78},
                {"role": "midwicket", "x": 52, "y": 72},
                {"role": "square_leg", "x": 68, "y": 68},
                {"role": "fine_leg", "x": 82, "y": 55},
            ]
        elif "middle" in match_phase:
            if "spin" in pitch_type:
                field_positions = [
                    {"role": "slip", "x": 78, "y": 45},
                    {"role": "point", "x": 65, "y": 25},
                    {"role": "cover", "x": 52, "y": 20},
                    {"role": "long_off", "x": 35, "y": 12},
                    {"role": "long_on", "x": 32, "y": 85},
                    {"role": "deep_midwicket", "x": 62, "y": 82},
                    {"role": "square_leg", "x": 72, "y": 65},
                    {"role": "deep_point", "x": 75, "y": 22},
                ]
            else:
                field_positions = [
                    {"role": "point", "x": 68, "y": 28},
                    {"role": "cover", "x": 55, "y": 22},
                    {"role": "mid_off", "x": 42, "y": 15},
                    {"role": "long_on", "x": 35, "y": 88},
                    {"role": "deep_midwicket", "x": 58, "y": 85},
                    {"role": "square_leg", "x": 70, "y": 68},
                    {"role": "deep_point", "x": 78, "y": 25},
                    {"role": "third_man", "x": 85, "y": 42},
                ]
        else:  # Death overs
            field_positions = [
                {"role": "deep_point", "x": 82, "y": 22},
                {"role": "deep_cover", "x": 68, "y": 15},
                {"role": "long_off", "x": 48, "y": 8},
                {"role": "long_on", "x": 32, "y": 92},
                {"role": "deep_midwicket", "x": 58, "y": 88},
                {"role": "deep_square_leg", "x": 75, "y": 75},
                {"role": "deep_fine_leg", "x": 88, "y": 58},
                {"role": "third_man", "x": 90, "y": 38},
            ]
        return field_positions

    def generate_tactical_timeline(self, context: Dict, bowling_plan: List[Dict],
                                    next_2_over_decisions: List[Dict]) -> List[str]:
        match_phase = context.get("match_phase", "").lower()
        pitch_type = context.get("pitch_type", "").lower()
        timeline = []

        if "powerplay" in match_phase:
            timeline.append("Current Over → Aggressive field with slip in place")
        elif "middle" in match_phase:
            timeline.append("Current Over → Build pressure through tight lines")
        else:
            timeline.append("Current Over → Execute yorker-focused death plan")

        if bowling_plan and len(bowling_plan) > 0:
            bowler_1 = bowling_plan[0].get("bowler", "")
            timeline.append(f"Next Over → {bowler_1} to exploit matchup advantage")

        if bowling_plan and len(bowling_plan) > 1:
            bowler_2 = bowling_plan[1].get("bowler", "")
            timeline.append(f"Over +2 → {bowler_2} as variation option")

        if "spin" in pitch_type:
            timeline.append("Over +3 → Shift to spin choke if required")

        if "middle" in match_phase:
            timeline.append("Over +4 → Reassess acceleration threat")
        elif "death" in match_phase:
            timeline.append("Over +4 → Review death bowling execution")

        return timeline[:5]
