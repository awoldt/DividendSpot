export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <ul>
            <li>
              <a href="/privacy-policy">Privacy Policy</a>
            </li>
          </ul>
        </div>
        <div className="footer-social">
          <a href="https://www.facebook.com">
            <img src="/facebook-icon.png" alt="Facebook" />
          </a>
          <a href="https://www.twitter.com">
            <img src="/twitter-icon.png" alt="Twitter" />
          </a>
          <a href="https://www.linkedin.com">
            <img src="/linkedin-icon.png" alt="LinkedIn" />
          </a>
        </div>
        <div className="footer-copyright">
          <p>&copy; 2024 Dividend Tracker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
