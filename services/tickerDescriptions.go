package services

import (
	"encoding/json"
	"fmt"
	"os"
)

// we store all the descriptions for each ticker in memory on the server
// /misc/ticker_descriptions.json will contain the file for eahc description

var TickerDescriptions = make(map[string]string)

func init() {
	// load all json files into memory needed for app
	tickerDescriptions, err := os.ReadFile("misc/ticker_descriptions.json")
	if err != nil {
		panic(err.Error())
	}

	var descriptions []TickerDescription
	err = json.Unmarshal(tickerDescriptions, &descriptions)
	if err != nil {
		panic("error while loading ticker descriptions into memory")
	}

	count := 0
	for _, v := range descriptions {
		TickerDescriptions[v.Ticker] = v.Description
		count++
	}

	fmt.Printf("Loaded %v ticker descriptions into memory\n", count)
}
