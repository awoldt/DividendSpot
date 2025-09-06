package services

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

type Results struct {
	Name string `json:"name"`
}

type Data struct {
	Results Results `json:"results"`
}

func GetTickerDetails(ticker string, polygonApiKey string) (Data, error) {
	// this function will send a request to get basic ticker data
	// it will also determine if the site supports a ticker (404 means we dont)
	// tickers that are supported will be stored in the cache so they never have to be fetched again

	upperCaseTicker := strings.ToUpper(ticker)
	url := fmt.Sprintf("https://api.polygon.io/v3/reference/tickers/%v?apiKey=%v", upperCaseTicker, polygonApiKey)
	res, err := http.Get(url)
	if err != nil {
		return Data{}, fmt.Errorf("error while fetching ticker details")
	}

	defer res.Body.Close()

	var polygonData Data
	json.NewDecoder(res.Body).Decode(&polygonData)

	return polygonData, nil
}
