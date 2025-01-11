export interface Dividend {
  amount: number;
  ex_dividend_date: string;
  pay_date: string;
  record_date: string;
}

export interface Company {
  name: string;
  ticker: string;
  description: string | null;
  website_url: string | null;
  address: string | null;
  phone: string | null;
  news: News[] | null;
}

export interface News {
  publisher_name: string;
  publisher_logo: string;
  title: string;
  published_at_utc: string;
  url: string;
  thumbnail: string;
  description: string;
  keywords: string[];
  included_tickers: string[]; // all tickers included in article
}

export interface OrganizedDividends {
  today: Dividend | null;
  upcoming: Dividend[];
  recent: Dividend[];
}

export interface CompanyCache {
  company_data: Company;
  dividend_data: Dividend[] | null;
  related_companies: Partial<Company>[] | null;
  cache_expires_at: number;
  cache_created_at: number;
  upcominng_dividend_message: string | null;
}
