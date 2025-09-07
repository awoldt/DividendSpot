package routes

import (
	"dividendspot/constants"
	"dividendspot/services"
	"fmt"
	"html/template"
	"net/http"
	"os"
	"strings"
)

type companyPageData struct {
	Head          constants.Head
	TickerDetails services.TickerDetails
}

func CompanyHandler(w http.ResponseWriter, r *http.Request) {
	polygonApiKey := os.Getenv("POLYGON_API_KEY")
	if polygonApiKey == "" {
		constants.ErrorResponse(w)
		return
	}

	tmpl, err := template.ParseFiles("./views/company.html",
		"./views/templates/head.html",
		"./views/templates/companyHero.html",
		"./views/templates/dividendHistoryChart.html")
	if err != nil {
		constants.ErrorResponse(w)
		return
	}

	ticker := r.URL.Path[1:] // ex: /googl -> googl
	upperCaseTicker := strings.ToUpper(ticker)

	// see if ticker in cache first and return instantly if so
	data, ok := services.TickerCache[upperCaseTicker]
	if ok {
		fmt.Println("\ncompany in cahce!")
		tmpl.Execute(w, companyPageData{
			Head:          constants.Head{Title: data.Name, Styles: []constants.Styles{{Link: "/public/css/company.css"}}},
			TickerDetails: *data,
		})
		return
	} else {
		fmt.Println("\ncompany NOT in cahce!")
	}

	tickerDetails, err := services.GetTickerDetails(upperCaseTicker, polygonApiKey)

	if err != nil {
		constants.ErrorResponse(w)
		return
	}

	services.GetTickerDividends(tickerDetails, polygonApiKey)
	services.GetTickerDivYield(tickerDetails, tickerDetails.Dividends, polygonApiKey)

	tmpl.Execute(w, companyPageData{
		Head:          constants.Head{Title: tickerDetails.Name, Styles: []constants.Styles{{Link: "/public/css/company.css"}}},
		TickerDetails: *tickerDetails,
	})
}
