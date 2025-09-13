package routes

import (
	"dividendspot/constants"
	"encoding/json"
	"net/http"
	"net/url"
	"strings"
)

func handleSearch(query url.Values) map[string]string {
	results := make(map[string]string)
	ticker := query.Get("ticker")

	if ticker == "" {
		return results
	}

	// loop through all supported tickers and any matching ticker/name key add to results
	for k, v := range constants.SupportedTickers {
		if len(results) == 7 {
			break
		}

		if strings.EqualFold(ticker, k) || strings.EqualFold(ticker, v) {
			results[k] = v
			continue
		}

		if len(k) >= len(ticker) {
			if strings.EqualFold(ticker[0:], k[0:len(ticker)]) {
				results[k] = v
				continue
			}
		}

		if len(v) >= len(ticker) {
			if strings.EqualFold(ticker[0:], v[0:len(ticker)]) {
				results[k] = v
				continue
			}
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
