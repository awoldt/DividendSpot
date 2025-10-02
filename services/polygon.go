package services

import (
	"dividendspot/models"
	polygonresponses "dividendspot/models/polygon_responses"

	"encoding/json"
	"fmt"
	"net/http"
	"slices"
	"strconv"
	"strings"
	"time"
)

const OneDayInSeconds int64 = 86400
const FifteenMinsInSeconds int64 = 900
const OneHourInSeconds = 3600

func GetTickerDetails(cachedTicker *models.TickerDetails, polygonApiKey string) error {
	// this function will send a request to get basic ticker data

	url := fmt.Sprintf("https://api.polygon.io/v3/reference/tickers/%v?apiKey=%v", cachedTicker.Ticker, polygonApiKey)
	res, err := http.Get(url)
	if err != nil {
		return fmt.Errorf("error while fetching ticker details")
	}

	defer res.Body.Close()

	if res.StatusCode != 200 {
		return fmt.Errorf("ticker doesnt exist")
	}

	var tickerDetails polygonresponses.TickerDetailsResponse
	json.NewDecoder(res.Body).Decode(&tickerDetails)
	details := tickerDetails.Results

	cachedTicker.Address = details.Address.Address
	cachedTicker.Name = details.Name
	cachedTicker.Phone = details.Phone
	cachedTicker.Website = details.Website

	// find the description stored in memory if there is one
	desc, hasDesc := TickerDescriptions[cachedTicker.Ticker]
	if hasDesc {
		cachedTicker.Description = desc
	}

	return nil
}

func GetTickerDividends(cachedTicker *models.TickerDetails, polygonApiKey string) error {
	// no need to get dividends if data is not expired
	if cachedTicker.ExpiredTimestamps.DividendsExpiresAt > time.Now().Unix() {
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

	var dividends polygonresponses.TickerDividendResponse
	json.NewDecoder(res.Body).Decode(&dividends)
	cachedTicker.Dividends = dividends.Results

	cachedTicker.ExpiredTimestamps.DividendsExpiresAt = time.Now().Unix() + OneDayInSeconds
	return nil
}

func GetTickerPrice(cachedTicker *models.TickerDetails, polygonApiKey string) error {
	// no need to get price if data is not expired
	if cachedTicker.ExpiredTimestamps.PriceExpiresAt > time.Now().Unix() {
		return nil
	}

	url := fmt.Sprintf("https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/%v?apiKey=%v", cachedTicker.Ticker, polygonApiKey)
	res, err := http.Get(url)
	if err != nil {
		return fmt.Errorf("error while fetching ticker price")
	}

	defer res.Body.Close()

	if res.StatusCode != 200 {
		return fmt.Errorf("error while fetching ticker price")
	}

	cachedTicker.ExpiredTimestamps.PriceExpiresAt = time.Now().Unix() + FifteenMinsInSeconds

	var tickerPrice polygonresponses.TickerPriceResponse
	json.NewDecoder(res.Body).Decode(&tickerPrice)

	// sometimes polygon will have day price set as 0, if so take prevDay
	currentPrice := 0.0
	if tickerPrice.Ticker.Day.Close != 0 {
		currentPrice = tickerPrice.Ticker.Day.Close
	} else {
		currentPrice = tickerPrice.Ticker.PrevDay.Close
	}

	cachedTicker.CurrentPrice = polygonresponses.TickerPrice{
		CurrentPrice:           currentPrice,
		TodaysChange:           tickerPrice.Ticker.TodaysChange,
		TodaysChangePercentage: tickerPrice.Ticker.TodaysChangePercentage,
		ExpiresAt:              time.Now().Unix() + FifteenMinsInSeconds,
	}

	return nil
}

func GetTickerDivYield(cachedTicker *models.TickerDetails) {

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

	// if polygon doesnt have a value other than 0... just dont do this part
	currentPrice := cachedTicker.CurrentPrice.CurrentPrice
	if currentPrice != 0.0 {
		fixed := fmt.Sprintf("%.2f", divSum/currentPrice*100)
		fixedNum, err := strconv.ParseFloat(fixed, 64)

		if err != nil {
			return
		}

		cachedTicker.DividendYield = float64(fixedNum)
	}
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

	var relatedTickers polygonresponses.RelatedTickersResponse
	json.NewDecoder(res.Body).Decode(&relatedTickers)

	// make sure each related ticker is supported
	var supportedRelatedTickers []polygonresponses.RelatedTicker
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
			supportedRelatedTickers = append(supportedRelatedTickers, polygonresponses.RelatedTicker{Name: s, Ticker: v.Ticker})
		}
	}

	// sort by company name DESC
	slices.SortFunc(supportedRelatedTickers, func(a, b polygonresponses.RelatedTicker) int {
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
	// no need to get news data if not expired
	if cachedTicker.ExpiredTimestamps.NewsExpiresAt > time.Now().Unix() {
		return nil
	}

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
	var returnData []polygonresponses.NewsResults
	var tickerNews polygonresponses.TickerNewsResponse
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

			if _, ok := SupportedTickers[ticker]; ok {
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
	cachedTicker.ExpiredTimestamps.NewsExpiresAt = time.Now().Unix() + OneHourInSeconds
	return nil
}
