export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <a href="/">
            {" "}
            <img src="/logo.png" alt="Dividend Tracker Logo" />
            <h1>Dividend Tracker</h1>
          </a>
        </div>
        <ul className="navbar-links">
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/companies" title="View all companies featured on site">
              Companies
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
