import uuid
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langgraph.types import Command
from pydantic import BaseModel, Field

from backend.app.graph import build_graph

app = FastAPI(
    title="Diagnostic Médical Multi-Agents",
    description="API d'orientation clinique préliminaire (exercice académique)",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class StartConsultationRequest(BaseModel):
    initial_case: str = Field(..., min_length=3)


class ResumeConsultationRequest(BaseModel):
    thread_id: str
    patient_answer: str | None = None
    physician_treatment: str | None = None


def _config(thread_id: str) -> dict:
    return {"configurable": {"thread_id": thread_id}}


def _extract_interrupt_payloads(snap) -> list[dict]:
    payloads = []
    for task in snap.tasks or []:
        for intr in getattr(task, "interrupts", []) or []:
            value = intr.value if hasattr(intr, "value") else intr
            if isinstance(value, dict):
                payloads.append(value)
            else:
                payloads.append({"raw": value})
    return payloads


def _status_from_state(values: dict, interrupts: list) -> str:
    if values.get("final_report"):
        return "completed"
    if interrupts:
        if interrupts[0].get("type") == "physician_review":
            return "awaiting_physician"
        return "awaiting_patient"
    if values.get("diagnostic_summary") and not values.get("physician_treatment"):
        return "awaiting_physician"
    return "in_progress"


def _merge_state(graph, thread_id: str) -> dict:
    snap = graph.get_state(_config(thread_id))
    values = dict(snap.values) if snap.values else {}
    values["thread_id"] = thread_id
    payloads = _extract_interrupt_payloads(snap)
    if payloads:
        values["__interrupt_payloads"] = payloads
    return values


def _snapshot(state: dict) -> dict:
    interrupts = state.get("__interrupt_payloads", [])
    current_question = state.get("current_question")
    interrupt_type = None
    if interrupts:
        first = interrupts[0]
        interrupt_type = first.get("type")
        current_question = first.get("question", current_question)
    return {
        "thread_id": state.get("thread_id"),
        "next": state.get("next"),
        "question_count": state.get("question_count", 0),
        "current_question": current_question,
        "diagnostic_summary": state.get("diagnostic_summary"),
        "interim_care": state.get("interim_care"),
        "physician_treatment": state.get("physician_treatment"),
        "final_report": state.get("final_report"),
        "interrupts": interrupts,
        "interrupt_type": interrupt_type,
        "status": _status_from_state(state, interrupts),
    }


@app.post("/consultation/start")
def start_consultation(body: StartConsultationRequest):
    graph = build_graph()
    thread_id = str(uuid.uuid4())
    initial_state = {
        "initial_case": body.initial_case,
        "question_count": 0,
        "patient_answers": [],
        "next": "diagnostic_agent",
    }
    graph.invoke(initial_state, _config(thread_id))
    values = _merge_state(graph, thread_id)
    return {"thread_id": thread_id, **_snapshot(values)}


@app.post("/consultation/resume")
def resume_consultation(body: ResumeConsultationRequest):
    graph = build_graph()
    snap = graph.get_state(_config(body.thread_id))
    if not snap.values and not snap.tasks:
        raise HTTPException(status_code=404, detail="Consultation introuvable")

    if body.physician_treatment:
        resume_value = {"physician_treatment": body.physician_treatment}
    elif body.patient_answer is not None:
        resume_value = body.patient_answer
    else:
        raise HTTPException(status_code=400, detail="Fournir patient_answer ou physician_treatment")

    graph.invoke(Command(resume=resume_value), _config(body.thread_id))
    values = _merge_state(graph, body.thread_id)
    return {"thread_id": body.thread_id, **_snapshot(values)}


@app.get("/consultation/{thread_id}")
def get_consultation(thread_id: str):
    graph = build_graph()
    values = _merge_state(graph, thread_id)
    if not values.get("initial_case") and not values.get("final_report"):
        raise HTTPException(status_code=404, detail="Consultation introuvable")
    return _snapshot(values)


@app.get("/consultation/{thread_id}/report")
def get_report(thread_id: str):
    graph = build_graph()
    values = _merge_state(graph, thread_id)
    report = values.get("final_report")
    if not report:
        raise HTTPException(status_code=404, detail="Rapport non encore disponible")
    return {"thread_id": thread_id, "final_report": report}


@app.get("/health")
def health():
    return {"status": "ok"}
