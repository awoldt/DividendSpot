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
          <a
            href="https://www.facebook.com/sharer/sharer.php?u=https://dividendspot.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/public/imgs/facebook-logo.svg" alt="Facebook logo" />
          </a>
          <a
            href="https://twitter.com/intent/tweet?text=Check%20out%20this%20site%20for%20dividend%20data!&url=https://dividendspot.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/public/imgs/twitter-x-logo.svg" alt="X logo" />
          </a>
        </div>
      </div>
    </footer>
  );
}
