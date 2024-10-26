export default function Home() {
  return (
    <div>
      <p class="welcome-message">
        👋 Welcome to DividendSpot! Stay updated with the latest dividend
        payouts and histories of top companies traded on the NYSE and NASDAQ
        markets.
      </p>

      {/* Main Content Section */}
      <section className="main-content">
        <h2>Explore Dividend Information for Leading Companies</h2>
        <p>
          Our platform provides comprehensive data on dividend payouts, upcoming
          dividends, and company histories, making it easier for you to track
          your investments.
        </p>

        <div className="dividends-summary">
          <h2>Why Track Dividends?</h2>
          <p>
            Dividends provide a reliable source of passive income for investors.
            With our platform, you can monitor the dividend histories and
            upcoming payouts of the companies you care about, ensuring you make
            informed investment decisions.
          </p>
        </div>

        {/* Popular Companies Section */}
        <h2>Popular Companies</h2>
        <div className="related-companies">
          <a href="/t">
            <div>
              <img src="/public/imgs/company-logo/T.png" alt="AT&T" />
              <span>AT&T Inc.</span>
            </div>
          </a>

          <a href="/cvx">
            <div>
              <img src="/public/imgs/company-logo/CVX.png" alt="Chevron" />
              <span>Chevron Corporation</span>
            </div>
          </a>

          <a href="/ko">
            <div>
              <img src="/public/imgs/company-logo/KO.png" alt="Coca-Cola" />
              <span>Coca-Cola Co.</span>
            </div>
          </a>

          <a href="/xom">
            <div>
              <img src="/public/imgs/company-logo/XOM.png" alt="Exxon Mobil" />
              <span>Exxon Mobil Corporation</span>
            </div>
          </a>

          <a href="/jnj">
            <div>
              <img
                src="/public/imgs/company-logo/JNJ.png"
                alt="Johnson & Johnson"
              />
              <span>Johnson & Johnson</span>
            </div>
          </a>

          <a href="/msft">
            <div>
              <img src="/public/imgs/company-logo/MSFT.png" alt="Microsoft" />
              <span>Microsoft Corporation</span>
            </div>
          </a>

          <a href="/pg">
            <div>
              <img
                src="/public/imgs/company-logo/PG.png"
                alt="Procter & Gamble"
              />
              <span>Procter & Gamble Co.</span>
            </div>
          </a>

          <a href="/pep">
            <div>
              <img src="/public/imgs/company-logo/PEP.png" alt="PepsiCo" />
              <span>PepsiCo, Inc.</span>
            </div>
          </a>

          <a href="/vz">
            <div>
              <img src="/public/imgs/company-logo/VZ.png" alt="Verizon" />
              <span>Verizon Communications Inc.</span>
            </div>
          </a>
        </div>
      </section>
    </div>
  );
}
