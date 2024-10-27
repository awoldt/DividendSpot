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

  const cachedData = await SaveCompanyToCache(ticker, COMPANIES_CACHE);
  if (cachedData === "company_doesnt_exist") {
    return c.text("Cannot find company with ticker " + ticker, 404);
  }

  return c.html(
    <Layout
      title={`${cachedData.cd.name} (${cachedData.cd.ticker}) Dividend History - DividendSpot`}
      body={<CompanyView cachedData={cachedData} company={cachedData.cd} />}
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
  );
});

Deno.serve(app.fetch);
