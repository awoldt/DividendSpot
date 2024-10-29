import type { Company, CompanyCache } from "../types.ts";
import {
  FormatDateString,
  GetDividendPayingYears,
  OrganizeDividendPayouts,
  RemainingDays,
} from "../utils.ts";

export default function CompanyView(props: {
  cachedData: CompanyCache;
  company: Company;
}) {
  const organizedPayouts = OrganizeDividendPayouts(props.cachedData.d);
  const dividendPayingYears = GetDividendPayingYears(props.cachedData.d);

  return (
    <div className="container my-5">
      {organizedPayouts === null ? (
        <p>There was an error displaying dividend data for this company :(</p>
      ) : (
        <div
          className="company-view"
          itemscope
          itemtype="https://schema.org/Corporation"
        >
          {/* Company Header */}
          <div className="card mb-4">
            <div className="card-body text-center">
              <img
                src={`/public/imgs/company-logo/${props.company.ticker}.png`}
                alt={`${props.company.name} logo`}
                className="mb-3"
                style={{ width: "100px", height: "100px" }}
                itemprop="logo"
              />
              <h1 className="card-title">
                <span itemprop="legalName">{props.company.name}</span> Dividend
                History (
                <span itemprop="tickerSymbol">{props.company.ticker}</span>)
              </h1>

              {/* Upcoming Dividend Payout Alert */}
              {organizedPayouts.upcoming.length > 0 && (
                <div className="alert alert-info text-center">
                  <h4>🎉 Upcoming Dividend Payout</h4>
                  <p>
                    {props.company.name} will distribute a dividend of{" "}
                    <span className="fw-bold">
                      ${organizedPayouts.upcoming[0].amount}
                    </span>{" "}
                    per share on{" "}
                    <span className="fw-bold">
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
            </div>
          </div>

          {/* Dividend Summary */}
          {organizedPayouts.recent.length > 0 ? (
            <div className="my-4">
              <p className="lead">
                {props.company.name} has distributed a total of{" "}
                {organizedPayouts.recent.length} dividends{" "}
                {dividendPayingYears === 0
                  ? "over the course of a year"
                  : `over a ${dividendPayingYears} year period, from ${
                      organizedPayouts.recent[
                        organizedPayouts.recent.length - 1
                      ].pay_date.split("-")[0]
                    } to ${organizedPayouts.recent[0].pay_date.split("-")[0]}`}
              </p>
            </div>
          ) : (
            organizedPayouts.upcoming.length === 0 && (
              <p className="text-muted">
                <strong>
                  {props.company.name} does not pay dividends currently.
                </strong>{" "}
                They might in the future, check back soon!
              </p>
            )
          )}
          {/* Company Description */}
          {props.company.description && (
            <div className="accordion mb-4" id="companyAccordion">
              <div className="accordion-item">
                <div
                  className="accordion-header"
                  id="headingCompanyDescription"
                >
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseCompanyDescription"
                    aria-expanded="false"
                    aria-controls="collapseCompanyDescription"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-info-square"
                      viewBox="0 0 16 16"
                    >
                      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                    </svg>
                    <i className="bi bi-info-circle me-2"></i>
                    <div>About {props.company.name}</div>
                  </button>
                </div>
                <div
                  id="collapseCompanyDescription"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingCompanyDescription"
                  data-bs-parent="#companyAccordion"
                >
                  <div className="accordion-body">
                    <p itemProp="description">{props.company.description}</p>
                    {props.company.website_url && (
                      <p>
                        <strong>Website:</strong>{" "}
                        <a href={props.company.website_url} itemProp="sameAs">
                          {props.company.website_url}
                        </a>
                      </p>
                    )}
                    {props.company.address && (
                      <p>
                        <strong>Address:</strong>{" "}
                        <span itemProp="address">{props.company.address}</span>
                      </p>
                    )}
                    {props.company.phone && (
                      <p>
                        <strong>Phone:</strong>{" "}
                        <span itemProp="telephone">{props.company.phone}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Related Companies */}
          {props.cachedData.rc && (
            <div className="accordion mb-4" id="relatedCompaniesAccordion">
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingRelatedCompanies">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseRelatedCompanies"
                    aria-expanded="false"
                    aria-controls="collapseRelatedCompanies"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-buildings"
                      viewBox="0 0 16 16"
                    >
                      <path d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022M6 8.694 1 10.36V15h5zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5z" />
                      <path d="M2 11h1v1H2zm2 0h1v1H4zm-2 2h1v1H2zm2 0h1v1H4zm4-4h1v1H8zm2 0h1v1h-1zm-2 2h1v1H8zm2 0h1v1h-1zm2-2h1v1h-1zm0 2h1v1h-1zM8 7h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zM8 5h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zm0-2h1v1h-1z" />
                    </svg>
                    <i className="bi bi-info-circle me-2"></i>
                    Other companies you might be interested in
                  </button>
                </h2>
                <div
                  id="collapseRelatedCompanies"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingRelatedCompanies"
                  data-bs-parent="#relatedCompaniesAccordion"
                >
                  <div className="accordion-body d-flex flex-wrap">
                    {props.cachedData.rc.map((x) => (
                      <a
                        href={`/${x.ticker?.toLowerCase()}`}
                        className="m-2 text-decoration-none"
                        key={x.ticker}
                      >
                        <div className="d-flex align-items-center">
                          <img
                            src={`/public/imgs/company-logo/${x.ticker}.png`}
                            alt={`${x.name} logo`}
                            className="me-2"
                            style={{ width: "30px", height: "30px" }}
                          />
                          {x.name}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Company News */}
          {props.cachedData.cd.news && (
            <div className="accordion mb-4" id="companyNewsAccordion">
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingCompanyNews">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseCompanyNews"
                    aria-expanded="false"
                    aria-controls="collapseCompanyNews"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-newspaper"
                      viewBox="0 0 16 16"
                    >
                      <path d="M0 2.5A1.5 1.5 0 0 1 1.5 1h11A1.5 1.5 0 0 1 14 2.5v10.528c0 .3-.05.654-.238.972h.738a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 1 1 0v9a1.5 1.5 0 0 1-1.5 1.5H1.497A1.497 1.497 0 0 1 0 13.5zM12 14c.37 0 .654-.211.853-.441.092-.106.147-.279.147-.531V2.5a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0-.5.5v11c0 .278.223.5.497.5z" />
                      <path d="M2 3h10v2H2zm0 3h4v3H2zm0 4h4v1H2zm0 2h4v1H2zm5-6h2v1H7zm3 0h2v1h-2zM7 8h2v1H7zm3 0h2v1h-2zm-3 2h2v1H7zm3 0h2v1h-2zm-3 2h2v1H7zm3 0h2v1h-2z" />
                    </svg>
                    <i className="bi bi-info-circle me-2"></i>
                    Company News
                  </button>
                </h2>
                <div
                  id="collapseCompanyNews"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingCompanyNews"
                  data-bs-parent="#companyNewsAccordion"
                >
                  <div className="accordion-body">
                    {props.cachedData.cd.news.map((x) => (
                      <a
                        href={x.url}
                        target="_blank"
                        className="d-block mb-2"
                        key={x.url}
                      >
                        <div className="d-flex align-items-center">
                          <img
                            src={x.thumbnail}
                            alt={`${x.title} thumbnail`}
                            className="img-fluid me-2"
                            style={{ width: "50px", height: "50px" }}
                            loading="lazy"
                          />
                          {x.title}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Payouts Table */}
          {organizedPayouts.recent.length > 0 && (
            <div className="card">
              <div className="card-body">
                <h2>
                  Recent Payouts{" "}
                  <small className="text-muted">
                    ({organizedPayouts.recent.length})
                  </small>
                </h2>
                <p>
                  The most recent dividend {props.company.name} paid out was on{" "}
                  <strong>
                    {FormatDateString(organizedPayouts.recent[0].pay_date)} (
                    {Math.abs(
                      RemainingDays(organizedPayouts.recent[0].pay_date)
                    )}{" "}
                    days ago)
                  </strong>{" "}
                  for <strong>${organizedPayouts.recent[0].amount}</strong> per
                  share
                </p>
                <table className="table table-striped">
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
              </div>
            </div>
          )}

          {/* Last Updated Info */}
          {props.cachedData.d && props.cachedData.d.length > 0 && (
            <p className="text-muted text-end mt-3">
              <small>
                Dividend data last updated{" "}
                {new Date(props.cachedData.ca).toUTCString()} UTC
              </small>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
