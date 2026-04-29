import sqlite3
from datetime import UTC, datetime

conn = sqlite3.connect("chat_logs.db", check_same_thread=False)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_message TEXT,
    ai_response TEXT,
    intent TEXT,
    latency REAL,
    created_at TEXT
)
""")
conn.commit()
conn.close()


def log_chat(user_message, ai_response, intent, latency):
    conn = sqlite3.connect("chat_logs.db")
    try:
        with conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO logs (user_message, ai_response, intent, latency, created_at) VALUES (?, ?, ?, ?, ?)",
                (user_message, ai_response, intent, latency, datetime.now(UTC).isoformat())
            )
    finally:
        conn.close() 