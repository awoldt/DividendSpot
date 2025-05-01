const INDUSTRY_DESCRIPTIONS = {
  Technology:
    "Leading tech companies known for innovation and growth, increasingly embracing dividend payments alongside their expansion.",
  "Consumer Staples":
    "Essential consumer goods companies with historically stable dividends and defensive business models.",
  Energy:
    "Major energy corporations with traditionally high dividend yields, supported by global energy demand.",
  Healthcare:
    "Healthcare leaders offering steady dividends backed by essential medical products and services.",
  Financials:
    "Financial institutions with regulated dividend policies and strong capital return programs.",
  Utilities:
    "Stable utility companies known for reliable dividend payments supported by regulated revenue streams.",
  Telecommunications:
    "Telecom giants with substantial infrastructure and steady cash flows supporting dividend payments.",
  Industrial:
    "Diversified industrial companies with long histories of dividend payments and global operations.",
  "Real Estate":
    "Real Estate Investment Trusts (REITs) required to distribute most of their taxable income to shareholders.",
};

const INDUSTRIES = [
  {
    name: "Technology",
    stocks: ["AAPL", "MSFT", "INTC", "TXN", "ADP"],
  },
  {
    name: "Consumer Staples",
    stocks: ["KO", "PEP", "PG", "CL", "WMT"],
  },
  {
    name: "Energy",
    stocks: ["XOM", "CVX", "BP", "PSX", "ENB"],
  },
  {
    name: "Healthcare",
    stocks: ["JNJ", "PFE", "MRK", "ABBV", "AMGN"],
  },
  {
    name: "Financials",
    stocks: ["JPM", "BAC", "WFC", "C", "MS"],
  },
  {
    name: "Utilities",
    stocks: ["SO", "D", "NEE", "DUK", "AEP"],
  },
  {
    name: "Telecommunications",
    stocks: ["T", "VZ", "TMUS"],
  },
  {
    name: "Industrial",
    stocks: ["MMM", "CAT", "BA", "LMT", "GE"],
  },
  {
    name: "Real Estate",
    stocks: ["O", "SPG", "PLD", "AMT", "VICI"],
  },
];

export default function DiscoverPage() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Header */}
      <div
        className="py-5"
        style={{
          background: "linear-gradient(135deg, #4158D0 0%, #C850C0 100%)",
        }}
      >
        <div className="container text-center text-white">
          <h1 className="display-4 fw-bold mb-4">Discover Dividend Stocks</h1>
          <p className="lead mb-2">
            Explore dividend-paying companies across major industries.
          </p>
          <p className="lead fs-5 mb-0">
            Find potential income-generating investments in sectors known for
            returning value to shareholders.
          </p>
        </div>
      </div>

      {/* Industries Grid */}
      <div className="container py-5">
        <div className="row g-4">
          {INDUSTRIES.map((industry) => (
            <div className="col-12" key={industry.name}>
              <div className="card shadow-sm rounded-4 hover-lift">
                <div className="card-body p-4">
                  {/* Industry Text Above Images */}
                  <h2 className="h3 mb-3">{industry.name}</h2>
                  <p className="text-muted mb-4">
                    {/* @ts-ignore */}
                    {INDUSTRY_DESCRIPTIONS[industry.name]}
                  </p>
                  {/* Stock Images Grid */}
                  <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
                    {industry.stocks.map((symbol) => (
                      <div className="col" key={symbol}>
                        <a
                          href={`/${symbol.toLowerCase()}`}
                          className="text-decoration-none"
                        >
                          <div className="card h-100 border-0 bg-light">
                            <div className="card-body text-center p-3">
                              <img
                                src={`/public/imgs/company-logo/${symbol}.png`}
                                alt={`${symbol} logo`}
                                className="img-fluid mb-2"
                                style={{ width: "48px", height: "48px" }}
                              />
                              <h6 className="card-title mb-0 text-dark">
                                {symbol}
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
          ))}
        </div>
      </div>
    </div>
  );
}
