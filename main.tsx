import { Hono, type Context } from "hono";
import CompanyView from "./views/company.tsx";
import { GetCompanyDividends, GetRelatedCompanies } from "./utils.ts";
import { db } from "./db.ts";
import { serveStatic } from "hono/deno";
import CompaniesList from "./views/companiesList.tsx";

const app = new Hono();

app.use("/public/*", serveStatic({ root: "./" }));

app.get("/", async (c: Context) => {
  return c.text("dividends app");
});

app.get("/companies", async (c: Context) => {
  const allCompanies = await db.query(
    "SELECT name, ticker FROM companies ORDER BY name;"
  );

  return c.html(<CompaniesList companies={allCompanies.rows} />);
});

app.get("/:COMPANY_TICKER", async (c: Context) => {
  const ticker = c.req.param("COMPANY_TICKER").toUpperCase(); // all tickers in DB are uppercase
  const company = await db.query("SELECT * FROM companies WHERE ticker = $1;", [
    ticker,
  ]);

  if (company.rowCount === 0) {
    return c.text("Company does not exist", 404);
  }

  return c.html(
    <CompanyView
      dividends={await GetCompanyDividends(ticker)}
      company={company.rows[0]}
      relatedCompanies={await GetRelatedCompanies(ticker)}
    />
  );
});

Deno.serve(app.fetch);
