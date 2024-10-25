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
}

export interface OrganizedDividends {
  today: Dividend | null;
  upcoming: Dividend[];
  recent: Dividend[];
}

export interface CompanyCache {
  t: string; // ticker
  d: Dividend[] | null; // dividend data
  rc: Partial<Company>[] | null; // related companies,
  ea: number; // expires at
  ca: number; // created at
}
