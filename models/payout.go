package models

import (
	polygonresponses "dividendspot/models/polygon_responses"
	"strings"
)

type SinglePayout struct {
	Ticker   string
	Dividend polygonresponses.TickerDividend
}

func (p SinglePayout) LowerTicker() string {
	return strings.ToLower(p.Ticker)
}
