export default function About() {
  return (
    <>
      {/* Header */}
      <div
        className="py-5"
        style={{
          background: "linear-gradient(135deg, #4158D0 0%, #C850C0 100%)",
        }}
      >
        <div className="container text-center text-white">
          <h1 className="display-4 fw-bold mb-4">About</h1>
          <p className="lead mb-0">
            We're pretty obsessed with just one thing: Stock Dividends.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row g-4">
          {/* Mission Section */}
          <div className="col-12 mb-4">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4 p-md-5">
                <h2 className="h3 mb-4">Our Focused Mission</h2>
                <p className="lead mb-0">
                  DividendSpot exists to provide you with exactly what you came
                  for: pure, unadulterated dividend data for NYSE and NASDAQ
                  stocks. No fluff, no distractions, no confusing charts about
                  things that aren't dividends. Just the payout history, plain
                  and simple, delivered with delightful speed.
                </p>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="col-12 mt-4">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4 p-md-5">
                <div className="row g-4">
                  <div className="col-md-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="h5 mb-0">✅</div>
                      <h4 className="h6 ms-2 mb-0">Just the Dividend Facts</h4>
                    </div>
                    <p className="text-muted">
                      We stick to what matters most here: the cold, hard
                      dividend numbers. Updated regularly, because stale data is
                      just... sad.
                    </p>
                  </div>
                  <div className="col-md-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="h5 mb-0">🚀</div>
                      <h4 className="h6 ms-2 mb-0">
                        Faster Than a Speeding Bullet (Almost)
                      </h4>
                    </div>
                    <p className="text-muted">
                      Built for speed on Bun.js, because nobody has time for a
                      slow-loading site when there are dividends to spot!
                    </p>
                  </div>
                  <div className="col-md-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="h5 mb-0">🆓</div>
                      <h4 className="h6 ms-2 mb-0">
                        Free, As In "No Annoying Ads"
                      </h4>
                    </div>
                    <p className="text-muted">
                      Access essential dividend data without playing "Where's
                      the Close Button?" on pop-up ads. Enjoy the peace and
                      quiet.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
