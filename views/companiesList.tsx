import Search from "../components/search.tsx";

export default function CompaniesList({
  companies,
  numOfCompanies,
}: {
  companies: {
    section: string;
    companies: {
      name: string;
      ticker: string;
    }[];
  }[];
  numOfCompanies: number;
}) {
  return (
    <div class="container pt-5">
      <Search />
      {companies.length > 0 && (
        <div>
          <p>
            There are currently <b>{numOfCompanies}</b> companies stored in our
            database. Browse through the list and find the company you are
            looking for. DividendSpot supports companies featured on the NYSE
            and NASDAQ exchanges.{" "}
          </p>
          {companies.map((c) => {
            return (
              <div>
                <b>{c.section}</b>
                {c.companies &&
                  c.companies.map((z) => {
                    return (
                      <div>
                        <a href={`/${z.ticker.toLowerCase()}`}>
                          {z.name} ({z.ticker})
                        </a>
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
