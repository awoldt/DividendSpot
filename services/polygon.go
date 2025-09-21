package services

import (
	"dividendspot/constants"
	"dividendspot/models"
	"encoding/json"
	"fmt"
	"net/http"
	"slices"
	"strconv"
	"strings"
	"time"
)

var TickerCache = make(map[string]*models.TickerDetails)

func GetTickerDetails(ticker string, polygonApiKey string) (*models.TickerDetails, error) {
	// this function will send a request to get basic ticker data
	// it will also determine if the site supports a ticker (404 means we dont)

	// see if this ticker is stored in the global SupportedTickers map
	_, ok := constants.SupportedTickers[ticker]
	if !ok {
		return &models.TickerDetails{}, fmt.Errorf("error this ticker is not supported")
	}

	url := fmt.Sprintf("https://api.polygon.io/v3/reference/tickers/%v?apiKey=%v", ticker, polygonApiKey)
	res, err := http.Get(url)
	if err != nil {
		return &models.TickerDetails{}, fmt.Errorf("error while fetching ticker details")
	}

	defer res.Body.Close()

	if res.StatusCode != 200 {
		return &models.TickerDetails{}, fmt.Errorf("ticker doesnt exist")
	}

	var tickerDetails models.TickerDetailsResponse
	json.NewDecoder(res.Body).Decode(&tickerDetails)

	details := tickerDetails.Results
	details.LastUpdated = int(time.Now().Unix())
	details.Description = constants.TickerDescriptions[ticker]
	TickerCache[ticker] = &details // ADD THIS TICKER TO CACHE

	return &details, nil
}

func GetTickerDividend(cachedTicker *models.TickerDetails, polygonApiKey string) error {

	url := fmt.Sprintf("https://api.polygon.io/v3/reference/dividends?ticker=%v&order=desc&limit=1000&sort=pay_date&apiKey=%v", cachedTicker.Ticker, polygonApiKey)
	res, err := http.Get(url)
	if err != nil {
		return fmt.Errorf("error while fetching ticker dividends")
	}

	defer res.Body.Close()

	if res.StatusCode != 200 {
		return fmt.Errorf("could not find dividends for ticker")
	}

	var dividends models.TickerDividendResponse
	json.NewDecoder(res.Body).Decode(&dividends)
	cachedTicker.Dividends = dividends.Results

	return nil
}

func GetTickerDivYield(cachedTicker *models.TickerDetails, polygonApiKey string) error {
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

	var tickerPrice models.TickerPriceResponse
	json.NewDecoder(res.Body).Decode(&tickerPrice)

	frequency := 4 // defaults to quarterly, if not then set it
	if len(cachedTicker.Dividends) != 0 {
		frequency = cachedTicker.Dividends[0].Frequency
	}

	var divAmounts []float64

	for i := 0; i < frequency; i++ {
		if i >= len(cachedTicker.Dividends) {
			break
		}
		divAmounts = append(divAmounts, cachedTicker.Dividends[i].Amount)
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

	cachedTicker.CurrentPrice = models.CurrentPrice{
		Price:         currentPrice,
		Change:        tickerPrice.Ticker.TodaysChange,
		ChangePercent: tickerPrice.Ticker.TodaysChangePercentage,
	}

	fixed := fmt.Sprintf("%.2f", divSum/currentPrice*100)
	fixedNum, err := strconv.ParseFloat(fixed, 64)

	if err != nil {
		return fmt.Errorf("error converting string to num")
	}

	cachedTicker.DividendYield = float64(fixedNum)
	return nil
}

func GetTickerRelatedCompanies(cachedTicker *models.TickerDetails, polygonApiKey string, supportedTickers map[string]string) error {
	url := fmt.Sprintf("https://api.polygon.io/v1/related-companies/%v?apiKey=%v", cachedTicker.Ticker, polygonApiKey)
	res, err := http.Get(url)
	if err != nil {
		return fmt.Errorf("error while fetching ticker price")
	}

	defer res.Body.Close()

	if res.StatusCode != 200 {
		return fmt.Errorf("error while fetching ticker price")
	}

	var relatedTickers models.RelatedTickersResponse
	json.NewDecoder(res.Body).Decode(&relatedTickers)

	// make sure each related ticker is supported
	var supportedRelatedTickers []models.RelatedTicker
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
			supportedRelatedTickers = append(supportedRelatedTickers, models.RelatedTicker{Name: s, Ticker: v.Ticker})
		}
	}

	// sort by company name DESC
	slices.SortFunc(supportedRelatedTickers, func(a, b models.RelatedTicker) int {
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

func GetTickerNews(cachedTicker *models.TickerDetails, polygonApiKey string) error {

	url := fmt.Sprintf("https://api.polygon.io/v2/reference/news?ticker=%v&order=desc&limit=500&sort=published_utc&apiKey=%v", cachedTicker.Ticker, polygonApiKey)
	res, err := http.Get(url)
	if err != nil {
		return fmt.Errorf("error while fetching ticker news")
	}

	defer res.Body.Close()

	if res.StatusCode != 200 {
		return fmt.Errorf("error while fetching ticker news")
	}

	// we only want a max of 5 articles
	// each article must have a unique publisher
	var returnData []models.NewsResults
	var tickerNews models.TickerNewsResponse
	json.NewDecoder(res.Body).Decode(&tickerNews)

	for _, newsData := range tickerNews.Results {
		if len(returnData) == 5 {
			break
		}

		// make sure this publisher isnt alredy stored
		publisher := newsData.Publisher.Name
		skip := false
		for i := 0; i < len(returnData); i++ {
			if returnData[i].Publisher.Name == publisher {
				skip = true
				break
			}
		}
		if skip {
			continue
		}

		// the mentioned tickers have to be supported
		// only allow up to 6
		var validTickers []string
		for i := 0; i < len(newsData.TickersMentionedInArticle); i++ {
			if len(validTickers) == 6 {
				break
			}

			ticker := strings.ToUpper(newsData.TickersMentionedInArticle[i])
			// cannot be the same ticker being viewed on company page
			if ticker == cachedTicker.Ticker {
				continue
			}

			if _, ok := constants.SupportedTickers[ticker]; ok {
				validTickers = append(validTickers, ticker)
			}
		}

		newsData.TickersMentionedInArticle = validTickers

		// make sure the description is max 350 charaters
		if len(newsData.Description) > 350 {
			newsData.Description = newsData.Description[0:348] + "..."
		}

		returnData = append(returnData, newsData)
	}

	cachedTicker.News = returnData
	return nil
}
