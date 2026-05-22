import json
from pathlib import Path
from mcp.server.fastmcp import FastMCP

DATA_PATH = Path(__file__).parent / "data" / "guidelines.json"
mcp = FastMCP("MedicalGuidelines")


@mcp.tool()
def get_clinical_guidelines(symptom_category: str) -> str:
    """Retourne des orientations générales et red flags pour une catégorie symptomatique."""
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    entry = data.get(symptom_category, data.get("general", {}))
    red_flags = ", ".join(entry.get("red_flags", []))
    advice = entry.get("advice", "Surveillance et hydratation.")
    return (
        f"Catégorie : {symptom_category}. "
        f"Conseils généraux : {advice}. "
        f"Signes d'alerte à surveiller : {red_flags}."
    )


if __name__ == "__main__":
    mcp.run()
