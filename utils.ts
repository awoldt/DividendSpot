import axios from "axios";
import type {
  Company,
  CompanyCache,
  Dividend,
  OrganizedDividends,
} from "./types.ts";
import { db } from "./db.ts";

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

  const uniqueYears: number[] = [];
  for (let i = 0; i < dividends.length; i++) {
    const year = Number(dividends[i].pay_date.split("-")[0]);
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
  return Math.floor(msDiff / 86400000);
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
  const index = cache.findIndex((x) => x.t === ticker);

  // company stored in cache!
  if (index !== -1) {
    console.log(
      "COMPANY IN CAHCE!\nexpirs at " + new Date(cache[index].ea).toUTCString()
    );

    const currentTime = Date.now();

    // if cache is older than 3 hours, refresh
    if (cache[index].ea < currentTime) {
      console.log("NEED TO REFRESH CACHE FOR THIS COMPANY!");

      const refreshedData = {
        t: ticker,
        d: await GetCompanyDividends(ticker),
        rc: await GetRelatedCompanies(ticker),
        ea: currentTime + 10800000, // 3 hrs
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
    console.log("company not in cache :(");

    const currentTime = Date.now();
    const newCache = {
      t: ticker,
      d: await GetCompanyDividends(ticker),
      rc: await GetRelatedCompanies(ticker),
      ea: currentTime + 10800000, // 3 hrs
      ca: currentTime,
    };

    cache.push(newCache);
    console.log("now in cache!");

    return newCache;
  }
}
