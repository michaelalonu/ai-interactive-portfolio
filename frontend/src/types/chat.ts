export type Role = "user" | "assistant";

export interface Message {
  role: Role;
  content: string;
}

export interface ChatResponse {
  tts_url: string | null;
  message: string;
  intent: string;
  follow_up?: string;
}