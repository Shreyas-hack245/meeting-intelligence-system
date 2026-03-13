from ai_analysis.sarvam_client import analyze_with_llm
from services.task_structurer import structure_tasks


def analyze_meeting(transcript):

    ai_result = analyze_with_llm(transcript)

    tasks = structure_tasks(ai_result["tasks"], transcript)

    ai_result["tasks"] = tasks

    return ai_result