package models

type TickerDividendsResponse struct {
	Results []TickerDividends `json:"results"`
}

type TickerDividends struct {
	Amount          float64 `json:"cash_amount"`
	DeclarationDate string  `json:"declaration_date"`
	ExDividendDate  string  `json:"ex_dividend_date"`
	Frequency       int     `json:"frequency"`
	PayDate         string  `json:"pay_date"`
	RecordDate      string  `json:"record_date"`
}
