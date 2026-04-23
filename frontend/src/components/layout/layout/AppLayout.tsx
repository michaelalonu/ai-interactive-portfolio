import "./AppLayout.css";
import AvatarSidebar from "../../AvatarSidebar/AvatarSidebar";
import ChatPanel from "../../ChatPanel/ChatPanel";
import Footer from "../Footer/footer";
import Header from "../Header/Header";

export default function AppLayout() {
  return (
    <div className="appLayout">
      <header className="appHeader">
        <Header />
      </header>
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
