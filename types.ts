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

interface News {
  publisher_name: string;
  publisher_logo: string;
  title: string;
  published_at_utc: string;
  url: string;
  thumbnail: string;
  description: string;
  keywords: string[];
}

export interface OrganizedDividends {
  today: Dividend | null;
  upcoming: Dividend[];
  recent: Dividend[];
}

export interface CompanyCache {
  cd: Company; // company data (stored in supabase)
  d: Dividend[] | null; // dividend data
  rc: Partial<Company>[] | null; // related companies,
  ea: number; // expires at
  ca: number; // created at
}
