from fastapi import APIRouter
from services.meeting_analyzer import analyze_meeting

router = APIRouter()

@router.post("/analyze-transcript")
def analyze_transcript(data: dict):

    transcript = data["transcript"]

    result = analyze_meeting(transcript)

    return result