from backend.app.state import MedicalState


def supervisor_node(state: MedicalState) -> dict:
    if state.get("final_report"):
        return {"next": "FINISH"}
    if state.get("physician_treatment") and not state.get("final_report"):
        return {"next": "report_agent"}
    if state.get("diagnostic_summary") and not state.get("physician_treatment"):
        return {"next": "physician_review"}
    if state.get("question_count", 0) < 5 or not state.get("diagnostic_summary"):
        return {"next": "diagnostic_agent"}
    return {"next": "diagnostic_agent"}


def route_supervisor(state: MedicalState) -> str:
    return state.get("next", "diagnostic_agent")
