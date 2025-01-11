import { Hono, type Context } from "hono";
import CompanyView from "./views/company.tsx";
import { SaveCompanyToCache } from "./utils.ts";
import { serveStatic } from "hono/bun";
import PrivacyPolicy from "./views/privacyPolicy.tsx";
import type { CompanyCache } from "./types.ts";
import Layout from "./components/layout.tsx";
import About from "./views/about.tsx";
import Home from "./views/index.tsx";
import { db } from "./db.ts";
import DiscoverPage from "./views/discover.tsx";
import { readFileSync } from "fs";

const COMPANIES_CACHE: CompanyCache[] = [];

const app = new Hono();

app.use("/public/*", serveStatic({ root: "./" }));

app.get("/robots.txt", (c: Context) => {
  return c.text(`User-agent: *
Disallow:

Sitemap: https://dividendspot.com/sitemap.xml
`);
});

app.get("/ads.txt", (c: Context) => {
  return c.text("google.com, pub-4106301283765460, DIRECT, f08c47fec0942fa0");
});

app.get("/sitemap.xml", async (c: Context) => {
  try {
    const file = readFileSync("./views/sitemap.xml", "utf8");
    return c.body(file, 200, {
      "Content-Type": "application/xml",
    });
  } catch (error) {
    console.error("Error reading sitemap.xml:", error);
    return c.text("Error loading sitemap.xml", 500);
  }
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
        metaDescription="DividendSpot is the best platform to discover dividend data on all your favorite companies traded on the NYSE and NASDAQ exchanges"
        canonicalLink="https://dividendspot.com"
        ogData={null}
        includeAds={true}
      />
    )}
    `
  );
});

app.get("/discover", (c: Context) => {
  return c.html(
    `
    <!DOCTYPE html>
    ${(
      <Layout
        title="Popular Companies Paying Dividends"
        body={<DiscoverPage />}
        metaDescription="Discover some of your favorite companies that pay dividends, across all major industries of the economy."
        canonicalLink="https://dividendspot.com/discover"
        ogData={null}
        includeAds={true}
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
        metaDescription="DividendSpot is the best platform to discover dividend data on all your favorite companies traded on the NYSE and NASDAQ exchanges"
        canonicalLink="https://dividendspot.com/about"
        ogData={null}
        includeAds={false}
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
        metaDescription="Privacy policy for DividendSpot"
        canonicalLink="https://dividendspot.com/privacy-policy"
        ogData={null}
        includeAds={false}
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
        title={`${cachedData.company_data.name} (${cachedData.company_data.ticker}) Dividend History - DividendSpot`}
        body={<CompanyView cachedData={cachedData} />}
        metaDescription={
          cachedData.dividend_data === null
            ? null
            : cachedData.dividend_data.length > 0
            ? `Discover reliable dividend data for ${cachedData.company_data.name} (${cachedData.company_data.ticker}), including recent and upcoming payouts with detailed amounts`
            : `Currently ${cachedData.company_data.name} (${cachedData.company_data.ticker}) does not pay dividends. They might in the future so be sure to check back!`
        }
        canonicalLink={`https://dividendspot.com/${ticker.toLowerCase()}`}
        ogData={{
          title: `${cachedData.company_data.name} (${cachedData.company_data.ticker}) Dividend History - DividendSpot`,
          url: `https://dividendspot.com/${ticker.toLowerCase()}`,
          image: `https://dividendspot.com/public/imgs/company-logo/${ticker}.png`,
          description: `Discover reliable dividend data for ${cachedData.company_data.name} ${cachedData.company_data.ticker}, including recent and upcoming payouts with detailed amounts. Stay informed on dividend trends to make smart investment decisions.`,
        }}
        includeAds={true}
      />
    )}
   `
  );
});

Bun.serve({
  fetch: app.fetch,
  port: 8080,
});
