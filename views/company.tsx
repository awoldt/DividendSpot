import Footer from "../components/footer.tsx";
import Navbar from "../components/navbar.tsx";
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
      <header>
        <Navbar />
      </header>
      <main>
        {organizedPayouts === null ? (
          <p>There was an error displaying dividend data for this company :(</p>
        ) : (
          <div className="company-view">
            {/* Company Description */}
            {props.company.description !== null && (
              <div className="company-description">
                <input type="checkbox" id="toggle-description" />
                <label for="toggle-description" className="toggle-label">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-info-circle"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                  </svg>{" "}
                  About {props.company.name}
                </label>
                <div className="description-content">
                  <p>{props.company.description}</p>
                </div>
              </div>
            )}

            {/* Company Header */}
            <div className="company-header">
              <div className="header-content">
                <img
                  src={`/public/imgs/company-logo/${props.company.ticker}.png`}
                  alt={`${props.company.name} logo`}
                />
                <h1>
                  {props.company.name} Dividend History ({props.company.ticker})
                </h1>
              </div>

              {/* Upcoming Dividend Payout Alert */}
              {organizedPayouts.upcoming.length > 0 && (
                <div className="upcoming-dividend-alert">
                  <h2>🎉 Upcoming Dividend Payout</h2>
                  <p>
                    {props.company.name} will distribute a dividend of{" "}
                    <span className="amount">
                      ${organizedPayouts.upcoming[0].amount}
                    </span>{" "}
                    per share on{" "}
                    <span className="pay-date">
                      {FormatDateString(organizedPayouts.upcoming[0].pay_date)}{" "}
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
                              organizedPayouts.recent[0].pay_date.split("-")[0]
                            }`}
                      </b>
                    </p>
                  )}
                </>
              ) : (
                organizedPayouts.upcoming.length === 0 && (
                  <p>
                    <strong>
                      {props.company.name} does not pay dividends.
                    </strong>{" "}
                    They might in the future, check back soon!
                  </p>
                )
              )}

              {props.relatedCompanies !== null && (
                <div className="related-companies-dropdown">
                  <input
                    type="checkbox"
                    id="toggle-companies"
                    className="toggle-checkbox"
                  />
                  <label for="toggle-companies" className="dropdown-toggle">
                    Other companies you might be interested in
                    <svg
                      id="dropdown-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-chevron-down"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </label>

                  <div className="related-companies">
                    {props.relatedCompanies.map((x) => (
                      <a href={`/${x.ticker?.toLowerCase()}`}>
                        <div className="company-item">
                          <img
                            src={`/public/imgs/company-logo/${x.ticker}.png`}
                            alt={`${x.name} logo`}
                            className="company-logo"
                          />
                          {x.name}
                        </div>
                      </a>
                    ))}
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
      <Footer />
    </>
  );
}
