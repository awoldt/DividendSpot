package models

type TickerPriceResponse struct {
	Ticker TickerPrice `json:"ticker"`
}

type DayPrice struct {
	Open   float64 `json:"o"`
	High   float64 `json:"h"`
	Low    float64 `json:"l"`
	Close  float64 `json:"c"`
	Volume float64 `json:"v"`
}

type TickerPrice struct {
	TodaysChangePercentage float64  `json:"todaysChangePerc"`
	TodaysChange           float64  `json:"todaysChange"`
	Day                    DayPrice `json:"day"`
	PrevDay                DayPrice `json:"prevDay"`
	UpdatedAt              int64    `json:"updated"` // nanosecond timestamp
}
