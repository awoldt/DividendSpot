package polygonresponses

import (
	"time"
)

type TickerDividendResponse struct {
	Results []TickerDividend `json:"results"`
}

type TickerDividend struct {
	Amount          float64 `json:"cash_amount"`
	DeclarationDate string  `json:"declaration_date"`
	ExDividendDate  string  `json:"ex_dividend_date"`
	Frequency       int     `json:"frequency"`
	PayDate         string  `json:"pay_date"`
	RecordDate      string  `json:"record_date"`
}

func (d TickerDividend) DaysAwayFromPayout() int {
	t, err := time.Parse("2006-01-02", d.PayDate)
	if err != nil {
		return -1
	}

	today := time.Now().Truncate(24 * time.Hour)
	if t.Before(today) {
		return -1
	}

	diff := t.Sub(today).Hours() / 24
	return int(diff)
}
