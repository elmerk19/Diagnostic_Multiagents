from __future__ import annotations
import json
from pathlib import Path

MCP_DATA_PATH = Path(__file__).resolve().parents[4] / "mcp_server" / "data" / "guidelines.json"


def fetch_clinical_guidelines(symptom_category: str) -> str:
    if not MCP_DATA_PATH.exists():
        return "Aucune donnée MCP locale disponible."
    data = json.loads(MCP_DATA_PATH.read_text(encoding="utf-8"))
    entry = data.get(symptom_category, data.get("general", {}))
    red_flags = ", ".join(entry.get("red_flags", []))
    advice = entry.get("advice", "Surveillance et hydratation.")
    return f"[MCP] Orientations ({symptom_category}) — Conseils : {advice}. Red flags : {red_flags}."
