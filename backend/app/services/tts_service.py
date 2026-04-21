from elevenlabs.client import ElevenLabs
from openai import OpenAI
import uuid
import os
from dotenv import load_dotenv

load_dotenv()
print("TTS service initialized")   #debug, remove ..

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
AUDIO_DIR = os.path.join(BASE_DIR, "static", "audio")
os.makedirs(AUDIO_DIR, exist_ok=True)

def generate_tts(text: str) -> str | None:
    filename = f"{uuid.uuid4()}.mp3"
    filepath = os.path.join(AUDIO_DIR, filename)
    el_client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"),)
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    try:
        audio = el_client.text_to_speech.convert(
            text=text,
            voice_id="JBFqnCBsd6RMkjVDRZzb", # "George" - browse voices at elevenlabs.io/app/voice-library
            #model_id="eleven_v3", higher latency.
            model_id="eleven_flash_v2_5", 
            output_format="mp3_44100_128",
        )

        with open(filepath, "wb") as f:
            for chunk in audio:
                if chunk:
                    f.write(chunk)
        return f"/static/audio/{filename}"

    except Exception as e:
        print("ElevenLabs failed:", e)

    try:
        response = client.audio.speech.create(
            model="gpt-4o-mini-tts", # can test tts-1 or tts-1-hd models for more quality. 
            voice="alloy",
            input=text
        )

        #response.stream_to_file(filepath)
        response.write_to_file(filepath)
        return f"/static/audio/{filename}"
    except Exception as e: 
        print(f"Error generation OpenAI TTS: {e}")
        return None    
