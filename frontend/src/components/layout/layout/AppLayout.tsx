import "./AppLayout.css";
import AvatarSidebar from "../../AvatarSidebar/AvatarSidebar";
import ChatPanel from "../../ChatPanel/ChatPanel";
import Footer from "../Footer/footer";
import Header from "../Header/Header";
import { useRef } from "react";

export default function AppLayout() {
  const avatarControlsRef = useRef<{
    startTalking: () => void;
    stopTalking: () => void;
  } | null>(null);

  return (
    <div className="appLayout">
      <header className="appHeader">
        <Header />
      </header>
      <aside className="sidebar">
        <AvatarSidebar
          onReady={(controls) => {
            console.log("Controls received in AppLayout")
            avatarControlsRef.current = controls;
          }}
        />
      </aside>

      <main className="main">
        <ChatPanel avatarControlsRef={avatarControlsRef} />
      </main>

      <footer className="footer">
        <Footer />
      </footer>
    </div>
  );
}
