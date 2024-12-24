import axios from "axios";
import type {
  Company,
  CompanyCache,
  Dividend,
  News,
  OrganizedDividends,
} from "./types.ts";
import { db } from "./db.ts";

const cacheTimeoutMS = 43200000; // 12hrs

export async function GetCompanyDividends(
  ticker: string
): Promise<Dividend[] | null> {
  try {
    const req = await axios.get(
      `https://api.polygon.io/v3/reference/dividends?ticker=${ticker}&limit=1000&sort=pay_date&apiKey=${process.env.POLYGON_API_KEY}`
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
  if (dividends === null) {
    return null;
  }

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
    if (
      dividends[i].pay_date ===
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(today.getDate()).padStart(2, "0")}`
    ) {
      d.today = dividends[i];
      continue;
    }

    if (new Date(dividends[i].pay_date) > today) {
      d.upcoming.push(dividends[i]);
    } else if (new Date(dividends[i].pay_date) < today) {
      d.recent.push(dividends[i]);
    }
  }

  return d;
}

export function RemainingDays(upcomingDividend: string) {
  const upcomingDate = new Date(upcomingDividend).getTime();
  const currentDate = new Date().getTime();

  const msDiff = upcomingDate - currentDate;
  return Math.ceil(msDiff / 86400000);
}

export async function GetRelatedCompanies(
  ticker: string
): Promise<Partial<Company>[] | null> {
  try {
    const req = await axios.get(
      `https://api.polygon.io/v1/related-companies/${ticker.toUpperCase()}?apiKey=${
        process.env.POLYGON_API_KEY
      }`
    );

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
  const index = cache.findIndex((x) => x.cd.ticker === ticker);

  if (index !== -1) {
    const currentTime = Date.now();

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
  } else {
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

export async function GetCompanyNews(ticker: string): Promise<News[] | null> {
  try {
    const req = await axios.get(
      `https://api.polygon.io/v2/reference/news?ticker=${ticker}&limit=3&apiKey=${process.env.POLYGON_API_KEY}`
    );

    if (req.data.results.length === 0) {
      return null;
    }

    const tickers: string[] = [];
    req.data.results.forEach((e: any) => {
      e.tickers &&
        e.tickers.length > 0 &&
        e.tickers.forEach((z: any) => {
          tickers.push(z);
        });
    });

    let a = "";
    tickers.forEach((e) => {
      a += "'" + e + "',";
    });
    a = a.slice(0, a.length - 1);

    const validTickers = await db.query(
      `SELECT ticker FROM companies WHERE ticker IN (${a});`
    );

    const t = validTickers.rows.map((x: any) => x.ticker);

    return req.data.results.map((x: any) => {
      return {
        publisher_name: x.publisher.name,
        publisher_logo: x.publisher.logo_url,
        title: x.title,
        published_at_utc: x.published_utc,
        url: x.article_url,
        thumbnail: x.image_url,
        description:
          x.description.length > 500
            ? x.description.slice(0, 500) + "..."
            : x.description,
        keywords: x.keywords,
        included_tickers: x.tickers.filter(
          (y: string) => t.includes(y) && y !== ticker
        ),
      };
    });
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function OrganizeCompaniesList(
  companies: { name: string; ticker: string }[]
) {
  const list: {
    section: string;
    companies: { name: string; ticker: string }[];
  }[] = [];

  const findOrCreateSection = (sectionName: string) => {
    let section = list.find((sec) => sec.section === sectionName);
    if (!section) {
      section = { section: sectionName, companies: [] };
      list.push(section);
    }
    return section;
  };

  for (let i = 0; i < companies.length; i++) {
    const firstChar = companies[i].name[0].toUpperCase();

    if (isNaN(parseInt(firstChar, 10))) {
      const section = findOrCreateSection(firstChar);
      section.companies.push(companies[i]);
    } else {
      const section = findOrCreateSection("Other");
      section.companies.push(companies[i]);
    }
  }

  const otherSection = list.find((x) => x.section === "Other");
  const otherSectionIndex = list.findIndex((x) => x.section === "Other");
  if (otherSection !== undefined) {
    list.push(otherSection);
  }

  if (otherSectionIndex !== -1) {
    list.splice(otherSectionIndex, 1);
  }

  return list;
}
