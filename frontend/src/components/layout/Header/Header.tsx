import "./Header.css";
export default function Header() {
  return (
    <div className="Header">
      <div className="Header__identity">
        <span className="Header__title">Michael Uzan</span>
        <p className="Header__subtitle">
          Backend Developer • AI Systems • FastAPI &amp; React
        </p>
      </div>

      <nav className="Header__links" aria-label="Profile links">
        <a
          href="https://github.com/MichaelAlonU"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/michael-uzan"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
        <a href="/" aria-current="page">
          Portfolio
        </a>
      </nav>
    </div>
  );
}
