package services

import (
	"dividendspot/constants"
	"encoding/json"
	"fmt"
	"net/http"
	"slices"
	"strconv"
	"time"
)

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

	Dividends      []TickerDividends `json:"dividends"`
	DividendYield  float64           `json:"dividend_yield"`
	RelatedTickers []RelatedTicker   `json:"related_tickers"`
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

type TickerDividends struct {
	Amount          float64 `json:"cash_amount"`
	DeclarationDate string  `json:"declaration_date"`
	ExDividendDate  string  `json:"ex_dividend_date"`
	Frequency       int     `json:"frequency"`
	PayDate         string  `json:"pay_date"`
	RecordDate      string  `json:"record_date"`
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
}

type RelatedTicker struct {
	Ticker string `json:"ticker"`
	Name   string `json:"name"`
}

type TickerDividendsResponse struct {
	Results []TickerDividends `json:"results"`
}

type TickerDetailsResponse struct {
	Results TickerDetails `json:"results"`
}

type TickerPriceResponse struct {
	Ticker TickerPrice `json:"ticker"`
}

type RelatedTickersResponse struct {
	Results []RelatedTicker `json:"results"`
}

var TickerCache = make(map[string]*TickerDetails)

func GetTickerDetails(ticker string, polygonApiKey string) (*TickerDetails, error) {
	// this function will send a request to get basic ticker data
	// it will also determine if the site supports a ticker (404 means we dont)

	// see if this ticker is stored in the global SupportedTickers map
	_, ok := constants.SupportedTickers[ticker]
	if !ok {
		return &TickerDetails{}, fmt.Errorf("error this ticker is not supported")
	}

	url := fmt.Sprintf("https://api.polygon.io/v3/reference/tickers/%v?apiKey=%v", ticker, polygonApiKey)
	res, err := http.Get(url)
	if err != nil {
		return &TickerDetails{}, fmt.Errorf("error while fetching ticker details")
	}

	defer res.Body.Close()

	if res.StatusCode != 200 {
		return &TickerDetails{}, fmt.Errorf("ticker doesnt exist")
	}

	var tickerDetails TickerDetailsResponse
	json.NewDecoder(res.Body).Decode(&tickerDetails)

	details := tickerDetails.Results
	details.LastUpdated = int(time.Now().Unix())
	details.Description = constants.TickerDescriptions[ticker]
	TickerCache[ticker] = &details // ADD THIS TICKER TO CACHE

	return &details, nil
}

func GetTickerDividends(cachedTicker *TickerDetails, polygonApiKey string) error {

	// if theres dividends already stored AND its still valid.. return
	if cachedTicker.Dividends != nil && int64(cachedTicker.LastUpdated)+constants.OneDayInSeconds > time.Now().Unix() {
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
	}

	var dividends TickerDividendsResponse
	json.NewDecoder(res.Body).Decode(&dividends)
	cachedTicker.Dividends = dividends.Results

	return nil
}

func GetTickerDivYield(cachedTicker *TickerDetails, dividends []TickerDividends, polygonApiKey string) error {
	// div yield is (total $ in divs a year / current ticker price)

	url := fmt.Sprintf("https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/%v?apiKey=%v", cachedTicker.Ticker, polygonApiKey)
	res, err := http.Get(url)
	if err != nil {
		return fmt.Errorf("error while fetching ticker price")
	}

	defer res.Body.Close()

	if res.StatusCode != 200 {
		return fmt.Errorf("error while fetching ticker price")
	}

	var tickerPrice TickerPriceResponse
	json.NewDecoder(res.Body).Decode(&tickerPrice)

	frequency := 4 // defaults to quarterly, if not then set it
	if len(dividends) != 0 {
		frequency = dividends[0].Frequency
	}

	var divAmounts []float64

	for i := 0; i < frequency; i++ {
		if i >= len(dividends) {
			break
		}
		divAmounts = append(divAmounts, dividends[i].Amount)
	}

	var divSum float64
	for _, v := range divAmounts {
		divSum += v
	}

	// sometimes polygon will have day price set as 0, if so take prevDay
	currentPrice := 0.0
	if tickerPrice.Ticker.Day.Close != 0 {
		currentPrice = tickerPrice.Ticker.Day.Close
	} else {
		currentPrice = tickerPrice.Ticker.PrevDay.Close
	}

	fixed := fmt.Sprintf("%.2f", divSum/currentPrice*100)
	fixedNum, err := strconv.ParseFloat(fixed, 64)

	if err != nil {
		return fmt.Errorf("error converting string to num")
	}

	cachedTicker.DividendYield = float64(fixedNum)
	return nil
}

func GetTickerRelatedCompanies(cachedTicker *TickerDetails, polygonApiKey string, supportedTickers map[string]string) error {
	url := fmt.Sprintf("https://api.polygon.io/v1/related-companies/%v?apiKey=%v", cachedTicker.Ticker, polygonApiKey)
	res, err := http.Get(url)
	if err != nil {
		return fmt.Errorf("error while fetching ticker price")
	}

	defer res.Body.Close()

	if res.StatusCode != 200 {
		return fmt.Errorf("error while fetching ticker price")
	}

	var relatedTickers RelatedTickersResponse
	json.NewDecoder(res.Body).Decode(&relatedTickers)

	// make sure each related ticker is supported
	var supportedRelatedTickers []RelatedTicker
	for _, v := range relatedTickers.Results {
		// make this company is not already part of slice
		alreadyAdded := false
		for _, srt := range supportedRelatedTickers {
			if srt.Ticker == v.Ticker {
				alreadyAdded = true
				break
			}
		}
		if alreadyAdded {
			continue
		}

		if s, ok := supportedTickers[v.Ticker]; ok {
			supportedRelatedTickers = append(supportedRelatedTickers, RelatedTicker{Name: s, Ticker: v.Ticker})
		}
	}

	// sort by company name DESC
	slices.SortFunc(supportedRelatedTickers, func(a, b RelatedTicker) int {
		if a.Name < b.Name {
			return -1
		}
		if a.Name > b.Name {
			return 1
		}
		return 0
	})

	cachedTicker.RelatedTickers = supportedRelatedTickers
	return nil
}
