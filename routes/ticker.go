package routes

import (
	"dividendspot/constants"
	"dividendspot/services"
	"html/template"
	"net/http"
	"os"
	"strings"
)

func TickerHandler(w http.ResponseWriter, r *http.Request) {

	polygonApiKey := os.Getenv("POLYGON_API_KEY")
	if polygonApiKey == "" {
		constants.ErrorResponse(w)
		return
	}

	ticker := r.URL.Path[1:] // ex: /googl -> googl

	upperCaseTicker := strings.ToUpper(ticker)

	// get the ticker details first
	// this will also store in cache if it successfully finds ticker data on polygon
	tickerDetails, err := services.GetTickerDetails(upperCaseTicker, polygonApiKey)

	if err != nil {
		constants.ErrorResponse(w)
		return
	}

	// get the tickers dividends
	services.GetTickerDividends(&tickerDetails, polygonApiKey)

	tmpl, err := template.ParseFiles("./views/company.html")
	if err != nil {
		constants.ErrorResponse(w)
	}

	tmpl.Execute(w, PageData{
		Title:   "home page",
		Heading: "welcome!",
		Message: "this html was rendered with go templates",
	})
}
