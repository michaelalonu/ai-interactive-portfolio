import os
import json, time
from groq import Groq
from dotenv import load_dotenv
from services.agent_service import build_agent_decision, build_agent_decision_from_intent
from services.memory_service import get_history, add_message
from services.tts_service import generate_tts
from services.logging_service import log_chat
from services.logger import get_logger

load_dotenv()
logger = get_logger(__name__)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

with open(os.path.join(BASE_DIR, "../data/system_prompt.txt")) as f:
    SYSTEM_PROMPT = f.read()

with open(os.path.join(BASE_DIR, "../data/profile.json")) as f:
    PROFILE = json.load(f)


def _format_arsenal(arsenal: dict) -> str:
    category_labels = {
        "languages": "Languages",
        "backend": "Backend",
        "frontend": "Frontend",
        "data_devops": "Data & DevOps",
        "cloud_realtime_ai": "Cloud, Realtime & AI",
    }
    lines = []

    for category, skills in arsenal.items():
        label = category_labels.get(category, category.replace("_", " ").title())
        lines.append(f"- {label}: {', '.join(skills)}")

    return "\n".join(lines)


def _format_projects(projects: list[dict]) -> str:
    formatted_projects = []

    for project in projects:
        highlights = "\n".join(
            f"  - {highlight}" for highlight in project.get("technical_highlights", [])
        )
        formatted_projects.append(
            "\n".join(
                [
                    f"Project: {project.get('name', 'Unknown Project')}",
                    f"Summary: {project.get('summary', '')}",
                    f"Impact: {project.get('impact', '')}",
                    f"Stack: {', '.join(project.get('stack', []))}",
                    "Technical Highlights:",
                    highlights or "  - No highlights provided.",
                ]
            )
        )

    return "\n\n".join(formatted_projects)


def build_context():
    identity = PROFILE.get("identity", {})
    technical_arsenal = PROFILE.get("technical_arsenal", {})
    flagship_projects = PROFILE.get("flagship_projects", [])
    soft_skills_pitch = PROFILE.get("soft_skills_pitch", {})

    return f"""
You are representing this professional profile:

HEADLINE IDENTITY:
Name: {identity.get('name', '')}
Role: {identity.get('role', '')}
Focus: {identity.get('focus', '')}
Location: {identity.get('location', '')}

TECHNICAL ARSENAL:
{_format_arsenal(technical_arsenal)}

FLAGSHIP PROJECTS:
{_format_projects(flagship_projects)}

WORKING STYLE:
Approach: {soft_skills_pitch.get('approach', '')}
Value Add: {soft_skills_pitch.get('value_add', '')}

Use achievements as evidence. Do not just list tools or repeat the profile verbatim.
"""

def build_messages(user_message: str, session_id: str, forced_intent: str | None = None):

    context = build_context()

    if forced_intent:
        agent_decision = build_agent_decision_from_intent(forced_intent)
    else:
        agent_decision = build_agent_decision(user_message)

    history = get_history(session_id)[-8:]
    messages = []
    # 🧠 system identity
    messages.append({
        "role": "system",
        "content": SYSTEM_PROMPT
    })
    # 🧾 profile context
    messages.append({
        "role": "system",
        "content": context
    })
    # 🔒 HARD RULES 
    messages.append({
        "role": "system",
        "content": agent_decision.style_instruction
    })
    # 🎯 BEHAVIOR (Leading the converstion)
    messages.append({
        "role": "system",
        "content": (
            f"You are in a {agent_decision.intent} conversation.\n"
            f"Guide the conversation forward naturally.\n"
            f"Example direction you can take: {agent_decision.follow_up}"
        )
    })

    messages.extend(history)

    messages.append({"role": "user", "content": user_message})
    

    return messages, agent_decision


def generate_response(user_message: str, session_id: str, forced_intent: str | None = None):
    messages, agent_decision = build_messages(user_message, session_id, forced_intent)
    start = time.time()
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.7,
        )
        raw_answer = completion.choices[0].message.content
    except Exception:
        logger.exception("Error calling Groq API")
        raw_answer = "I'm having a brief technical moment. Can you give me a minute or two and ask again? If this continues, please reach out to the administrator."
    final_answer = f"{raw_answer.strip()}"

    # Save conversation to memory
    add_message(session_id, "user", user_message)
    add_message(session_id, "assistant", final_answer)
    tts_url = None #in case TTS generation fails, not break the response (and atleast get the text)

    tts_url = generate_tts(final_answer)
    latency = time.time() - start

    log_chat(user_message, final_answer, agent_decision.intent, latency)
    if tts_url:
        logger.info("TTS generated successfully")
    else:
        logger.warning("TTS generation failed")
    logger.info(f"intent={agent_decision.intent} latency={latency:.2f}s")
    return {
        "message": final_answer,
        "intent": agent_decision.intent,
        "follow_up": agent_decision.follow_up,
        "tts_url": tts_url
    }
