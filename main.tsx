import { Hono, type Context } from "hono";
import CompanyView from "./views/company.tsx";
import { SaveCompanyToCache } from "./utils.ts";
import { db } from "./db.ts";
import { serveStatic } from "hono/deno";
import CompaniesList from "./views/companiesList.tsx";
import PrivacyPolicy from "./views/privacyPolicy.tsx";
import type { CompanyCache } from "./types.ts";
import Layout from "./components/layout.tsx";
import About from "./views/about.tsx";
import Home from "./views/index.tsx";

const COMPANIES_CACHE: CompanyCache[] = [];

const app = new Hono();

app.use("/public/*", serveStatic({ root: "./" }));

app.get("/robots.txt", (c: Context) => {
  return c.text(`User-agent: *
Disallow:
`);
});

app.get("/", (c: Context) => {
  return c.html(
    <Layout
      title="DividendSpot - Discover Dividend Data on All your Favorite Companies"
      body={<Home />}
      styles={["/public/styles/index.css"]}
      metaDescription="DividendSpot is the best platform to discover dividend data on all your favorite companies traded on the NYSE and NASDAQ exchanges"
      canonicalLink="https://dividendspot.com"
      ogData={null}
    />
  );
});

app.get("/about", (c: Context) => {
  return c.html(
    <Layout
      title="About DividendSpot"
      body={<About />}
      styles={["/public/styles/about.css"]}
      metaDescription="DividendSpot is the best platform to discover dividend data on all your favorite companies traded on the NYSE and NASDAQ exchanges"
      canonicalLink="https://dividendspot.com/about"
      ogData={null}
    />
  );
});

app.get("/privacy-policy", (c: Context) => {
  return c.html(
    <Layout
      title="Privacy Policy - DividendSpot"
      body={<PrivacyPolicy />}
      styles={["/public/styles/privacy.css"]}
      metaDescription="Privacy policy for DividendSpot"
      canonicalLink="https://dividendspot.com/privacy-policy"
      ogData={null}
    />
  );
});

app.get("/companies", async (c: Context) => {
  const allCompanies = await db.query(
    "SELECT name, ticker FROM companies ORDER BY name;"
  );

  return c.html(
    <Layout
      title="All companies"
      body={<CompaniesList companies={allCompanies.rows} />}
      styles={["/public/styles/company-list.css"]}
      metaDescription="Discover all companies featured on DividendSpot. We offer companies from the NASDAQ and NYSE exchanges."
      canonicalLink="https://dividendspot.com/companies"
      ogData={null}
    />
  );
});

app.get("/:COMPANY_TICKER", async (c: Context) => {
  const ticker = c.req.param("COMPANY_TICKER").toUpperCase(); // all tickers in DB are uppercase
  const company = await db.query("SELECT * FROM companies WHERE ticker = $1;", [
    ticker,
  ]);

  if (company.rowCount === 0) {
    return c.text("Company does not exist", 404);
  }

  const cachedData = await SaveCompanyToCache(ticker, COMPANIES_CACHE);

  return c.html(
    <Layout
      title={`${company.rows[0].name} (${company.rows[0].ticker}) Dividend History - DividendSpot`}
      body={<CompanyView cachedData={cachedData} company={company.rows[0]} />}
      styles={["/public/styles/company.css"]}
      metaDescription={`Discover reliable dividend data for ${company.rows[0].name} ${company.rows[0].ticker}, including recent and upcoming payouts with detailed amounts. Stay informed on dividend trends to make smart investment decisions.`}
      canonicalLink={`https://dividendspot.com/${ticker.toLowerCase()}`}
      ogData={{
        title: `${company.rows[0].name} (${company.rows[0].ticker}) Dividend History - DividendSpot`,
        url: `https://dividendspot.com/${ticker.toLowerCase()}`,
        image: `https://dividendspot.com/public/imgs/company-logo/${ticker}.png`,
        description: `Discover reliable dividend data for ${company.rows[0].name} ${company.rows[0].ticker}, including recent and upcoming payouts with detailed amounts. Stay informed on dividend trends to make smart investment decisions.`,
      }}
    />
  );
});

Deno.serve(app.fetch);
