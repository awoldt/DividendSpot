import Search from "../components/search.tsx";
import type { CompanyCache } from "../types.ts";
import {
  DividendStatement,
  FormatDateString,
  GetDividendPayingYears,
  OrganizeDividendPayouts,
  RemainingDays,
} from "../utils.ts";

export default function CompanyView(props: { cachedData: CompanyCache }) {
  const organizedPayouts = OrganizeDividendPayouts(
    props.cachedData.dividend_data
  );
  const dividendPayingYears = GetDividendPayingYears(
    props.cachedData.dividend_data
  );

  const dividendChangePercentage: number | null =
    organizedPayouts === null
      ? null
      : organizedPayouts.recent.length >= 2
      ? ((organizedPayouts.recent[0].amount -
          organizedPayouts.recent[organizedPayouts.recent.length - 1].amount) /
          organizedPayouts.recent[organizedPayouts.recent.length - 1].amount) *
        100
      : null;

  return (
    <div>
      <div className="container my-5">
        <div class="mb-4">
          {" "}
          <Search />
        </div>

        {organizedPayouts === null ? (
          <div className="alert alert-danger">
            <p className="mb-0">
              There was an error displaying dividend data for this company :(
            </p>
          </div>
        ) : (
          <div
            className="company-view"
            itemScope
            itemType="https://schema.org/Corporation"
          >
            {/* Company Header */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body text-center p-5">
                <img
                  src={`/public/imgs/company-logo/${props.cachedData.company_data.ticker}.png`}
                  alt={`${props.cachedData.company_data.name} logo`}
                  className="mb-4"
                  style={{ width: "120px", height: "120px" }}
                  itemProp="logo"
                />
                <h1 className="display-5 fw-bold mb-4">
                  <span itemProp="legalName">
                    {props.cachedData.company_data.name}
                  </span>{" "}
                  <span className="text-muted">
                    ({props.cachedData.company_data.ticker})
                  </span>
                </h1>

                {/* Company Doesn't Pay Dividends Alert*/}
                {props.cachedData.dividend_data !== null &&
                  props.cachedData.dividend_data.length === 0 && (
                    <div className="alert alert-light border shadow-sm rounded-4 p-4">
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

                {/* Upcoming Dividend Payout Alert */}
                {organizedPayouts.upcoming.length > 0 && (
                  <div className="alert alert-primary bg-gradient shadow-sm rounded-4 text-center p-4 mt-4">
                    <div className="display-6 fw-bold mb-3">
                      <div className="mb-2">🎉</div>{" "}
                      <div>
                        <span class="mb-1">Upcoming Dividend Payout</span>
                      </div>
                      <div>
                        <span class="display-6">
                          ${organizedPayouts.upcoming[0].amount} per Share
                        </span>
                      </div>
                    </div>
                    {props.cachedData.upcominng_dividend_message !== null && (
                      <p className="lead mb-0">
                        {props.cachedData.upcominng_dividend_message}
                      </p>
                    )}
                  </div>
                )}

                {/* Today's Dividend Alert */}
                {organizedPayouts.today !== null && (
                  <div className="alert alert-success bg-gradient shadow-sm rounded-4 text-center p-4 mt-4">
                    <div className="display-6 fw-bold mb-3">
                      🎉 Dividend Payout Today!
                    </div>
                    <p className="lead mb-0">
                      {props.cachedData.company_data.name} is paying out a
                      dividend of{" "}
                      <span className="fw-bold">
                        ${organizedPayouts.today.amount}
                      </span>{" "}
                      per share today!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Dividend Summary */}
            {organizedPayouts.recent.length > 0 && (
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <div className="display-6 me-3">🤑</div>
                        <div>
                          <h3 className="h5 mb-1">Total Dividends</h3>
                          <p className="mb-0">
                            <span className="fw-bold">
                              {organizedPayouts.recent.length}
                            </span>{" "}
                            dividends distributed
                            {dividendPayingYears === 0
                              ? " over the course of a year"
                              : ` from ${
                                  organizedPayouts.recent[
                                    organizedPayouts.recent.length - 1
                                  ].pay_date.split("-")[0]
                                } to ${
                                  organizedPayouts.recent[0].pay_date.split(
                                    "-"
                                  )[0]
                                }`}
                          </p>
                        </div>
                      </div>
                    </div>
                    {dividendChangePercentage !== null &&
                      dividendChangePercentage !== 0 &&
                      dividendPayingYears !== null &&
                      dividendPayingYears >= 1 && (
                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <div className="display-6 me-3">
                              {dividendChangePercentage > 0 ? "📈" : "📉"}
                            </div>
                            <div>
                              <h3 className="h5 mb-1">Dividend Change</h3>
                              <p className="mb-0">
                                <span
                                  className={`fw-bold ${
                                    dividendChangePercentage > 0
                                      ? "text-success"
                                      : "text-danger"
                                  }`}
                                >
                                  {dividendChangePercentage > 0 ? "+" : ""}
                                  {dividendChangePercentage.toFixed(2)}%
                                </span>{" "}
                                over {dividendPayingYears} years
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}

            {/* Accordions */}
            <div className="row g-4 mb-4">
              {/* Company Description */}
              {props.cachedData.company_data.description && (
                <div className="col-lg-4">
                  <div className="card border-0 shadow-sm rounded-4 h-100">
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-4">
                        <div className="display-6 me-3">ℹ️</div>
                        <h3 className="h4 mb-0">About</h3>
                      </div>
                      <p className="text-muted mb-4" itemProp="description">
                        {props.cachedData.company_data.description}
                      </p>
                      <div className="d-flex flex-column gap-2">
                        {props.cachedData.company_data.website_url && (
                          <a
                            href={props.cachedData.company_data.website_url}
                            className="text-decoration-none"
                            itemProp="sameAs"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            🌐 Website
                          </a>
                        )}
                        {props.cachedData.company_data.address && (
                          <p className="mb-0 text-muted small">
                            📍{" "}
                            <span itemProp="address">
                              {props.cachedData.company_data.address}
                            </span>
                          </p>
                        )}
                        {props.cachedData.company_data.phone && (
                          <p className="mb-0 text-muted small">
                            📞{" "}
                            <span itemProp="telephone">
                              {props.cachedData.company_data.phone}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Related Companies */}
              {props.cachedData.related_companies && (
                <div className="col-lg-4">
                  <div className="card border-0 shadow-sm rounded-4 h-100">
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-4">
                        <div className="display-6 me-3">🏢</div>
                        <h3 className="h4 mb-0">Related Companies</h3>
                      </div>
                      <div className="d-flex flex-wrap gap-2">
                        {props.cachedData.related_companies.map((company) => (
                          <a
                            href={`/${company.ticker?.toLowerCase()}`}
                            className="btn btn-light btn-sm rounded-pill"
                          >
                            <img
                              src={`/public/imgs/company-logo/${company.ticker}.png`}
                              alt={`${company.name} logo`}
                              className="me-2"
                              style={{ width: "20px", height: "20px" }}
                            />
                            {company.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Company News */}
              {props.cachedData.company_data.news && (
                <div className="col-lg-4">
                  <div className="card border-0 shadow-sm rounded-4 h-100">
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-4">
                        <div className="display-6 me-3">📰</div>
                        <h3 className="h4 mb-0">Latest News</h3>
                      </div>
                      <div className="d-flex flex-column gap-4">
                        {props.cachedData.company_data.news.map((newsItem) => (
                          <div
                            className="news-item"
                            itemScope
                            itemType="https://schema.org/NewsArticle"
                          >
                            <a
                              href={newsItem.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none text-dark"
                              itemProp="url"
                            >
                              <div className="d-flex gap-3">
                                <img
                                  itemProp="thumbnail"
                                  src={newsItem.thumbnail}
                                  alt={`${newsItem.title} thumbnail`}
                                  className="rounded-3"
                                  style={{
                                    width: "80px",
                                    height: "80px",
                                    objectFit: "cover",
                                  }}
                                />
                                <div>
                                  <h4 className="h6 mb-2" itemProp="name">
                                    {newsItem.title}
                                  </h4>
                                  <p className="small text-muted mb-1">
                                    {newsItem.publisher_name} •{" "}
                                    {new Date(
                                      newsItem.published_at_utc
                                    ).toLocaleDateString()}
                                  </p>
                                  {newsItem.included_tickers.length > 0 && (
                                    <div className="d-flex gap-1">
                                      {newsItem.included_tickers
                                        .filter(
                                          (x) =>
                                            x !==
                                            props.cachedData.company_data.ticker
                                        )
                                        .map((ticker) => (
                                          <a
                                            href={`/${ticker}`}
                                            className="badge bg-light text-dark text-decoration-none"
                                          >
                                            {ticker}
                                          </a>
                                        ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Payouts Table */}
            {organizedPayouts.recent.length > 0 && (
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="h4 mb-0">
                      Previous Payouts{" "}
                      <span className="badge bg-light text-dark">
                        {organizedPayouts.recent.length}
                      </span>
                    </h3>
                    <p className="text-muted mb-0">
                      Last payout:{" "}
                      <span className="fw-bold">
                        ${organizedPayouts.recent[0].amount}
                      </span>{" "}
                      on{" "}
                      <span className="fw-bold">
                        {FormatDateString(organizedPayouts.recent[0].pay_date)}
                      </span>
                    </p>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Pay Date</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {organizedPayouts.recent.map((dividend) => (
                          <tr>
                            <td>{FormatDateString(dividend.pay_date)}</td>
                            <td className="fw-bold">${dividend.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Last Updated Info */}
            {props.cachedData.dividend_data &&
              props.cachedData.dividend_data.length > 0 && (
                <p className="text-muted text-center mt-4 mb-0">
                  <small>
                    Data last updated:{" "}
                    {new Date(props.cachedData.cache_created_at).toUTCString()}
                  </small>
                </p>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
