import "./ChatBox.css";
import { useState, useEffect, useRef } from "react";
import { sendMessage } from "../../services/api";
import type { Message } from "../../types/chat";
import Avatar from "../Avatar/Avatar";

const sessionId = "test-session-123";

function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const avatarControlsRef = useRef<{
    startTalking: () => void;
    stopTalking: () => void;
  } | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function playAudio(ttsUrl: string) {
    const audio = new Audio(ttsUrl);

    avatarControlsRef.current?.startTalking();
    audio.play();

    audio.onended = () => {
      avatarControlsRef.current?.stopTalking();
    };
    
    audio.onerror = () => {
      avatarControlsRef.current?.stopTalking();
    };
  }
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

      setMessages((prev) => [...prev, botMessage]);
      if (res.tts_url) {
        playAudio(`http://localhost:8000${res.tts_url}`);
      }
    } catch (err) {
      console.error(err);
      setIsTyping(false);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error occurred" },
      ]);
      playAudio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg");
    }

    setLoading(false);
  };

  return (
    <div className="ChatBox">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`messageRow ${msg.role}`}>
            <div className={`messageBubble ${msg.role}`}>{msg.content}</div>
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
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />

        <button className="button" onClick={handleSend} disabled={loading}>
          {loading ? "..." : "Send"}
        </button>

      </div>
        <Avatar
          onReady={(controls) => {
            avatarControlsRef.current = controls;
          }} //the child avatar returns the controls to start and stop talking, which are stored in a ref to be used when playing audio
        />
    </div>
  );
}

export default ChatBox;
