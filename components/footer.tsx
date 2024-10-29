export default function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-4">
      <div className="container">
        <ul className="list-inline">
          <li className="list-inline-item">
            <a href="/privacy-policy" className="text-white">
              <b>Privacy Policy</b>
            </a>
          </li>
        </ul>
        <p className="small mt-3">
          The information provided on this website is for general informational
          purposes only and should not be construed as financial advice. Users
          are encouraged to conduct their own independent research and consult
          with a qualified financial professional before making any investment
          decisions.
        </p>
        <div>
          <a
            href="https://www.facebook.com/sharer/sharer.php?u=https://dividendspot.com"
            target="_blank"
            rel="noopener noreferrer"
            className="me-2"
          >
            <img
              src="/public/imgs/facebook-logo.svg"
              alt="Facebook logo"
              width="24"
              height="24"
            />
          </a>
          <a
            href="https://twitter.com/intent/tweet?text=Check%20out%20this%20site%20for%20dividend%20data!&url=https://dividendspot.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/public/imgs/twitter-x-logo.svg"
              alt="X logo"
              width="24"
              height="24"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
