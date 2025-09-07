package constants

import (
	"encoding/json"
	"net/http"
	"os"
)

type TickerDescription struct {
	Ticker      string `json:"ticker"`
	Description string `json:"description"`
}

type SupportedTicker struct {
	Ticker string `json:"ticker"`
	Name   string `json:"name"`
}

var TickerDescriptions = make(map[string]string)
var SupportedTickers = make(map[string]string)

func init() {
	// load all json files into memory needed for app
	tickerDescriptions, err := os.ReadFile("misc/ticker_descriptions.json")
	if err != nil {
		panic(err.Error())
	}

	supportedTickers, err := os.ReadFile("misc/supported_tickers.json")
	if err != nil {
		panic(err.Error())
	}

	var descriptions []TickerDescription
	err = json.Unmarshal(tickerDescriptions, &descriptions)
	if err != nil {
		panic("error while loading ticker descriptions into memory")
	}

	var supported []SupportedTicker
	err = json.Unmarshal(supportedTickers, &supported)
	if err != nil {
		panic("error while loading supported tickers into memory")
	}

	for _, v := range descriptions {
		TickerDescriptions[v.Ticker] = v.Description
	}

	for _, v := range supported {
		SupportedTickers[v.Ticker] = v.Name
	}
}

type Styles struct {
	Link string
}

type Head struct {
	Title  string
	Styles []Styles
}

var OneDayInSeconds int64 = 86400

func ErrorResponse(w http.ResponseWriter, msg string) {
	w.WriteHeader(500)
	w.Write([]byte(msg))
}
