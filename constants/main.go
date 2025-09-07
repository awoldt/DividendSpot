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

var TickerDescriptions = make(map[string]string)

func init() {
	// load the assest descriptions into memory before progrma runs
	data, err := os.ReadFile("misc/ticker_descriptions.json")
	if err != nil {
		panic(err.Error())
	}

	var descriptions []TickerDescription
	err = json.Unmarshal(data, &descriptions)

	if err != nil {
		panic("error while loading ticker descriptions into memory")
	}

	for _, v := range descriptions {
		TickerDescriptions[v.Ticker] = v.Description
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

func ErrorResponse(w http.ResponseWriter) {
	w.WriteHeader(500)
	w.Write([]byte("Error on server"))
}
