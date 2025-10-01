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
	"sync"
	"time"

	"github.com/go-chi/chi/v5"
)

const OneDayInSeconds int64 = 86400

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
		"lowerTicker":        strings.ToLower,
	})

	tmpl, err := tmpl.ParseFiles("./views/company.html",
		"./views/templates/company/head.html",
		"./views/templates/company/companyHero.html",
		"./views/templates/company/dividendHistoryTable.html",
		"./views/templates/company/relatedTickers.html",
		"./views/templates/company/news.html",
		"./views/templates/company/dividendsSummary.html",
		"./views/templates/company/dividendChart.html",
		"./views/templates/nav.html",
		"./views/templates/footer.html")
	if err != nil {
		constants.ErrorResponse(w, err.Error())
		return
	}

	ticker := strings.ToUpper(chi.URLParam(r, "ticker"))
	var inCache bool

	cachedTicker, inCache := services.TickerCache[ticker]
	var expired bool
	if inCache {
		expired = int64(cachedTicker.LastUpdated)+OneDayInSeconds < time.Now().Unix()
	}

	if inCache && !expired {
		// in cache and still valid
		tmpl.Execute(w, companyPageData{
			Head: constants.Head{
				Title:       fmt.Sprintf("%v (%v) Dividend Yield & Payment History", cachedTicker.Name, cachedTicker.Ticker),
				Styles:      []constants.Styles{{Link: "/public/css/company.css"}},
				JsonL:       cachedTicker.GenerateJsonL(),
				Description: fmt.Sprintf("Explore %v's (%v) complete dividend history including payout dates, dividend yield, growth trends, current market price, and the latest news. Stay informed about one of the most consistent dividend stocks in the market.", cachedTicker.Name, cachedTicker.Ticker),
			},
			TickerDetails: *cachedTicker,
		})

	} else if inCache && expired {
		// in cache but expired
		services.GetTickerDividend(cachedTicker, polygonApiKey)
		var wg sync.WaitGroup
		wg.Go(func() {
			services.GetTickerDivYield(cachedTicker, polygonApiKey)
		})
		wg.Go(func() { services.GetTickerRelatedCompanies(cachedTicker, polygonApiKey, constants.SupportedTickers) })
		wg.Go(func() { services.GetTickerNews(cachedTicker, polygonApiKey) })

		wg.Wait()
	} else {
		// not in cache
		tickerDetails, err := services.GetTickerDetails(ticker, polygonApiKey)

		if err != nil {
			constants.NotFoundResponse(w, "Ticker not supported")
			return
		}

		services.GetTickerDividend(tickerDetails, polygonApiKey)

		var wg sync.WaitGroup
		wg.Go(func() {
			services.GetTickerDivYield(tickerDetails, polygonApiKey)
		})
		wg.Go(func() { services.GetTickerRelatedCompanies(tickerDetails, polygonApiKey, constants.SupportedTickers) })
		wg.Go(func() { services.GetTickerNews(tickerDetails, polygonApiKey) })

		wg.Wait()

		tmpl.Execute(w, companyPageData{
			Head: constants.Head{
				Title:       fmt.Sprintf("%v (%v) Dividend Yield & Payment History", tickerDetails.Name, tickerDetails.Ticker),
				Styles:      []constants.Styles{{Link: "/public/css/company.css"}},
				JsonL:       tickerDetails.GenerateJsonL(),
				Description: fmt.Sprintf("Explore %v's (%v) complete dividend history including payout dates, dividend yield, growth trends, current market price, and the latest news. Stay informed about one of the most consistent dividend stocks in the market.", tickerDetails.Name, tickerDetails.Ticker),
			},
			TickerDetails: *tickerDetails,
		})
	}
}
