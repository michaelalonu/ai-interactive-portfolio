import "./AppLayout.css";
import AvatarSidebar from "../../AvatarSidebar/AvatarSidebar";
import ChatPanel from "../../ChatPanel/ChatPanel";
import Footer from "../Footer/footer";

export default function AppLayout() {
  return (
    <div className="appLayout">
      <aside className="sidebar">
        <AvatarSidebar />
      </aside>

      <main className="main">
        <ChatPanel />
      </main>

      <footer className="footer">
        <Footer />
      </footer>
    </div>
  );
}
