package services

import (
	"dividendspot/constants"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type Address struct {
	Address    string `json:"address1"`
	City       string `json:"city"`
	PostalCode string `json:"postal_code"`
	State      string `json:"state"`
}

type TickerDetails struct {
	Name    string  `json:"name"`
	Ticker  string  `json:"ticker"`
	Address Address `json:"address"`
	Website string  `json:"homepage_url"`
	Phone   string  `json:"phone_number"`

	DividendsLastUpdated int64             `json:"dividends_last_updated"`
	Dividends            []TickerDividends `json:"dividends"`
}

type TickerDividends struct {
	Amount          float32 `json:"cash_amount"`
	DeclarationDate string  `json:"declaration_date"`
	ExDividendDate  string  `json:"ex_dividend_date"`
	Frequency       int8    `json:"frequency"`
	PayDate         string  `json:"pay_date"`
	RecordDate      string  `json:"record_date"`
}

type TickerDividendsResponse struct {
	Results []TickerDividends `json:"results"`
}

type TickerDetailsResponse struct {
	Results TickerDetails `json:"results"`
}

var tickerCache = make(map[string]TickerDetails)

func GetTickerDetails(ticker string, polygonApiKey string) (TickerDetails, error) {
	// this function will send a request to get basic ticker data
	// it will also determine if the site supports a ticker (404 means we dont)
	// tickers that are supported will be stored in the cache so they never have to be fetched again

	// see if ticker in cache first and return instantly if so
	data, ok := tickerCache[ticker]
	if ok {
		return data, nil
	}

	url := fmt.Sprintf("https://api.polygon.io/v3/reference/tickers/%v?apiKey=%v", ticker, polygonApiKey)
	res, err := http.Get(url)
	if err != nil {
		return TickerDetails{}, fmt.Errorf("error while fetching ticker details")
	}

	defer res.Body.Close()

	if res.StatusCode != 200 {
		return TickerDetails{}, fmt.Errorf("ticker doesnt exist")
	}

	var tickerDetails TickerDetailsResponse
	json.NewDecoder(res.Body).Decode(&tickerDetails)

	// add to cache so subsequent requests for this ticker dont need to hit polygon
	tickerCache[ticker] = tickerDetails.Results
	return tickerDetails.Results, nil
}

func GetTickerDividends(cachedTicker *TickerDetails, polygonApiKey string) error {

	// if theres dividends already stored AND its still valid.. return
	if cachedTicker.Dividends != nil && cachedTicker.DividendsLastUpdated+constants.OneDayInSeconds < time.Now().Unix() {
		return nil
	}

	url := fmt.Sprintf("https://api.polygon.io/v3/reference/dividends?ticker=%v&order=desc&limit=1000&sort=pay_date&apiKey=%v", cachedTicker.Ticker, polygonApiKey)
	res, err := http.Get(url)
	if err != nil {
		return fmt.Errorf("error while fetching ticker dividends")
	}
	defer res.Body.Close()

	if res.StatusCode != 200 {
		return fmt.Errorf("could not find dividends for ticker")
	} else {
		var dividends TickerDividendsResponse
		json.NewDecoder(res.Body).Decode(&dividends)
		cachedTicker.DividendsLastUpdated = time.Now().Unix()
		cachedTicker.Dividends = dividends.Results

		return nil
	}
}
