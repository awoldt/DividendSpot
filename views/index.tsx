export default function Home() {
  return (
    <div>
      {/* Welcome Message */}
      <div className="bg-light text-dark text-center py-2">
        <p className="mb-0 fs-5 p-3">
          👋 Welcome to DividendSpot! Stay updated with the latest dividend
          payouts and histories of top companies traded on the NYSE and NASDAQ
          markets.
        </p>
      </div>

      {/* Main Content Section */}
      <section className="container mt-5">
        <h1 className="text-center">
          Explore Dividend Information for Leading Companies
        </h1>
        <p className="text-center">
          Our platform provides comprehensive data on dividend payouts, upcoming
          dividends, and company histories, making it easier for you to track
          your investments.
        </p>

        {/* Why Track Dividends Section */}
        <div className="bg-light p-4 mt-4 rounded text-center">
          <h2>Why Track Dividends?</h2>
          <p>
            Dividends provide a reliable source of passive income for investors.
            With our platform, you can monitor the dividend histories and
            upcoming payouts of the companies you care about, ensuring you make
            informed investment decisions.
          </p>
        </div>

        {/* Popular Companies Section */}
        <h2 className="text-center mt-5">Popular Companies</h2>
        <div className="container mt-4 mb-4">
          <p class="text-center">
            Explore some of the biggest companies paying dividends out to their
            investors. Titans of various sectors that can be a good starting
            point in your dividend journey.
          </p>
          <div className="row g-4 justify-content-center">
            {[
              {
                name: "3M Company",
                img: "/public/imgs/company-logo/MMM.png",
                href: "/mmm",
              },
              {
                name: "Altria Group",
                img: "/public/imgs/company-logo/MO.png",
                href: "/mo",
              },
              {
                name: "AT&T Inc.",
                img: "/public/imgs/company-logo/T.png",
                href: "/t",
              },
              {
                name: "Chevron Corporation",
                img: "/public/imgs/company-logo/CVX.png",
                href: "/cvx",
              },
              {
                name: "Coca-Cola Co.",
                img: "/public/imgs/company-logo/KO.png",
                href: "/ko",
              },
              {
                name: "Exxon Mobil Corporation",
                img: "/public/imgs/company-logo/XOM.png",
                href: "/xom",
              },
              {
                name: "Ford",
                img: "/public/imgs/company-logo/F.png",
                href: "/f",
              },
              {
                name: "Johnson & Johnson",
                img: "/public/imgs/company-logo/JNJ.png",
                href: "/jnj",
              },
              {
                name: "McDonald's Corporation",
                img: "/public/imgs/company-logo/MCD.png",
                href: "/mcd",
              },
              {
                name: "Microsoft Corporation",
                img: "/public/imgs/company-logo/MSFT.png",
                href: "/msft",
              },

              {
                name: "PepsiCo, Inc.",
                img: "/public/imgs/company-logo/PEP.png",
                href: "/pep",
              },
              {
                name: "Pfizer",
                img: "/public/imgs/company-logo/PFE.png",
                href: "/pfe",
              },
              {
                name: "Procter & Gamble Co.",
                img: "/public/imgs/company-logo/PG.png",
                href: "/pg",
              },
              {
                name: "The Home Depot, Inc.",
                img: "/public/imgs/company-logo/HD.png",
                href: "/hd",
              },

              {
                name: "Verizon Communications Inc.",
                img: "/public/imgs/company-logo/VZ.png",
                href: "/vz",
              },
              {
                name: "Walmart Inc.",
                img: "/public/imgs/company-logo/WMT.png",
                href: "/wmt",
              },
            ].map((company, index) => (
              <div className="col-6 col-md-3" key={index}>
                <a
                  href={company.href}
                  className="text-decoration-none text-dark"
                >
                  <div className="card text-center h-100 shadow-sm">
                    <div className="card-body d-flex flex-column align-items-center">
                      <img
                        src={company.img}
                        alt={company.name}
                        className="img-fluid mb-3"
                        style={{ width: "50px", height: "50px" }}
                      />
                      <h6 className="card-title">{company.name}</h6>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
