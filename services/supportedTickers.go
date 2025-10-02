package services

import (
	"encoding/json"
	"fmt"
	"os"
)

// we store all the supported tickers on the server
// we wont have to ping polygon to find out if we support a ticker or not, just check the cache

var SupportedTickers = make(map[string]string)

func init() {
	supportedTickers, err := os.ReadFile("misc/supported_tickers.json")
	if err != nil {
		panic(err.Error())
	}

	var supported []SupportedTicker
	err = json.Unmarshal(supportedTickers, &supported)
	if err != nil {
		panic("error while loading supported tickers into memory")
	}

	count := 0
	for _, v := range supported {
		SupportedTickers[v.Ticker] = v.Name
		count++
	}

	fmt.Printf("Loaded %v tickers into memory\n", count)
}
