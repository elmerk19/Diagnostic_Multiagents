from langgraph.types import interrupt
from backend.app.state import MedicalState


def physician_review_node(state: MedicalState) -> dict:
    payload = interrupt(
        {
            "type": "physician_review",
            "diagnostic_summary": state.get("diagnostic_summary", ""),
            "interim_care": state.get("interim_care", ""),
            "message": (
                "Le médecin traitant doit valider ou ajuster la conduite à tenir "
                "avant la génération du rapport final."
            ),
        }
    )
    if isinstance(payload, dict):
        treatment = payload.get("physician_treatment", payload.get("answer", ""))
    else:
        treatment = str(payload)
    return {"physician_treatment": treatment.strip(), "next": "report_agent"}
