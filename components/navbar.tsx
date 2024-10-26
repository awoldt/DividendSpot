export default function Navbar() {
  return (
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-logo">
          <a href="/">
            <span>DividendSpot</span>
          </a>
        </div>

        <input type="checkbox" id="menu-toggle" class="menu-toggle" />
        <label for="menu-toggle" class="hamburger">
          ☰
        </label>

        <ul class="navbar-links">
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
