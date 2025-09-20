package models

type RelatedTickersResponse struct {
	Results []RelatedTicker `json:"results"`
}

type RelatedTicker struct {
	Ticker string `json:"ticker"`
	Name   string `json:"name"`
}
