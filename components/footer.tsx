export default function Footer() {
  return (
    <footer className="py-4 bg-dark text-white mt-auto">
      <div className="container">
        <div className="row align-items-center">
          {/* Links Section */}
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <a
              href="/privacy-policy"
              className="text-white text-decoration-none d-block"
            >
              Privacy Policy
            </a>
          </div>

          {/* Disclaimer Section */}
          <div className="col-md-6 text-center text-md-end">
            <p className="mb-0 small">
              The information provided on this site is for general informational
              purposes only.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
