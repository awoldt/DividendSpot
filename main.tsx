import { Hono, type Context } from "hono";
import CompanyView from "./views/company.tsx";
import { GetCompanyDividends, GetRelatedCompanies } from "./utils.ts";
import { db } from "./db.ts";
import { serveStatic } from "hono/deno";
import CompaniesList from "./views/companiesList.tsx";
import PrivacyPolicy from "./views/privacyPolicy.tsx";
import type { Company, Dividend } from "./types.ts";

const app = new Hono();

app.use("/public/*", serveStatic({ root: "./" }));

app.get("/", async (c: Context) => {
  const file = await Deno.readFile(`${Deno.cwd()}/views/index.html`);

  return c.html(new TextDecoder().decode(file));
});

app.get("/privacy-policy", (c: Context) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Privacy Policy</title>
        <link rel="stylesheet" href="/public/styles/global.css">
          <style>
            /* Basic styling for the privacy policy page */
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              background-color: #f9f9f9;
              color: #333;
              margin: 0;
              padding: 0;
            }

            .container {
              max-width: 900px;
              margin: 0 auto;
              margin-top: 25px;
              padding: 40px;
              background-color: #fff;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              border-radius: 8px;
            }

            h1 {
              font-size: 2.5rem;
              margin-bottom: 20px;
              color: #0073e6;
            }

            h2 {
              font-size: 1.8rem;
              margin-top: 30px;
              color: #0056b3;
            }

            p {
              font-size: 1.1rem;
              margin-bottom: 15px;
            }

            ul {
              list-style-type: disc;
              margin-left: 20px;
            }

            footer {
              text-align: center;
              padding: 20px;
              background-color: #0073e6;
              color: #fff;
              margin-top: 40px;
            }

            footer a {
              color: #fff;
              text-decoration: none;
            }

            footer a:hover {
              text-decoration: underline;
            }
          </style>
      </head>
      <body>
        ${PrivacyPolicy()}
      </body>
    </html>
  `);
});

app.get("/companies", async (c: Context) => {
  const allCompanies = await db.query(
    "SELECT name, ticker FROM companies ORDER BY name;"
  );

  return c.html(<CompaniesList companies={allCompanies.rows} />);
});

const COMPANIES_CACHE: {
  t: string; // ticker
  d: Dividend[] | null; // dividend data
  rc: Partial<Company>[] | null; // related companies,
  ea: number; // expires at
}[] = [];
app.get("/:COMPANY_TICKER", async (c: Context) => {
  const ticker = c.req.param("COMPANY_TICKER").toUpperCase(); // all tickers in DB are uppercase
  const company = await db.query("SELECT * FROM companies WHERE ticker = $1;", [
    ticker,
  ]);

  if (company.rowCount === 0) {
    return c.text("Company does not exist", 404);
  }

  // see if company is stored in cache
  const cachedCompany = COMPANIES_CACHE.find((x) => x.t === ticker);
  if (cachedCompany !== undefined) {
    // company stored in cache!
    console.log("COMPANY IN CAHCE!");

    // if cache is older than 1 hour, refresh
    if (cachedCompany.ea < Date.now()) {
      console.log("NEED TO REFRESH CACHE FOR THIS COMPANY!");

      COMPANIES_CACHE.push({
        t: ticker,
        d: await GetCompanyDividends(ticker),
        rc: await GetRelatedCompanies(ticker),
        ea: Date.now() + 10800000, // 3 hrs
      });
    }
  } else {
    console.log("company not in cache :(");
    // stored dividend data for company in cache
    COMPANIES_CACHE.push({
      t: ticker,
      d: await GetCompanyDividends(ticker),
      rc: await GetRelatedCompanies(ticker),
      ea: Date.now() + 3600000,
    });
    console.log("now in cache!");
  }

  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${company.rows[0].name} - Dividend Tracker</title>
        <link rel="stylesheet" href="/public/styles/company.css">
        <link rel="stylesheet" href="/public/styles/global.css">
      </head>
      <body>
        ${CompanyView({
          dividends:
            cachedCompany !== undefined
              ? cachedCompany.d
              : await GetCompanyDividends(ticker),
          company: company.rows[0],
          relatedCompanies:
            cachedCompany !== undefined
              ? cachedCompany.rc
              : await GetRelatedCompanies(ticker),
        })}
      </body>
    </html>
  `);
});

Deno.serve(app.fetch);
