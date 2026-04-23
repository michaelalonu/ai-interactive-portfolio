import "./Header.css";
export default function Header() {
  return (
    <div className="Header">
      <span className="Header__title">AI Avatar Interview Assistant</span>
      <div className="Header__status">
        <span className="Header__dot" />
        Online
      </div>
    </div>
  );
}
