from pydantic import BaseModel
from typing import List


class Task(BaseModel):
    title: str
    description: str
    team: str
    priority: str
    status: str


class MeetingAnalysis(BaseModel):
    meeting_summary: str
    discussion_points: List[str]
    decisions: List[str]
    tasks: List[Task]