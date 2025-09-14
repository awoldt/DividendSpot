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
	Head             constants.Head
	TickerDetails    models.TickerDetails
	DividendsSummary []string
}

func cleanDate(date string) string {
	// some dates have a "T" timezone in the string
	// split by that and take the first element in the slice
	str := strings.Split(date, "T")
	t, err := time.Parse("2006-01-02", str[0])
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
		"cleanDate":          cleanDate,
		"DaysAwayFromPayout": models.TickerDividend.DaysAwayFromPayout,
	})

	tmpl, err := tmpl.ParseFiles("./views/company.html",
		"./views/templates/company/head.html",
		"./views/templates/company/companyHero.html",
		"./views/templates/company/dividendHistoryChart.html",
		"./views/templates/company/relatedTickers.html",
		"./views/templates/company/news.html",
		"./views/templates/company/dividendsSummary.html")
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

	services.GetTickerDividend(tickerDetails, polygonApiKey)
	services.GetTickerDivYield(tickerDetails, tickerDetails.Dividends, polygonApiKey)
	services.GetTickerRelatedCompanies(tickerDetails, polygonApiKey, constants.SupportedTickers)
	services.GetTickerNews(tickerDetails, polygonApiKey)

	tmpl.Execute(w, companyPageData{
		Head: constants.Head{
			Title:       tickerDetails.Name,
			Styles:      []constants.Styles{{Link: "/public/css/company.css"}},
			JsonL:       tickerDetails.GenerateJsonL(),
			Description: fmt.Sprintf("Explore %v's (%v) complete dividend history including payout dates, dividend yield, growth trends, and the latest news. Stay informed about one of the most consistent dividend stocks in the market.", tickerDetails.Name, tickerDetails.Ticker),
		},
		TickerDetails: *tickerDetails,
	})
}
