from fileinput import filename
from elevenlabs.client import ElevenLabs
from openai import OpenAI
import uuid
import os
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
AUDIO_DIR = os.path.join(BASE_DIR, "static", "audio")
os.makedirs(AUDIO_DIR, exist_ok=True)
el_client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"),)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def build_audio_url(filename: str) -> str:
    return f"{BASE_URL}/static/audio/{filename}"

def generate_tts(text: str) -> str | None:
    filename = f"{uuid.uuid4()}.mp3"
    filepath = os.path.join(AUDIO_DIR, filename)

    try:
        audio = el_client.text_to_speech.convert(
            text=text,
            voice_id="JBFqnCBsd6RMkjVDRZzb",
            model_id="eleven_flash_v2_5", 
            output_format="mp3_44100_128",
        )

        with open(filepath, "wb") as f:
            for chunk in audio:
                if chunk:
                    f.write(chunk)
        print(f"ElevenLabs TTS generated: {build_audio_url(filename)}")
        return build_audio_url(filename)
    except Exception as e:
        print("ElevenLabs failed:", e)

    try:
        response = client.audio.speech.create(
            model="gpt-4o-mini-tts", # can test tts-1 or tts-1-hd models for more quality. 
            voice="alloy",
            input=text
        )

        response.write_to_file(filepath)
        return build_audio_url(filename)
    except Exception as e: 
        print(f"Error generation OpenAI TTS: {e}")
        return None    
