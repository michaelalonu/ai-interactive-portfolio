import axios from "axios";
import type { ChatResponse } from "../types/chat";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

export async function sendMessage(message: string, sessionId: string): Promise<ChatResponse> {
  const res = await api.post("/chat", {
    message,
    session_id: sessionId,
  });

  return res.data;
}