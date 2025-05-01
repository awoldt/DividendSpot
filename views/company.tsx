import Search from "../components/search.tsx";
import type { CompanyCache, Dividend, OrganizedDividends } from "../types.ts";
import {
  FormatDateString,
  GetDividendPayingYears,
  OrganizeDividendPayouts,
} from "../utils.ts";
import { DateTime } from "luxon";

// --- Helper Functions ---

function getUpcomingDividend(
  organizedPayouts: OrganizedDividends | null
): Dividend | null {
  if (
    organizedPayouts &&
    organizedPayouts.upcoming &&
    organizedPayouts.upcoming.length > 0 &&
    organizedPayouts.upcoming[0]
  ) {
    return organizedPayouts.upcoming[0];
  }
  return null;
}

function getTodayDividend(
  organizedPayouts: OrganizedDividends | null
): Dividend | null {
  if (organizedPayouts && organizedPayouts.today) {
    return organizedPayouts.today;
  }
  return null;
}

function calculateAnnualDividend(
  recentPayouts: Dividend[] | undefined
): number | null {
  if (!recentPayouts || recentPayouts.length === 0) return null;

  if (recentPayouts.length >= 4) {
    const last4Dates = recentPayouts
      .slice(0, 4)
      // Create DateTime objects directly, handle potential invalid dates later
      .map((d) => (d.pay_date ? DateTime.fromISO(d.pay_date) : null))
      // Filter out nulls *and* invalid dates
      .filter((d): d is DateTime => d instanceof DateTime && d.isValid);

    if (last4Dates.length === 4) {
      // Safe to access diff now as all elements are valid DateTimes
      const intervals = [
        last4Dates[0].diff(last4Dates[1], "months").months,
        last4Dates[1].diff(last4Dates[2], "months").months,
        last4Dates[2].diff(last4Dates[3], "months").months,
      ];
      const isQuarterly = intervals.every(
        (interval) => interval >= 2.5 && interval <= 3.5
      );
      if (isQuarterly) {
        return recentPayouts
          .slice(0, 4)
          .reduce((sum, p) => sum + (p.amount || 0), 0);
      }
    }
  }

  if (recentPayouts[0] && typeof recentPayouts[0].amount === "number") {
    return recentPayouts[0].amount * 4;
  }
  return null;
}

function inferPaymentFrequency(
  recentPayouts: Dividend[] | undefined
): string | null {
  if (!recentPayouts || recentPayouts.length < 2) return null;

  const oneYearAgo = DateTime.now().minus({ years: 1 });
  // Filter based on valid DateTime objects
  const payoutsLastYear = recentPayouts.filter((d) => {
    if (!d.pay_date) return false;
    const dt = DateTime.fromISO(d.pay_date);
    return dt.isValid && dt > oneYearAgo;
  });

  const count = payoutsLastYear.length;

  if (count >= 10 && count <= 13) return "Monthly";
  if (count >= 3.5 && count <= 5) return "Quarterly";
  if (count >= 1.5 && count <= 3) return "Semi-Annually";
  if (count === 1) return "Annually";

  const dates = recentPayouts
    .slice(0, 5)
    .map((d) => (d.pay_date ? DateTime.fromISO(d.pay_date) : null))
    // Filter out nulls and invalid dates before diffing
    .filter((d): d is DateTime => d instanceof DateTime && d.isValid);

  if (dates.length >= 2) {
    // Safe to access diff now
    const intervalMonths = dates[0].diff(dates[1], "months").months;
    if (intervalMonths >= 11 && intervalMonths <= 13) return "Annually";
    if (intervalMonths >= 5.5 && intervalMonths <= 6.5) return "Semi-Annually";
    if (intervalMonths >= 2.5 && intervalMonths <= 3.5) return "Quarterly";
    if (intervalMonths >= 0.8 && intervalMonths <= 1.2) return "Monthly";
  }

  return "Irregularly";
}

