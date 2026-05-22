from langchain_core.tools import tool


@tool
def recommend_interim_care(symptom_category: str, has_red_flags: bool) -> str:
    """Propose une recommandation intermédiaire prudente (repos, hydratation, surveillance)."""
    if has_red_flags:
        return (
            "Recommandation intermédiaire : consulter rapidement un professionnel de santé. "
            "En attendant : repos, hydratation, surveillance des signes vitaux. "
            "En cas d'aggravation (dyspnée, douleur thoracique, confusion), appelez les urgences."
        )
    if symptom_category == "respiratory":
        return (
            "Recommandation intermédiaire : repos, hydratation abondante, surveillance de la température. "
            "Consultation rapide si fièvre persistante > 3 jours ou essoufflement."
        )
    return (
        "Recommandation intermédiaire : repos, hydratation, surveillance des symptômes. "
        "Consultation en cas d'aggravation ou d'apparition de signes inquiétants."
    )
