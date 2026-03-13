from fastapi import APIRouter, UploadFile
from services.speech_to_text import convert_audio_to_text

router = APIRouter()

@router.post("/process-audio")
async def process_audio(file: UploadFile):

    transcript = convert_audio_to_text(file)

    return {
        "transcript": transcript
    }