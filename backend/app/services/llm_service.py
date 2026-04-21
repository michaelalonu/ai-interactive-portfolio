import os
import json
from groq import Groq
from dotenv import load_dotenv
from services.agent_service import build_agent_decision, build_agent_decision_from_intent
from services.memory_service import get_history, add_message
from services.tts_service import generate_tts

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

with open(os.path.join(BASE_DIR, "../data/system_prompt.txt")) as f:
    SYSTEM_PROMPT = f.read()

with open(os.path.join(BASE_DIR, "../data/profile.json")) as f:
    PROFILE = json.load(f)


def build_context():
    return f"""
Profile:
Name: {PROFILE['name']}
Role: {PROFILE['role']}

Skills:
{', '.join(PROFILE['skills'])}

Projects:
{json.dumps(PROFILE['projects'], indent=2)}
"""

def build_messages(user_message: str, session_id: str, forced_intent: str | None = None):

    context = build_context()

    if forced_intent:
        agent_decision = build_agent_decision_from_intent(forced_intent)
    else:
        agent_decision = build_agent_decision(user_message)

    history = get_history(session_id)
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "system", "content": context},
        {
            "role": "system",
            "content": (
                f"Detected intent: {agent_decision.intent}\n"
                f"Response style: {agent_decision.style_instruction}\n"
                f"Suggest a natural follow-up question when appropriate. "
                f"A good example is: {agent_decision.follow_up}"                
            ),
        },
    ]
    messages.extend(history)

    messages.append({"role": "user", "content": user_message})
    

    return messages, agent_decision


def generate_response(user_message: str, session_id: str, forced_intent: str | None = None):
    messages, agent_decision = build_messages(user_message, session_id, forced_intent)

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=0.7,
    )

    answer = completion.choices[0].message.content

    # Save conversation to memory
    add_message(session_id, "user", user_message)
    add_message(session_id, "assistant", answer)
    tts_url = None #in case TTS generation fails, not break the response (and atleast get the text)

    tts_url = generate_tts(answer)

    return {
        "message": answer,
        "intent": agent_decision.intent,
        "follow_up": agent_decision.follow_up,
        "tts_url": tts_url
    }
