export type Role = "user" | "assistant";

export interface Message {
  role: Role;
  content: string;
}

export interface ChatResponse {
  message: string;
  intent: string;
  follow_up?: string;
}