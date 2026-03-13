from fastapi import FastAPI
from routes.transcript_routes import router as transcript_router
from routes.audio_routes import router as audio_router
from routes.trello_routes import router as trello_router

app = FastAPI(title="AI Meeting Intelligence System")

app.include_router(transcript_router)
app.include_router(audio_router)
app.include_router(trello_router)


@app.get("/")
def home():
    return {"message": "Backend Running Successfully"}