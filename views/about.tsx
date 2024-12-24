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
          <h1 className="display-4 fw-bold mb-4">About DividendSpot</h1>
          <p className="lead mb-0">
            Your trusted source for dividend investment data and insights
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
                <h2 className="h3 mb-4">Our Mission</h2>
                <p className="lead mb-0">
                  DividendSpot aims to empower investors with comprehensive,
                  accurate, and timely dividend data for companies traded on the
                  NYSE and NASDAQ exchanges. We believe that informed investment
                  decisions lead to better financial outcomes.
                </p>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="col-12 mt-4">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4 p-md-5">
                <h2 className="h3 mb-4">Why Choose DividendSpot?</h2>
                <div className="row g-4">
                  <div className="col-md-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="h5 mb-0">✓</div>
                      <h4 className="h6 ms-2 mb-0">Accurate Data</h4>
                    </div>
                    <p className="text-muted">
                      Our information is regularly updated.
                    </p>
                  </div>
                  <div className="col-md-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="h5 mb-0">✓</div>
                      <h4 className="h6 ms-2 mb-0">User-Friendly</h4>
                    </div>
                    <p className="text-muted">
                      Clean interface designed for efficient research and
                      analysis.
                    </p>
                  </div>
                  <div className="col-md-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="h5 mb-0">✓</div>
                      <h4 className="h6 ms-2 mb-0">Free Access</h4>
                    </div>
                    <p className="text-muted">
                      Essential dividend data available at no cost to users.
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
