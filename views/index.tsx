import Search from "../components/search";

export default function Home() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Hero Section */}
      <div
        className="py-5"
        style={{
          background: "linear-gradient(135deg, #4158D0 0%, #C850C0 100%)",
          minHeight: "500px",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 text-white">
              <h1 className="display-4 fw-bold mb-4">
                Easily Track Dividend Stocks and Their Payout Histories
              </h1>
              <p className="lead mb-4">
                Stay updated with simple dividend tracking and helpful insights
                to support your investment journey.
              </p>

              <Search />
            </div>

            <div className="col-lg-6">
              <div className="p-4 bg-white rounded-4 shadow-lg">
                <div className="d-flex align-items-center mb-4">
                  <div className="display-6 fw-bold me-3">
                    Top Dividend-Paying Companies
                  </div>
                </div>
                <div className="row row-cols-2 row-cols-md-3 g-3">
                  {[
                    { ticker: "cl", name: "Colgate-Palmolive" },
                    { ticker: "cvx", name: "Chevron Corporation" },
                    { ticker: "jnj", name: "Johnson & Johnson" },
                    { ticker: "ko", name: "The Coca-Cola Company" },
                    { ticker: "mmm", name: "3M Company" },
                    { ticker: "mo", name: "Altria Group" },
                    { ticker: "mrk", name: "Merck & Co., Inc." },
                    { ticker: "pep", name: "PepsiCo, Inc." },
                    { ticker: "pfe", name: "Pfizer Inc." },
                    { ticker: "pg", name: "Procter & Gamble" },
                    { ticker: "so", name: "Southern Company" },
                    { ticker: "t", name: "AT&T Inc." },
                    { ticker: "vz", name: "Verizon Communications" },
                    { ticker: "wmt", name: "Walmart Inc." },
                    { ticker: "xom", name: "ExxonMobil Corporation" },
                  ].map((symbol) => (
                    <div className="col">
                      <a
                        href={`/${symbol.ticker}`}
                        className="text-decoration-none"
                      >
                        <div className="card h-100 border-0 shadow-sm hover-lift">
                          <div className="card-body text-center p-2">
                            <img
                              src={`/public/imgs/company-logo/${symbol.ticker}.png`}
                              alt={symbol.name + " company logo"}
                              className="img-fluid mb-2"
                              style={{ width: "40px", height: "40px" }}
                            />
                            <h6 className="card-title text-dark mb-0 small">
                              {symbol.name}
                            </h6>
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-5">
        <div className="col-12 container my-4">
          <div className="row g-4">
            {[
              {
                icon: "😎",
                title: "Basic Data",
                description:
                  "Dividend payouts along with other basic info on companies. Don't worry about any clutter on your screen.",
              },
              {
                icon: "🔍",
                title: "Easy Research",
                description:
                  "Efficiently research and compare dividend-paying stocks across different sectors and industries.",
              },
              {
                icon: "📱",
                title: "Mobile Friendly",
                description:
                  "Access dividend information on any device with our responsive platform.",
              },
            ].map((feature, index) => (
              <div key={index} className="col-lg-4">
                <div className="card h-100 border-0 shadow-sm rounded-4">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="display-5 me-3">{feature.icon}</div>
                      <h3 className="h4 mb-0">{feature.title}</h3>
                    </div>
                    <p className="text-muted mb-0">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
