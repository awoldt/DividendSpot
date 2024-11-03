import { Hono, type Context } from "hono";
import CompanyView from "./views/company.tsx";
import { OrganizeCompaniesList, SaveCompanyToCache } from "./utils.ts";
import { serveStatic } from "hono/deno";
import PrivacyPolicy from "./views/privacyPolicy.tsx";
import type { CompanyCache } from "./types.ts";
import Layout from "./components/layout.tsx";
import About from "./views/about.tsx";
import Home from "./views/index.tsx";
import { db } from "./db.ts";
import { cors } from "hono/cors";
import CompaniesList from "./views/companiesList.tsx";

const COMPANIES_CACHE: CompanyCache[] = [];

const app = new Hono();

app.use(
  "/search",
  cors({
    origin: [
      "https://dividendspot.com",
      "https://dividends-vvxwd.ondigitalocean.app",
      "http://localhost:8000",
    ],
  })
);

app.use("/public/*", serveStatic({ root: "./" }));

app.get("/robots.txt", (c: Context) => {
  return c.text(`User-agent: *
Disallow:
`);
});

app.get("/sitemap.xml", async (c: Context) => {
  const file = await Deno.readFile("./views/sitemap.xml");

  return c.body(new TextDecoder().decode(file), 200, {
    "Content-Type": "application/xml",
  });
});

app.post("/search", async (c: Context) => {
  const query = c.req.query("q");
  if (query === undefined) {
    return c.json({ msg: "Bad request" }, 400);
  }

  // look for tickers first
  const q1 = await db.query(
    ` SELECT name, ticker FROM companies
      WHERE ticker = UPPER($1);
    `,
    [query]
  );

  // now find companies with similar name
  const q2 = await db.query(
    `SELECT name, ticker FROM companies
   WHERE name ILIKE '%' || $1 || '%' ORDER BY name LIMIT 10;
    `,
    [query]
  );

  const results = [];
  if (q1.rows[0] !== undefined) {
    results.push(q1.rows[0]);
  }
  if (q2.rows.length > 0) {
    if (q2.rows.length > 10) {
      for (let i = 0; i < 10; i++) {
        results.push(q2.rows[i]);
      }
    } else {
      for (let i = 0; i < q2.rows.length; i++) {
        results.push(q2.rows[i]);
      }
    }
  }

  return c.json({ data: results });
});

app.get("/", (c: Context) => {
  return c.html(
    `
    <!DOCTYPE html>
    ${(
      <Layout
        title="DividendSpot - Discover Dividend Data on All your Favorite Companies"
        body={<Home />}
        styles={["/public/styles/index.css"]}
        metaDescription="DividendSpot is the best platform to discover dividend data on all your favorite companies traded on the NYSE and NASDAQ exchanges"
        canonicalLink="https://dividendspot.com"
        ogData={null}
      />
    )}
    `
  );
});

app.get("/about", (c: Context) => {
  return c.html(
    `
    <!DOCTYPE html>
    ${(
      <Layout
        title="About DividendSpot"
        body={<About />}
        styles={["/public/styles/about.css"]}
        metaDescription="DividendSpot is the best platform to discover dividend data on all your favorite companies traded on the NYSE and NASDAQ exchanges"
        canonicalLink="https://dividendspot.com/about"
        ogData={null}
      />
    )}
    `
  );
});

app.get("/privacy-policy", (c: Context) => {
  return c.html(
    `
    <!DOCTYPE html>
    ${(
      <Layout
        title="Privacy Policy - DividendSpot"
        body={<PrivacyPolicy />}
        styles={["/public/styles/privacy.css"]}
        metaDescription="Privacy policy for DividendSpot"
        canonicalLink="https://dividendspot.com/privacy-policy"
        ogData={null}
      />
    )}
    `
  );
});

app.get("/companies", async (c: Context) => {
  const companies = await db.query(
    "SELECT name, ticker FROM companies ORDER BY name;"
  );

  OrganizeCompaniesList(companies.rows);

  return c.html(
    `
    <!DOCTYPE html>
    ${(
      <Layout
        title="Companies List | DividendSpot"
        body={
          <CompaniesList
            companies={OrganizeCompaniesList(companies.rows)}
            numOfCompanies={companies.rowCount}
          />
        }
        styles={null}
        metaDescription="Discover all companies featured on DividendSpot, search through the list and find the company you are looking for."
        canonicalLink="https://dividendspot.com/companies"
        ogData={null}
      />
    )}
    `
  );
});

app.get("/:COMPANY_TICKER", async (c: Context) => {
  const ticker = c.req.param("COMPANY_TICKER").toUpperCase(); // all tickers in DB are uppercase

  const cachedData = await SaveCompanyToCache(ticker, COMPANIES_CACHE);
  if (cachedData === "company_doesnt_exist") {
    return c.text("Cannot find company with ticker " + ticker, 404);
  }

  return c.html(
    `<!DOCTYPE html>
    ${(
      <Layout
        title={`${cachedData.cd.name} (${cachedData.cd.ticker}) Dividend History - DividendSpot`}
        body={<CompanyView cachedData={cachedData} />}
        styles={["/public/styles/company.css"]}
        metaDescription={
          cachedData.d === null
            ? null
            : cachedData.d.length > 0
            ? `Discover reliable dividend data for ${cachedData.cd.name} (${cachedData.cd.ticker}), including recent and upcoming payouts with detailed amounts`
            : `Currently ${cachedData.cd.name} (${cachedData.cd.ticker}) does not pay dividends. They might in the future so be sure to check back!`
        }
        canonicalLink={`https://dividendspot.com/${ticker.toLowerCase()}`}
        ogData={{
          title: `${cachedData.cd.name} (${cachedData.cd.ticker}) Dividend History - DividendSpot`,
          url: `https://dividendspot.com/${ticker.toLowerCase()}`,
          image: `https://dividendspot.com/public/imgs/company-logo/${ticker}.png`,
          description: `Discover reliable dividend data for ${cachedData.cd.name} ${cachedData.cd.ticker}, including recent and upcoming payouts with detailed amounts. Stay informed on dividend trends to make smart investment decisions.`,
        }}
      />
    )}
   `
  );
});

Deno.serve(app.fetch);
