import "./ChatPanel.css";
import { useState, useEffect, useRef } from "react";
import { sendMessage } from "../../services/api";
import type { Message } from "../../types/chat";

const sessionId = "test-session-123";
const starterPrompts = [
  "🚀 Show flagship projects",
  "🧠 Explain the AI architecture",
  "⚙️ Backend deep dive",
  "🎤 How does the voice system work?",
  "📈 What problems did you solve?",
  "👤 Tell me about Michael",
];
type Props = {
  avatarControlsRef: React.RefObject<{
    startTalking: () => void;
    stopTalking: () => void;
  } | null>;
};

function ChatPanel({ avatarControlsRef }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function stopCurrentAudio() {
    if (audioRef.current) {
      audioRef.current.pause(); // stop audio
      audioRef.current.currentTime = 0; // reset play to start(seconds)
      audioRef.current = null;
    }

    avatarControlsRef.current?.stopTalking();
  }
  function playAudio(ttsUrl: string) {
    stopCurrentAudio();
    const audio = new Audio(ttsUrl);
    audioRef.current = audio;

    avatarControlsRef.current?.startTalking();

    audio.play().catch((err) => {
      console.error("Audio play failed:", err);
      avatarControlsRef.current?.stopTalking();
    });

    audio.onended = () => {
      avatarControlsRef.current?.stopTalking();
    };

    audio.onerror = (err) => {
      console.error("Audio play failed:", err);
      avatarControlsRef.current?.stopTalking();
    };
  }
  const handleSend = async (messageText?: string) => {
    console.log("Controls in ChatPanel:", avatarControlsRef.current);
    const text = messageText || input;
    if (!text || loading) return;
    stopCurrentAudio();
    setLoading(true);
    setTimeout(() => {
      setIsTyping(true);
    }, 250);

    const userMessage: Message = {
      role: "user",
      content: text,
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
        playAudio(res.tts_url);
      }
    } catch (err) {
      console.error(err);
      setIsTyping(false);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error occurred" },
      ]);
      playAudio(
        "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg",
      );
    }

    setLoading(false);
  };

  return (
    <div className="ChatPanel">
      <div className="messages">
        {messages.length === 0 && (
          <div className="welcomeSection">
            <h2>AI Interactive Portfolio</h2>

            <p className="welcomeText">
              Explore projects, backend systems, AI architecture, and technical
              decisions through conversation.
            </p>

            <div className="starterPrompts">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  className="promptChip"
                  onClick={() => handleSend(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`messageRow ${msg.role}`}>
            <div className={`messageBubble ${msg.role}`}>{msg.content}</div>
          </div>
        ))}
        {isTyping && (
          <div className="messageRow assistant">
            <div className="messageBubble assistant">
              <img src="/businessman_ponder_question.gif" alt="Thinking" />
            </div>
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
    </div>
  );
}

export default ChatPanel;
