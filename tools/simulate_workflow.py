#!/usr/bin/env python3
import uuid
import json
import time
import sys
from pathlib import Path

# Ensure project root is on sys.path so 'backend' package can be imported
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from backend.app.graph import build_graph
from backend.app.api import _config, _merge_state, _snapshot
from langgraph.types import Command


OUT = Path("./screenshots")
OUT.mkdir(exist_ok=True)


def snapshot_to_html(snaps, out_path: Path):
    parts = [
        "<html><head><meta charset=\"utf-8\"><title>Simulation trace</title></head><body>",
        "<h1>Simulation trace — Diagnostic_Multiagents</h1>",
    ]
    for i, s in enumerate(snaps, 1):
        parts.append(f"<section style='margin-bottom:24px;padding:12px;border:1px solid #ddd;'>")
        parts.append(f"<h2>Step {i} — status: {s.get('status')}</h2>")
        parts.append("<pre style='white-space:pre-wrap;'>")
        parts.append(json.dumps(s, ensure_ascii=False, indent=2))
        parts.append("</pre>")
        parts.append("</section>")
    parts.append("</body></html>")
    out_path.write_text("\n".join(parts), encoding="utf-8")


def run_simulation():
    graph = build_graph()
    thread_id = str(uuid.uuid4())
    initial_state = {
        "initial_case": "Toux sèche depuis 3 jours, légère fièvre.",
        "question_count": 0,
        "patient_answers": [],
        "next": "diagnostic_agent",
    }

    print("Invoking initial state")
    graph.invoke(initial_state, _config(thread_id))
    snaps = []

    # loop: get state, if waiting patient -> send answer, if awaiting physician -> send treatment
    for step in range(40):
        values = _merge_state(graph, thread_id)
        snap = _snapshot(values)
        snaps.append(snap)
        status = snap.get("status")
        print(f"Step {step+1} status={status}")
        if status in ("in_progress", "awaiting_patient"):
            ans = f"Réponse simulée {len(values.get('patient_answers', [])) + 1}"
            graph.invoke(Command(resume=ans), _config(thread_id))
            time.sleep(0.2)
            continue
        if status == "awaiting_physician":
            treatment = "Conseil médical simulé : surveillance et paracétamol si fièvre."
            graph.invoke(Command(resume={"physician_treatment": treatment}), _config(thread_id))
            time.sleep(0.2)
            continue
        if status == "completed":
            break

    # final snapshot
    final = _merge_state(graph, thread_id)
    snaps.append(final)

    # save JSON and HTML
    OUT.joinpath("simulation_trace.json").write_text(json.dumps(snaps, ensure_ascii=False, indent=2), encoding="utf-8")
    snapshot_to_html(snaps, OUT.joinpath("simulation_trace.html"))
    print("Simulation complete. Outputs:", OUT)


if __name__ == "__main__":
    run_simulation()
