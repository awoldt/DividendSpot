package routes

import (
	"dividendspot/constants"
	"dividendspot/models"
	"dividendspot/services"
	"fmt"
	"html/template"
	"net/http"
	"os"
	"strings"
	"time"
)

type companyPageData struct {
	Head          constants.Head
	TickerDetails models.TickerDetails
}

func cleanDate(date string) string {
	t, err := time.Parse("2006-01-02", date)
	if err != nil {
		return ""
	}

	return t.Format("January 2, 2006")
}

func CompanyHandler(w http.ResponseWriter, r *http.Request) {
	polygonApiKey := os.Getenv("POLYGON_API_KEY")
	if polygonApiKey == "" {
		constants.ErrorResponse(w, "Could not establish API key")
		return
	}

	tmpl := template.New("company.html").Funcs(template.FuncMap{
		"cleanDate": cleanDate,
	})

	tmpl, err := tmpl.ParseFiles("./views/company.html",
		"./views/templates/head.html",
		"./views/templates/company/companyHero.html",
		"./views/templates/company/dividendHistoryChart.html",
		"./views/templates/company/relatedTickers.html")
	if err != nil {
		constants.ErrorResponse(w, err.Error())
		return
	}

	ticker := r.URL.Path[1:] // ex: /googl -> googl
	upperCaseTicker := strings.ToUpper(ticker)

	// see if ticker in cache first and return instantly if so
	if data, ok := services.TickerCache[upperCaseTicker]; ok {
		fmt.Println("\ncompany in cahce!")
		tmpl.Execute(w, companyPageData{
			Head:          constants.Head{Title: data.Name, Styles: []constants.Styles{{Link: "/public/css/company.css"}}},
			TickerDetails: *data,
		})
		return
	}

	tickerDetails, err := services.GetTickerDetails(upperCaseTicker, polygonApiKey)

	if err != nil {
		constants.ErrorResponse(w, "Ticker not supported")
		return
	}

	services.GetTickerDividends(tickerDetails, polygonApiKey)
	services.GetTickerDivYield(tickerDetails, tickerDetails.Dividends, polygonApiKey)
	services.GetTickerRelatedCompanies(tickerDetails, polygonApiKey, constants.SupportedTickers)

	tmpl.Execute(w, companyPageData{
		Head:          constants.Head{Title: tickerDetails.Name, Styles: []constants.Styles{{Link: "/public/css/company.css"}}},
		TickerDetails: *tickerDetails,
	})
}