// --- Component ---

export default function CompanyView(props: { cachedData: CompanyCache }) {
  const organizedPayouts: OrganizedDividends | null = props.cachedData
    .dividend_data
    ? OrganizeDividendPayouts(props.cachedData.dividend_data)
    : null;

  const dividendPayingYears: number | null = props.cachedData.dividend_data
    ? GetDividendPayingYears(props.cachedData.dividend_data)
    : null;

  const dividendChangePercentage: number | null = (() => {
    if (
      organizedPayouts &&
      organizedPayouts.recent &&
      organizedPayouts.recent.length >= 2 &&
      organizedPayouts.recent[0] &&
      typeof organizedPayouts.recent[0].amount === "number" &&
      organizedPayouts.recent[organizedPayouts.recent.length - 1] &&
      typeof organizedPayouts.recent[organizedPayouts.recent.length - 1]
        .amount === "number" &&
      organizedPayouts.recent[organizedPayouts.recent.length - 1].amount !== 0
    ) {
      const firstAmount = organizedPayouts.recent[0].amount;
      const lastAmount =
        organizedPayouts.recent[organizedPayouts.recent.length - 1].amount;
      return ((firstAmount - lastAmount) / lastAmount) * 100;
    }
    return null;
  })();

  const upcomingDividend = getUpcomingDividend(organizedPayouts);
  const todayDividend = getTodayDividend(organizedPayouts);
  const hasRecentPayouts = organizedPayouts?.recent?.length ?? 0 > 0;
  const annualDividend = calculateAnnualDividend(organizedPayouts?.recent);
  const paymentFrequency = inferPaymentFrequency(organizedPayouts?.recent);
  const latestDividendAmount =
    hasRecentPayouts && organizedPayouts?.recent?.[0]?.amount
      ? organizedPayouts.recent[0].amount
      : null;

  return (
    <div role="main">
      {" "}
      {/* Added role="main" for main content area */}
      <div className="container my-5">
        <div className="mb-4">
          <Search />
        </div>

        {!organizedPayouts && props.cachedData.dividend_data !== null ? (
          <div className="alert alert-danger" role="alert">
            {" "}
            {/* Added role="alert" for error message */}
            <p className="mb-0">
              There was an error processing dividend data for this company :(
            </p>
          </div>
        ) : (
          <div
            className="company-view"
            itemScope
            itemType="https://schema.org/Corporation"
          >
            {/* Company Header Card */}
            <div className="card shadow-sm rounded-4 mb-4">
              <div className="card-body bg-body-tertiary p-4 p-md-5 rounded-4">
                <div className="row align-items-center g-4">
                  <div className="col-auto text-center text-md-start">
                    <img
                      src={`/public/imgs/company-logo/${props.cachedData.company_data.ticker}.png`}
                      alt={`${props.cachedData.company_data.name} logo`}
                      className="mb-3 mb-md-0"
                      style={{ width: "80px", height: "80px" }}
                      itemProp="logo"
                    />
                  </div>
                  <div className="col text-center text-md-start">
                    <h1 className="h1 fw-bold mb-1">
                      <span itemProp="legalName">
                        {props.cachedData.company_data.name}
                      </span>{" "}
                      <span className="text-muted fw-normal">
                        ({props.cachedData.company_data.ticker})
                      </span>
                    </h1>
                  </div>
                </div>

                {props.cachedData.dividend_data !== null &&
                  props.cachedData.dividend_data.length === 0 && (
                    <div
                      className="alert alert-warning border shadow-sm rounded-4 p-4 mt-4 text-center"
                      role="status"
                    >
                      {" "}
                      {/* Added role="status" for informational message */}
                      <p className="lead mb-0">
                        <span className="fw-bold">
                          {props.cachedData.company_data.name} does not pay
                          dividends
                        </span>{" "}
                        <b>currently</b> 😔
                        <br />
                        <small className="text-muted">
                          They might in the future, check back soon!
                        </small>
                      </p>
                    </div>
                  )}

                {upcomingDividend &&
                  typeof upcomingDividend.amount === "number" && (
                    <div
                      className="alert alert-primary bg-gradient shadow-sm rounded-4 text-center p-4 mt-4"
                      role="status"
                    >
                      {" "}
                      {/* Added role="status" */}
                      <h2 className="h4 fw-bold mb-2">
                        📅 Upcoming Dividend Payout
                      </h2>
                      <p className="display-6 fw-bold mb-2">
                        ${upcomingDividend.amount.toFixed(2)}{" "}
                        <small className="text-muted fs-5">per Share</small>
                      </p>
                      {props.cachedData.upcominng_dividend_message && (
                        <p className="lead mb-0">
                          {props.cachedData.upcominng_dividend_message}
                        </p>
                      )}
                      {upcomingDividend.ex_dividend_date && (
                        <p className="mb-0 small text-muted mt-2">
                          Ex-Dividend Date:{" "}
                          {FormatDateString(upcomingDividend.ex_dividend_date)}
                        </p>
                      )}
                    </div>
                  )}

                {todayDividend && typeof todayDividend.amount === "number" && (
                  <div
                    className="alert alert-success bg-gradient shadow-sm rounded-4 text-center p-4 mt-4"
                    role="status"
                  >
                    {" "}
                    {/* Added role="status" */}
                    <h2 className="h4 fw-bold mb-2">
                      🎉 Dividend Payout Today!
                    </h2>
                    <p className="lead mb-0">
                      {props.cachedData.company_data.name} is paying out a
                      dividend of{" "}
                      <span className="fw-bold">
                        ${todayDividend.amount.toFixed(2)}
                      </span>{" "}
                      per share today!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Dividend Highlights Card */}
            {hasRecentPayouts && (
              <div className="card shadow-sm rounded-4 mb-4">
                <div className="card-header bg-light border-bottom rounded-top-4 p-3">
                  <h2 className="h5 mb-0">📊 Dividend Highlights</h2>
                </div>
                <div className="card-body p-4">
                  <div className="row g-4 text-center">
                    {latestDividendAmount !== null && (
                      <div className="col-6 col-md-4">
                        <div className="h6 text-muted mb-1 small">
                          Last Dividend
                        </div>
                        <div className="fs-4 fw-bold">
                          ${latestDividendAmount.toFixed(2)}
                        </div>
                      </div>
                    )}
                    {annualDividend !== null && (
                      <div className="col-6 col-md-4">
                        <div className="h6 text-muted mb-1 small">
                          Approx. Annual Dividend
                        </div>
                        <div className="fs-4 fw-bold">
                          ${annualDividend.toFixed(2)}
                        </div>
                      </div>
                    )}
                    {paymentFrequency && (
                      <div className="col-12 col-md-4">
                        <div className="h6 text-muted mb-1 small">
                          Payment Frequency
                        </div>
                        <div className="fs-4 fw-bold">{paymentFrequency}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Previous Payout History Card */}
            {hasRecentPayouts &&
              organizedPayouts &&
              organizedPayouts.recent && (
                <div className="card shadow-sm rounded-4 mb-4">
                  <div className="card-header bg-light border-bottom rounded-top-4 p-3 d-flex justify-content-between align-items-center">
                    <h3 className="h5 mb-0">Previous Payout History</h3>
                    <span className="badge bg-secondary fw-normal">
                      {organizedPayouts.recent.length} payouts shown
                    </span>
                  </div>
                  <div className="card-body p-4">
                    <div className="table-responsive">
                      {/* Added aria-label to table for better context */}
                      <table
                        className="table table-hover table-striped"
                        aria-label="Previous dividend payout history"
                      >
                        <thead>
                          <tr>
                            <th scope="col">Pay Date</th>
                            <th scope="col">Amount Per Share</th>
                            {dividendChangePercentage !== null &&
                              dividendPayingYears !== null &&
                              dividendPayingYears >= 1 && (
                                <th
                                  scope="col"
                                  className="text-end d-none d-md-table-cell"
                                  aria-label="Change percentage compared to previous payout" // Added aria-label
                                >
                                  Change vs Previous
                                </th>
                              )}
                          </tr>
                        </thead>
                        <tbody>
                          {organizedPayouts.recent.map(
                            (dividend: Dividend, index: number) => {
                              if (
                                !dividend ||
                                typeof dividend.pay_date !== "string" ||
                                typeof dividend.amount !== "number"
                              ) {
                                return (
                                  <tr key={`invalid-${index}`}>
                                    <td
                                      colSpan={
                                        dividendChangePercentage !== null &&
                                        dividendPayingYears !== null &&
                                        dividendPayingYears >= 1
                                          ? 3
                                          : 2
                                      }
                                    >
                                      <span className="text-danger">
                                        Invalid dividend data detected
                                      </span>
                                    </td>
                                  </tr>
                                );
                              }

                              const prevDividend =
                                organizedPayouts.recent?.[index + 1];
                              let changePercent: number | null = null;

                              if (
                                prevDividend &&
                                typeof prevDividend.amount === "number" &&
                                prevDividend.amount !== 0 &&
                                typeof dividend.amount === "number"
                              ) {
                                changePercent =
                                  ((dividend.amount - prevDividend.amount) /
                                    prevDividend.amount) *
                                  100;
                              }

                              return (
                                <tr key={dividend.pay_date || index}>
                                  <td>{FormatDateString(dividend.pay_date)}</td>
                                  <td className="fw-bold">
                                    ${dividend.amount.toFixed(2)}
                                  </td>
                                  {dividendChangePercentage !== null &&
                                    dividendPayingYears !== null &&
                                    dividendPayingYears >= 1 && (
                                      <td className="text-end d-none d-md-table-cell">
                                        {changePercent !== null &&
                                          changePercent !== 0 && (
                                            <span
                                              className={
                                                changePercent > 0
                                                  ? "text-success"
                                                  : "text-danger"
                                              }
                                              aria-label={`Change of ${changePercent.toFixed(
                                                2
                                              )} percent`} // Added aria-label
                                            >
                                              {changePercent > 0 ? "▲" : "▼"}
                                              {changePercent.toFixed(2)}%
                                            </span>
                                          )}
                                        {changePercent === 0 && (
                                          <span className="text-muted">-</span>
                                        )}
                                        {changePercent === null &&
                                          prevDividend && (
                                            <span className="text-muted">
                                              -
                                            </span>
                                          )}
                                      </td>
                                    )}
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

            {/* Overall Dividend Trend Card */}
            {dividendChangePercentage !== null &&
              dividendPayingYears !== null &&
              dividendPayingYears >= 1 && (
                <div className="card shadow-sm rounded-4 mb-4">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center">
                      <div className="display-6 me-3" aria-hidden="true">
                        {" "}
                        {/* Added aria-hidden as emoji is decorative */}
                        {dividendChangePercentage > 0 ? "📈" : "📉"}
                      </div>
                      <div>
                        <h3 className="h5 mb-1">Overall Dividend Trend</h3>
                        <p className="mb-0 text-muted">
                          Dividend per share has changed by{" "}
                          <span
                            className={`fw-bold ${
                              dividendChangePercentage > 0
                                ? "text-success"
                                : "text-danger"
                            }`}
                            aria-label={`Change of ${dividendChangePercentage.toFixed(
                              2
                            )} percent`} // Added aria-label
                          >
                            {dividendChangePercentage > 0 ? "+" : ""}
                            {dividendChangePercentage.toFixed(2)}%
                          </span>{" "}
                          over the past {dividendPayingYears}{" "}
                          {dividendPayingYears === 1 ? "year" : "years"}{" "}
                          (comparing first and last payout shown).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/* About and Related Companies Card */}
            {(props.cachedData.company_data.description ||
              props.cachedData.related_companies) && (
              <div className="card shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                  <div className="row g-4">
                    {props.cachedData.company_data.description && (
                      <div
                        className={
                          props.cachedData.related_companies
                            ? "col-lg-8"
                            : "col-12"
                        }
                      >
                        <div className="d-flex align-items-center mb-3">
                          <div className="display-6 me-3" aria-hidden="true">
                            ℹ️
                          </div>{" "}
                          {/* Added aria-hidden */}
                          <h3 className="h5 mb-0">
                            About {props.cachedData.company_data.name}
                          </h3>
                        </div>
                        <p className="text-muted mb-3" itemProp="description">
                          {props.cachedData.company_data.description}
                        </p>
                        <div className="d-flex flex-column gap-2">
                          {props.cachedData.company_data.website_url && (
                            <a
                              href={props.cachedData.company_data.website_url}
                              className="text-decoration-none icon-link icon-link-hover"
                              itemProp="url"
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Visit website for ${props.cachedData.company_data.name}`} // Added aria-label
                            >
                              🌐 Visit Website
                            </a>
                          )}
                          {props.cachedData.company_data.address && (
                            <p className="mb-0 text-muted small">
                              📍{" "}
                              {/* Consider adding aria-hidden="true" to decorative emojis */}
                              <span itemProp="address">
                                {props.cachedData.company_data.address}
                              </span>
                            </p>
                          )}
                          {props.cachedData.company_data.phone && (
                            <p className="mb-0 text-muted small">
                              📞{" "}
                              {/* Consider adding aria-hidden="true" to decorative emojis */}
                              <span itemProp="telephone">
                                {props.cachedData.company_data.phone}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {props.cachedData.related_companies && (
                      <div
                        className={
                          props.cachedData.company_data.description
                            ? "col-lg-4"
                            : "col-12"
                        }
                      >
                        <div className="d-flex align-items-center mb-3">
                          <div className="display-6 me-3" aria-hidden="true">
                            🏢
                          </div>{" "}
                          {/* Added aria-hidden */}
                          <h3 className="h5 mb-0">Related Companies</h3>
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                          {props.cachedData.related_companies
                            .filter(
                              (company) =>
                                company && company.ticker && company.name
                            )
                            .map((company) => (
                              <a
                                href={
                                  company.ticker
                                    ? `/${company.ticker.toLowerCase()}`
                                    : "#"
                                }
                                className="btn btn-outline-secondary btn-sm rounded-pill d-inline-flex align-items-center"
                                key={company.ticker}
                                aria-label={`View dividend data for ${
                                  company.name || "a related company"
                                } (${company.ticker || "N/A"})`} // Added aria-label
                              >
                                <img
                                  src={
                                    company.ticker
                                      ? `/public/imgs/company-logo/${company.ticker}.png`
                                      : "/public/imgs/company-logo/placeholder.png"
                                  }
                                  alt={`${company.name || "Company"} logo`}
                                  className="me-2"
                                  style={{ width: "20px", height: "20px" }}
                                  aria-hidden="true" // Logo is decorative within the link
                                />
                                {company.name || "N/A"}{" "}
                                {company.ticker ? `(${company.ticker})` : ""}
                              </a>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Data last updated footer */}
            {hasRecentPayouts && (
              <p className="text-muted text-center mt-4 mb-0">
                <small>
                  Dividend data last updated:{" "}
                  {props.cachedData.cache_created_at &&
                  !isNaN(new Date(props.cachedData.cache_created_at).getTime())
                    ? new Date(props.cachedData.cache_created_at).toUTCString()
                    : "N/A"}
                  . Financial data is indicative and provided for informational
                  purposes only.
                </small>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
