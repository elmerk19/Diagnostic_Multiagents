from langchain_core.messages import HumanMessage, SystemMessage
from backend.app.llm import get_llm
from backend.app.state import MedicalState

DISCLAIMER = "\n\n---\n**Avertissement :** Ce système ne remplace pas une consultation médicale."


def report_agent_node(state: MedicalState) -> dict:
    initial_case = state.get("initial_case", "")
    summary = state.get("diagnostic_summary", "")
    interim = state.get("interim_care", "")
    physician = state.get("physician_treatment", "")
    answers = state.get("patient_answers", [])
    guidelines = state.get("mcp_guidelines", "")

    llm = get_llm()
    if llm:
        prompt = (
            "Génère un rapport final structuré (Markdown) pour un exercice d'orientation clinique.\n"
            "Sections : 1) Contexte patient 2) Synthèse 3) Recommandation intermédiaire "
            "4) Conduite du médecin 5) Références MCP 6) Avertissement légal.\n"
            f"Cas : {initial_case}\nSynthèse : {summary}\nInterim : {interim}\n"
            f"Médecin : {physician}\nMCP : {guidelines}"
        )
        response = llm.invoke([
            SystemMessage(content="Rapport en français, ton professionnel et prudent."),
            HumanMessage(content=prompt),
        ])
        report = response.content + DISCLAIMER
    else:
        qa = "\n".join(f"- Réponse {i+1} : {a}" for i, a in enumerate(answers))
        report = f"""# Rapport d'orientation clinique préliminaire

## 1. Contexte patient
{initial_case}

## 2. Anamnèse (5 questions)
{qa}

## 3. Synthèse clinique préliminaire
{summary}

## 4. Recommandation intermédiaire
{interim}

## 5. Conduite à tenir (médecin traitant)
{physician}

## 6. Orientations de référence (MCP)
{guidelines}
{DISCLAIMER}
"""

    return {"final_report": report, "next": "FINISH"}
