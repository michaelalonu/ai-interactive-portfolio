from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from app.services.llm_service import generate_response
from app.services.logger import get_logger
from dotenv import load_dotenv
import os

# from backend dir, uvicorn main:app --reload

app = FastAPI()
load_dotenv()
logger = get_logger(__name__)

origins = os.getenv("CORS_ORIGINS", "").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="../static"), name="static")

class ChatRequest(BaseModel):
    message: str
    session_id: str

@app.post("/chat")
async def chat(req: ChatRequest):
    logger.info(f"[{req.session_id}] Incoming message: {req.message}")
    response = generate_response(
        req.message,
        req.session_id
    )

    return response


@app.get("/")
def root():
    return {"status": "running"}
