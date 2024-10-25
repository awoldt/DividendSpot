export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <a href="/">
            {" "}
            <img src="/logo.png" alt="DividendSpot Logo" />
            <span>DividendSpot</span>
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
