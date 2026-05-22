from langchain_core.tools import tool

@tool
def ask_patient(question: str) -> str:
    """Pose une question au patient et enregistre la formulation pour le workflow."""
    return f"Question posée au patient : {question}"

PATIENT_QUESTION_TEMPLATES = [
    "Depuis combien de temps ressentez-vous ces symptômes ?",
    "Quelle est l'intensité de votre inconfort (légère, modérée, intense) ?",
    "Avez-vous de la fièvre, des frissons ou des sueurs nocturnes ?",
    "Prenez-vous actuellement des médicaments ou avez-vous des antécédents importants ?",
    "Y a-t-il des signes d'aggravation (difficulté respiratoire, douleur thoracique, confusion) ?",
]

def build_question(initial_case: str, index: int) -> str:
    base = PATIENT_QUESTION_TEMPLATES[index]
    if initial_case.strip():
        return f"{base}\n(Contexte initial : {initial_case[:200]})"
    return base
