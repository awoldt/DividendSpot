import type { Company, Dividend } from "../types.ts";
import {
  FormatDateString,
  GetDividendPayingYears,
  OrganizeDividendPayouts,
  RemainingDays,
} from "../utils.ts";

export default function CompanyView(props: {
  dividends: Dividend[] | null;
  company: Company;
  relatedCompanies: Partial<Company>[] | null;
}) {
  const organizedPayouts = OrganizeDividendPayouts(props.dividends);
  const dividendPayingYears = GetDividendPayingYears(props.dividends);

  return (
    <>
      <head>
        <title>
          {props.company.name} ({props.company.ticker}) Dividend History
        </title>
        <link rel="stylesheet" href="/public/styles/company.css" />
      </head>
      <body>
        <main>
          {organizedPayouts === null ? (
            <p>
              There was an error displaying dividend data for this company :(
            </p>
          ) : (
            <div className="company-view">
              {/* Company Header */}
              <div className="company-header">
                <div className="header-content">
                  <img
                    src={`/public/imgs/company-logo/${props.company.ticker}.png`}
                    alt={`${props.company.name} logo`}
                  />
                  <h1>{props.company.name} Dividend History</h1>
                </div>

                {/* Company Description */}
                {props.company.description !== null && (
                  <div className="company-description">
                    <input type="checkbox" id="toggle-description" />
                    <label for="toggle-description" className="toggle-label">
                      About {props.company.name}
                    </label>
                    <div className="description-content">
                      <p>{props.company.description}</p>
                    </div>
                  </div>
                )}

                {/* Upcoming Dividend Payout Alert */}
                {organizedPayouts.upcoming.length > 0 && (
                  <div className="upcoming-dividend-alert">
                    <h2>Upcoming Dividend Payout</h2>
                    <p>
                      {props.company.name} will distribute a dividend of{" "}
                      <span className="amount">
                        ${organizedPayouts.upcoming[0].amount}
                      </span>{" "}
                      per share on{" "}
                      <span className="pay-date">
                        {FormatDateString(
                          organizedPayouts.upcoming[0].pay_date
                        )}{" "}
                        (
                        {Math.abs(
                          RemainingDays(organizedPayouts.upcoming[0].pay_date)
                        )}{" "}
                        days)
                      </span>
                    </p>
                  </div>
                )}

                {/* Dividend Summary */}
                {organizedPayouts.recent.length > 0 ? (
                  <>
                    {dividendPayingYears !== null && (
                      <p className="dividends-summary">
                        <b>
                          {props.company.name} has distributed a total of{" "}
                          {organizedPayouts.recent.length} dividends{" "}
                          {dividendPayingYears === 0
                            ? "over the course of a year"
                            : `over a ${dividendPayingYears} year period, from ${
                                organizedPayouts.recent[
                                  organizedPayouts.recent.length - 1
                                ].pay_date.split("-")[0]
                              } to ${
                                organizedPayouts.recent[0].pay_date.split(
                                  "-"
                                )[0]
                              }`}
                        </b>
                      </p>
                    )}
                  </>
                ) : (
                  organizedPayouts.upcoming.length === 0 && (
                    <p>
                      <strong>
                        {props.company.name} does not pay dividends. They might
                        in the future, check back soon!
                      </strong>
                    </p>
                  )
                )}

                {props.relatedCompanies !== null && (
                  <div>
                    <span>Other companies you might be interested in</span>
                    <div className="related-companies">
                      {props.relatedCompanies.map((x) => {
                        return (
                          <a href={`/${x.ticker?.toLowerCase()}`}>
                            <div>
                              <img
                                src={`/public/imgs/company-logo/${x.ticker}.png`}
                                alt={`${x.name} logo`}
                              />
                              {x.name}
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Payouts Table */}
              {organizedPayouts.recent.length > 0 && (
                <>
                  <h2>
                    Recent Payouts <i>({organizedPayouts.recent.length})</i>
                  </h2>
                  <p>
                    The most recent dividend {props.company.name} paid out to
                    investors was on{" "}
                    <b>
                      {FormatDateString(organizedPayouts.recent[0].pay_date)} (
                      {Math.abs(
                        RemainingDays(organizedPayouts.recent[0].pay_date)
                      )}{" "}
                      days ago)
                    </b>{" "}
                    for <b>${organizedPayouts.recent[0].amount}</b> per share
                  </p>
                  <table className="dividends-table">
                    <thead>
                      <tr>
                        <th>Pay Date</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {organizedPayouts.recent.map((dividend, index) => (
                        <tr key={index}>
                          <td>{FormatDateString(dividend.pay_date)}</td>
                          <td>${dividend.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          )}
        </main>
      </body>
    </>
  );
}
