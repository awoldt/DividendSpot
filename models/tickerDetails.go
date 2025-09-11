package models

import (
	"fmt"
	"os"
)

type TickerDetailsResponse struct {
	Results TickerDetails `json:"results"`
}

type Address struct {
	Address    string `json:"address1"`
	City       string `json:"city"`
	PostalCode string `json:"postal_code"`
	State      string `json:"state"`
}

type TickerDetails struct {
	LastUpdated int     `json:"last_updated"` // only update the ticker details every 24hrs
	Name        string  `json:"name"`
	Ticker      string  `json:"ticker"`
	Address     Address `json:"address"`
	Website     string  `json:"homepage_url"`
	Phone       string  `json:"phone_number"`
	Description string  `json:"description"`

	Dividends      []TickerDividend `json:"dividends"`
	DividendYield  float64          `json:"dividend_yield"`
	RelatedTickers []RelatedTicker  `json:"related_tickers"`
}

func (t TickerDetails) GetTickerDividendFrequencyString() string {
	// if no dividends, return empty string
	if len(t.Dividends) == 0 {
		return ""
	}

	f := t.Dividends[0].Frequency

	switch f {
	case 1:
		return "Yearly"
	case 4:
		return "Quarterly"
	case 6:
		return "Biannually"
	case 12:
		return "Monthly"
	default:
		return ""
	}
}

func (t TickerDetails) HasCompanyLogo() bool {
	// this will read from the public folder and find out if this ticker has a img
	// if not dont render the img tag on the client

	if _, err := os.Stat(fmt.Sprintf("./public/imgs/logos/%v.png", t.Ticker)); err != nil {
		return false
	}

	return true
}
