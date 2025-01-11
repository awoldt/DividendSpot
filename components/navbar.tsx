export default function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{
        background: "linear-gradient(135deg, #4158D0 0%, #C850C0 100%)",
      }}
    >
      <div className="container">
        <a className="navbar-brand fw-bold" href="/">
          DividendSpot
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="/about">
                About
              </a>
            </li>
       
            <li className="nav-item">
              <a
                className="nav-link"
                href="/discover"
                title="Discover stocks paying dividends"
              >
                Stocks
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
