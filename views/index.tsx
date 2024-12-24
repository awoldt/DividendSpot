export default function Home() {
  return (
    <div className="min-vh-100 d-flex flex-column">
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
                    { ticker: "CL", name: "Colgate-Palmolive" },
                    { ticker: "CVX", name: "Chevron Corporation" },
                    { ticker: "JNJ", name: "Johnson & Johnson" },
                    { ticker: "KO", name: "The Coca-Cola Company" },
                    { ticker: "MMM", name: "3M Company" },
                    { ticker: "MO", name: "Altria Group" },
                    { ticker: "MRK", name: "Merck & Co., Inc." },
                    { ticker: "PEP", name: "PepsiCo, Inc." },
                    { ticker: "PFE", name: "Pfizer Inc." },
                    { ticker: "PG", name: "Procter & Gamble" },
                    { ticker: "SO", name: "Southern Company" },
                    { ticker: "T", name: "AT&T Inc." },
                    { ticker: "VZ", name: "Verizon Communications" },
                    { ticker: "WMT", name: "Walmart Inc." },
                    { ticker: "XOM", name: "ExxonMobil Corporation" },
                  ].map((company) => (
                    <div className="col">
                      <a
                        href={`/${company.ticker}`}
                        className="text-decoration-none"
                      >
                        <div className="card h-100 border-0 shadow-sm hover-lift">
                          <div className="card-body text-center p-2">
                            <img
                              src={`/public/imgs/company-logo/${company.ticker}.png`}
                              alt={company.name + " logo"}
                              className="img-fluid mb-2"
                              style={{ width: "40px", height: "40px" }}
                            />
                            <span
                              className="card-title text-dark mb-0 small"
                              style={{ display: "block" }}
                            >
                              <b>{company.name}</b>
                            </span>
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

      {/* Features Grid */}
      <div className="col-12 container my-4">
        <div className="row g-4">
          {[
            {
              icon: "📊",
              title: "Comprehensive Data",
              description:
                "Access detailed dividend histories, payment schedules, and yield information for hundreds of companies.",
            },
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
            <div key={index} className="col-md-6">
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
    </div>
  );
}
