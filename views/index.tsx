export default function Home() {
  return (
    <div>
      {/* Welcome Message */}
      <div className="bg-primary text-white text-center py-2">
        <p className="mb-0">
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
        <div className="d-flex flex-wrap justify-content-center mt-3">
          {[
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
              name: "Johnson & Johnson",
              img: "/public/imgs/company-logo/JNJ.png",
              href: "/jnj",
            },
            {
              name: "Microsoft Corporation",
              img: "/public/imgs/company-logo/MSFT.png",
              href: "/msft",
            },
            {
              name: "Procter & Gamble Co.",
              img: "/public/imgs/company-logo/PG.png",
              href: "/pg",
            },
            {
              name: "PepsiCo, Inc.",
              img: "/public/imgs/company-logo/PEP.png",
              href: "/pep",
            },
            {
              name: "Verizon Communications Inc.",
              img: "/public/imgs/company-logo/VZ.png",
              href: "/vz",
            },
          ].map((company, index) => (
            <a
              href={company.href}
              className="text-center mx-3 my-2"
              key={index}
            >
              <div className="d-flex flex-column align-items-center">
                <img
                  src={company.img}
                  alt={company.name}
                  className="img-fluid mb-2"
                  style={{ width: "50px", height: "50px" }}
                />
                <span>{company.name}</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
