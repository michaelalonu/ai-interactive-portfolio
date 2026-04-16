import "./ChatBox.css";
import { useState, useEffect, useRef } from "react";
import { sendMessage } from "../services/api";
import type { Message } from "../types/chat";

const sessionId = "test-session-123";

function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input || loading) return;
    setLoading(true);
    setIsTyping(true);

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await sendMessage(userMessage.content, sessionId);
      setIsTyping(false);

      const botMessage: Message = {
        role: "assistant",
        content: res.message,
      };

      setMessages(prev => [...prev, botMessage]);

    } 
    catch (err) {
      console.error(err);
      setIsTyping(false);

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Error occurred" }
      ]);
    }

    setLoading(false);

  };

  return (
    <div className="ChatBox">

      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`messageRow ${msg.role}`}>
            <div className={`messageBubble ${msg.role}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="messageRow assistant">
            <div className="messageBubble assistant">Typing...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="inputRow">
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSend() }}
        />

        <button
          className="button"
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>

    </div>
  );
}

export default ChatBox;
