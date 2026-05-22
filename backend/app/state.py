from typing import Annotated, Literal
from langgraph.graph.message import add_messages
from typing_extensions import TypedDict


class MedicalState(TypedDict, total=False):
    messages: Annotated[list, add_messages]
    next: Literal["diagnostic_agent", "physician_review", "report_agent", "FINISH"]
    initial_case: str
    question_count: int
    patient_answers: list[str]
    current_question: str
    interim_care: str
    diagnostic_summary: str
    physician_treatment: str
    final_report: str
    symptom_category: str
    mcp_guidelines: str
