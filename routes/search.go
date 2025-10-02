package routes

import (
	"dividendspot/services"
	"encoding/json"
	"net/http"
	"net/url"
	"strings"
)

func handleSearch(query url.Values) map[string]string {
	results := make(map[string]string)

	ticker := strings.ToUpper(query.Get("ticker"))

	if ticker == "" {
		return results
	}

	// loop through all supported tickers and any matching ticker/name key add to results
	for companyTicker, companyName := range services.SupportedTickers {
		if len(results) == 7 {
			break
		}

		if ticker == companyTicker {
			results[companyTicker] = companyName
			continue
		}

	}

	return results
}

func SearchHandler(w http.ResponseWriter, r *http.Request) {
	data, err := json.Marshal(handleSearch(r.URL.Query()))
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte("There was an error on server while searching"))
	}
	w.Header().Set("content-type", "application/json")
	w.Write([]byte(data))
}
