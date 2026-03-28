"""
Helper utility functions
"""
from typing import Dict, Any, Optional

def safe_get(data: Dict, key: str, default: Any = None) -> Any:
    """Safely get value from dictionary"""
    try:
        return data.get(key, default)
    except (AttributeError, KeyError):
        return default

def normalize_score(score: float, min_val: float = 0, max_val: float = 100) -> int:
    """Normalize score to 0-100 range"""
    normalized = max(min_val, min(max_val, score))
    return int(normalized)

def calculate_weighted_average(scores: Dict[str, float], weights: Dict[str, float]) -> float:
    """Calculate weighted average of scores"""
    total_weight = sum(weights.values())
    if total_weight == 0:
        return 0
    weighted_sum = sum(scores.get(key, 0) * weight for key, weight in weights.items())
    return weighted_sum / total_weight

def format_player_name(name: str) -> str:
    """Format player name consistently"""
    return name.strip().title()

def get_phase_key(match_phase: str) -> str:
    """Convert match phase string to data key"""
    phase_map = {
        "powerplay": "powerplay",
        "middle overs": "middle_overs",
        "death overs": "death_overs"
    }
    return phase_map.get(match_phase.lower(), "middle_overs")
