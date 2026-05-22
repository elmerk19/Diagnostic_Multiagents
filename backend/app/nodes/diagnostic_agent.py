from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.types import interrupt
from backend.app.llm import get_llm
from backend.app.state import MedicalState
from backend.app.tools.care_tools import recommend_interim_care
from backend.app.tools.mcp_client import fetch_clinical_guidelines
from backend.app.tools.patient_tools import ask_patient, build_question


def _detect_category(initial_case: str, answers: list[str]) -> tuple[str, bool]:
    text = (initial_case + " " + " ".join(answers)).lower()
    respiratory = any(
        w in text
        for w in ("toux", "respir", "gorge", "nez", "bronch", "essoufflement", "dyspn")
    )
    red_flags = any(
        w in text
        for w in ("douleur thoracique", "confusion", "essoufflement", "saignement",
                  "perte de connaissance", "paralysie")
    )
    category = "respiratory" if respiratory else "general"
    return category, red_flags


def _build_summary(initial_case: str, answers: list[str], guidelines: str) -> str:
    llm = get_llm()
    qa_lines = "\n".join(f"Q{i+1} R: {a}" for i, a in enumerate(answers))
    prompt = (
        "Tu es un assistant d'orientation clinique préliminaire (exercice académique). "
        "Produis une synthèse clinique préliminaire factuelle, sans diagnostic définitif.\n\n"
        f"Cas initial : {initial_case}\n\nRéponses patient :\n{qa_lines}\n\n"
        f"Références MCP : {guidelines}"
    )
    if llm:
        response = llm.invoke([
            SystemMessage(content="Réponds en français, 1 paragraphe structuré."),
            HumanMessage(content=prompt),
        ])
        return response.content

    category, red_flags = _detect_category(initial_case, answers)
    flag_note = " Signes d'alerte rapportés." if red_flags else ""
    return (
        f"Synthèse clinique préliminaire : le patient décrit « {initial_case[:120]} ». "
        f"Cinq éléments recueillis lors de l'anamnèse orientée.{flag_note} "
        f"Catégorie symptomatique estimée : {category}. "
        "Orientation non définitive — validation médicale requise."
    )


def diagnostic_agent_node(state: MedicalState) -> dict:
    initial_case = state.get("initial_case", "")
    count = state.get("question_count", 0)
    answers = list(state.get("patient_answers", []))

    if count < 5:
        question = build_question(initial_case, count)
        ask_patient.invoke({"question": question})
        patient_answer = interrupt({
            "type": "patient_question",
            "question": question,
            "index": count + 1,
            "total": 5,
        })
        if isinstance(patient_answer, dict):
            patient_answer = patient_answer.get("answer", str(patient_answer))
        answers.append(str(patient_answer))
        return {
            "question_count": count + 1,
            "patient_answers": answers,
            "current_question": question,
        }

    if not state.get("diagnostic_summary"):
        category, red_flags = _detect_category(initial_case, answers)
        guidelines = fetch_clinical_guidelines(category)
        summary = _build_summary(initial_case, answers, guidelines)
        interim = recommend_interim_care.invoke(
            {"symptom_category": category, "has_red_flags": red_flags}
        )
        return {
            "diagnostic_summary": summary,
            "interim_care": interim,
            "symptom_category": category,
            "mcp_guidelines": guidelines,
            "next": "physician_review",
        }

    return {}
