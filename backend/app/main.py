from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from services.llm_service import generate_response
from dotenv import load_dotenv
import os

#uvicorn main:app --reload

app = FastAPI()
load_dotenv()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

class ChatRequest(BaseModel):
    message: str
    session_id: str

@app.post("/chat")
async def chat(req: ChatRequest):
    response = generate_response(
        req.message,
        req.session_id
    )

    return response


@app.get("/")
def root():
    return {"status": "running"}
