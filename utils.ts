import axios from "axios";
import type {
  Company,
  CompanyCache,
  Dividend,
  OrganizedDividends,
} from "./types.ts";
import { db } from "./db.ts";

const cacheTimeoutMS = 43200000; // 12hrs

export async function GetCompanyDividends(
  ticker: string
): Promise<Dividend[] | null> {
  try {
    const req = await axios.get(
      `https://api.polygon.io/v3/reference/dividends?ticker=${ticker}&limit=1000&sort=pay_date&apiKey=${Deno.env.get(
        "POLYGON_API_KEY"
      )}`
    );

    return req.data.results.map((x: any) => {
      return {
        amount: x.cash_amount,
        ex_dividend_date: x.ex_dividend_date,
        record_date: x.record_date,
        pay_date: x.pay_date,
      };
    });
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function GetDividendPayingYears(dividends: Dividend[] | null) {
  // gets the number of years a company has been paying dividends

  if (dividends === null) {
    return null;
  }

  // filter out where pay_date could be undefined (rare, will throw 500 error)
  const validDividends = dividends.filter((x) => x.pay_date !== undefined);

  const uniqueYears: number[] = [];
  for (let i = 0; i < validDividends.length; i++) {
    const year = Number(validDividends[i].pay_date.split("-")[0]);
    if (!uniqueYears.includes(year)) {
      uniqueYears.push(year);
    }
  }

  return Math.max(...uniqueYears) - Math.min(...uniqueYears);
}

export function OrganizeDividendPayouts(dividends: Dividend[] | null) {
  /*
  Split dividend payouts into 3 categories:

  1. Today's payout
  2. Upcoming payouts
  3. Recent payouts
*/

  if (dividends === null) {
    return null;
  }

  const today = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );

  const d: OrganizedDividends = { today: null, upcoming: [], recent: [] };
  for (let i = 0; i < dividends.length; i++) {
    if (new Date(dividends[i].pay_date) > today) {
      d.upcoming.push(dividends[i]);
    } else if (new Date(dividends[i].pay_date) < today) {
      d.recent.push(dividends[i]);
    } else {
      d.today = dividends[i];
    }
  }

  return d;
}

export function RemainingDays(upcomingDividend: string) {
  /*
    Gets the number of days remaining for a date in the future

    So if today is jan 1st, jan 3rd would be 2 days away
  */

  const upcomingDate = new Date(upcomingDividend).getTime();
  const currentDate = new Date().getTime();

  const msDiff = upcomingDate - currentDate;
  return Math.ceil(msDiff / 86400000); // Changed Math.floor to Math.ceil
}

export async function GetRelatedCompanies(
  ticker: string
): Promise<Partial<Company>[] | null> {
  try {
    const req = await axios.get(
      `https://api.polygon.io/v1/related-companies/${ticker.toUpperCase()}?apiKey=${Deno.env.get(
        "POLYGON_API_KEY"
      )}`
    );

    // company doesnt have any related stocks, return popular stocks
    if (req.data.results === undefined) {
      return [
        { name: "Apple Inc.", ticker: "AAPL" },
        { name: "Microsoft Corporation", ticker: "MSFT" },
        { name: "Johnson & Johnson", ticker: "JNJ" },
        { name: "Procter & Gamble Co.", ticker: "PG" },
        { name: "Coca-Cola Co.", ticker: "KO" },
        { name: "PepsiCo, Inc.", ticker: "PEP" },
        { name: "Exxon Mobil Corporation", ticker: "XOM" },
        { name: "Verizon Communications Inc.", ticker: "VZ" },
        { name: "AT&T Inc.", ticker: "T" },
        { name: "Chevron Corporation", ticker: "CVX" },
      ];
    }

    const tickers = req.data.results.map((x: any) => x.ticker);
    const companies = await db.query(
      `SELECT name, ticker FROM companies WHERE ticker = ANY($1) ORDER BY name;`,
      [tickers]
    );

    // now remove duplicate companies
    // for ex: googl and goog can both be returned, they look the same on user end even though different stocks
    const uniqueCompanies: Partial<Company>[] = [];
    for (let i = 0; i < companies.rows.length; i++) {
      if (
        uniqueCompanies.find((x) => x.name === companies.rows[i].name) ===
        undefined
      ) {
        uniqueCompanies.push(companies.rows[i]);
      }
    }

    return uniqueCompanies;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function FormatDateString(dateString: string) {
  /*
  this function will prevent js stupid ass auto time zone convert of times with date object

  before, new Date(2024-05-23) would be "may 22nd, 2024" as it will apply my local time zone shift, which is 5 hours behind

  manually plugging in the values like new Date(2024, 05, 23) prevents this stupid shit from happening 
  */

  const [year, month, day] = dateString.split("-");

  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function SaveCompanyToCache(
  ticker: string,
  cache: CompanyCache[]
) {
  // saves data in cache for company... DONT have to hit polygon OR supabase db for each request

  const index = cache.findIndex((x) => x.cd.ticker === ticker);

  // company stored in cache!
  if (index !== -1) {
    const currentTime = Date.now();

    // if cache is older than 3 hours, refresh
    if (cache[index].ea < currentTime) {
      const company = await db.query(
        "SELECT * FROM companies WHERE ticker = $1;",
        [ticker]
      );

      if (company.rowCount === 0) {
        return "company_doesnt_exist";
      }

      const refreshedData: CompanyCache = {
        cd: {
          name: company.rows[0].name,
          ticker: company.rows[0].ticker,
          description: company.rows[0].description,
          website_url: company.rows[0].website_url,
          address: company.rows[0].address,
          phone: company.rows[0].phone,
          news: await GetCompanyNews(ticker),
        },
        d: await GetCompanyDividends(ticker),
        rc: await GetRelatedCompanies(ticker),
        ea: currentTime + cacheTimeoutMS,
        ca: currentTime,
      };

      cache[index] = refreshedData;

      return refreshedData;
    }

    return cache[index];
  }
  // copmany not in cache
  // store data in cache
  else {
    const company = await db.query(
      "SELECT * FROM companies WHERE ticker = $1;",
      [ticker]
    );

    if (company.rowCount === 0) {
      return "company_doesnt_exist";
    }

    const currentTime = Date.now();

    const newCache = {
      cd: {
        name: company.rows[0].name,
        ticker: company.rows[0].ticker,
        description: company.rows[0].description,
        website_url: company.rows[0].website_url,
        address: company.rows[0].address,
        phone: company.rows[0].phone,
        news: await GetCompanyNews(ticker),
      },
      d: await GetCompanyDividends(ticker),
      rc: await GetRelatedCompanies(ticker),
      ea: currentTime + cacheTimeoutMS,
      ca: currentTime,
    };

    cache.push(newCache);

    return newCache;
  }
}

export async function GetCompanyNews(ticker: string) {
  try {
    const req = await axios.get(
      `https://api.polygon.io/v2/reference/news?ticker=${ticker}&limit=5&apiKey=${Deno.env.get(
        "POLYGON_API_KEY"
      )}`
    );

    if (req.data.results.length === 0) {
      return null;
    }

    return req.data.results.map((x: any) => {
      return {
        publisher_name: x.publisher.name,
        publisher_logo: x.publisher.logo_url,
        title: x.title,
        published_at_utc: x.published_utc,
        url: x.article_url,
        thumbnail: x.image_url,
        description: x.description,
        keywords: x.keywords,
      };
    });
  } catch (error) {
    console.log(error);
    return null;
  }
}
