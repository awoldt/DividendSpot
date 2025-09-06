package routes

import (
	"dividendspot/constants"
	"dividendspot/services"
	"encoding/json"
	"net/http"
	"os"
)

func TickerHandler(w http.ResponseWriter, r *http.Request) {

	polygonApiKey := os.Getenv("POLYGON_API_KEY")
	if polygonApiKey == "" {
		constants.ErrorResponse(w)
		return
	}

	ticker := r.URL.Path[1:]
	data, err := services.GetTickerDetails(ticker, polygonApiKey)
	if err != nil {
		constants.ErrorResponse(w)
		return
	}

	w.Header().Set("content-type", "application/json")
	json.NewEncoder(w).Encode(data)
}
