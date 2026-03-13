def detect_priority(transcript):

    words = ["urgent", "critical", "before release"]

    for w in words:
        if w in transcript.lower():
            return "High"

    return "Medium"


def detect_team(text):

    text = text.lower()

    if "ui" in text:
        return "Frontend"

    if "api" in text:
        return "Backend"

    if "database" in text:
        return "Data"

    return "General"


def structure_tasks(tasks, transcript):

    priority = detect_priority(transcript)

    structured = []

    for task in tasks:

        team = detect_team(task["title"])

        structured.append({
            "title": task["title"],
            "description": task["description"],
            "team": team,
            "priority": priority,
            "status": "Pending"
        })

    return structured