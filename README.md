# AI Interactive Portfolio

An interactive portfolio experience powered by a conversational AI agent that guides visitors through work, skills, and next steps.

## Demo

Live deployment: https://michael-ai-interactive-portfolio.vercel.app/
![Portfolio Screenshot](.frontend/src/assets/Portfolio.png)

## Key Features

- Conversational agent that leads the interaction with intent, style, and follow-up logic
- Structured responses designed around answer, value, and direction
- Session-based memory for contextual conversations
- Text-to-Speech generation with browser audio playback
- Interrupt-aware chat UI for responsive voice interactions
- SQLite and runtime logging for conversation visibility

## Tech Stack

**Frontend**

- React
- TypeScript
- Vite
- Axios

**Backend**

- FastAPI
- Python
- SQLite
- Uvicorn

**AI**

- Groq LLM API
- Modular agent layer
- ElevenLabs TTS
- OpenAI TTS fallback

**Infrastructure**

- Render for backend deployment
- Vercel for frontend deployment

## Architecture Overview

The application is split into a React frontend and a FastAPI backend. The frontend manages the chat experience, audio playback, and interrupt behavior. The backend handles message processing through modular services:

- **Agent**: interprets intent, applies response style, and decides the next conversational direction
- **LLM**: generates structured responses through Groq
- **Memory**: maintains session context across turns
- **TTS**: creates playable audio using ElevenLabs with OpenAI as a fallback provider

## Project Structure

```text
AI_Interactive_Portfolio/
|-- backend/
|   |-- app/
|   |   |-- main.py
|   |   |-- services/
|   |   |   |-- agent_service.py
|   |   |   |-- llm_service.py
|   |   |   |-- memory_service.py
|   |   |   `-- tts_service.py
|   |   `-- requirements.txt
|   `-- static/
|       `-- audio/
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- services/
|   |   `-- types/
|   |-- package.json
|   `-- vite.config.ts
`-- README.md
```

## Getting Started

### Clone the Repository

```bash
git clone <repository-url>
cd AI_Interactive_Portfolio
```

### Backend Setup

```bash
cd backend/app
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

On Windows PowerShell:

```powershell
cd backend/app
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

The backend runs on `http://localhost:8000` by default.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on the local Vite URL shown in the terminal.

## Environment Variables

Create a `.env` file in `backend`:

```env
GROQ_API_KEY=your_groq_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
OPENAI_API_KEY=your_openai_api_key
BASE_URL=http://localhost:8000
CORS_ORIGINS=http://localhost:5173
```

Create a `.env` file in `frontend`:

```env
VITE_API_URL=http://localhost:8000
```

## Deployment

The backend is deployed on Render and the frontend is deployed on Vercel.

## Future Improvements

- Add RAG for portfolio-specific document retrieval
- Expand analytics for conversation quality and user intent
- Improve response latency with streaming and audio caching
- Add admin tools for prompt, content, and session review
