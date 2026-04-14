from fastapi import FastAPI
from pydantic import BaseModel
from services.llm_service import generate_response

#uvicorn main:app --reload

app = FastAPI()


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
