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
