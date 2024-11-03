export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-primary">
      <div className="container">
        <a className="navbar-brand text-light fw-bolder" href="/">
          DividendSpot
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link text-light" href="/about">
                About
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link text-light"
                href="/companies"
                title="View all companies featured on DividendSpot"
              >
                Companies
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
