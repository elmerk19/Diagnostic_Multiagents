from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph
from backend.app.nodes.diagnostic_agent import diagnostic_agent_node
from backend.app.nodes.physician_review import physician_review_node
from backend.app.nodes.report_agent import report_agent_node
from backend.app.nodes.supervisor import route_supervisor, supervisor_node
from backend.app.state import MedicalState

_checkpointer = MemorySaver()
_compiled_graph = None


def build_graph():
    global _compiled_graph
    if _compiled_graph is not None:
        return _compiled_graph

    builder = StateGraph(MedicalState)
    builder.add_node("supervisor", supervisor_node)
    builder.add_node("diagnostic_agent", diagnostic_agent_node)
    builder.add_node("physician_review", physician_review_node)
    builder.add_node("report_agent", report_agent_node)

    builder.add_edge(START, "supervisor")
    builder.add_conditional_edges(
        "supervisor",
        route_supervisor,
        {
            "diagnostic_agent": "diagnostic_agent",
            "physician_review": "physician_review",
            "report_agent": "report_agent",
            "FINISH": END,
        },
    )
    builder.add_edge("diagnostic_agent", "supervisor")
    builder.add_edge("physician_review", "supervisor")
    builder.add_edge("report_agent", "supervisor")

    _compiled_graph = builder.compile(checkpointer=_checkpointer)
    return _compiled_graph


graph = build_graph()
