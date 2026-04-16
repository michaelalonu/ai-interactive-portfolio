import axios from "axios";
import type { ChatResponse } from "../types/chat";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export async function sendMessage(
  message: string,
  sessionId: string
): Promise<ChatResponse> {
  const res = await api.post("/chat", {
    message,
    session_id: sessionId,
  });

  return res.data;
}