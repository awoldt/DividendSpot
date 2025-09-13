package routes

import (
	"dividendspot/constants"
	"encoding/json"
	"fmt"
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

	fmt.Println(ticker)

	// loop through all supported tickers and any matching ticker/name key add to results
	for k, v := range constants.SupportedTickers {
		if len(results) == 7 {
			break
		}

		// aapl -> aap
		if len(ticker) > len(k) {
			if ticker[0:len(k)] == k[0:len(k)] {
				results[k] = v
				continue
			}
		} else {
			if ticker[0:len(ticker)] == k[0:len(ticker)] {
				results[k] = v
				continue
			}
		}

	}

	return results
}

func SearchHandler(w http.ResponseWriter, r *http.Request) {

	fmt.Println(r.URL.Query())
	data, err := json.Marshal(handleSearch(r.URL.Query()))
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte("There was an error on server while searching"))
	}
	w.Header().Set("content-type", "application/json")
	w.Write([]byte(data))
}
