package polygonresponses

import "strings"

type RelatedTickersResponse struct {
	Results []RelatedTicker `json:"results"`
}

type RelatedTicker struct {
	Ticker string `json:"ticker"`
	Name   string `json:"name"`
}

func (r RelatedTicker) LowerTicker() string {
	return strings.ToLower(r.Ticker)
}
