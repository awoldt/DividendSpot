package routes

import (
	"dividendspot/models"
	"dividendspot/services"
	"dividendspot/views"
	"net/http"
	"os"
	"strings"
	"sync"

	"github.com/go-chi/chi/v5"
)

func CompanyHandler(w http.ResponseWriter, r *http.Request) {
	polygonApiKey := os.Getenv("POLYGON_API_KEY")
	if polygonApiKey == "" {
		services.ErrorResponse(w, "Could not establish API key")
		return
	}

	ticker := strings.ToUpper(chi.URLParam(r, "ticker"))

	// see if this ticker is already stored in cache
	// if so, we dont need to get the basic ticker details, but call all other functions
	cachedTicker, isTickerCached := services.TickerCache[ticker]
	if isTickerCached {
		services.GetTickerDividends(cachedTicker, polygonApiKey)
		services.GetTickerPrice(cachedTicker, polygonApiKey)

		// we can run the following in goroutines as they depend on the data above to be set
		var wg sync.WaitGroup
		wg.Go(func() { services.GetTickerDivYield(cachedTicker) })
		wg.Go(func() { services.GetTickerNews(cachedTicker, polygonApiKey) })
		wg.Go(func() { services.GetTickerRelatedCompanies(cachedTicker, polygonApiKey, services.SupportedTickers) })

		wg.Wait()

		err := views.TickerPage(cachedTicker).Render(r.Context(), w)
		if err != nil {
			w.Write([]byte("Error while rendering index view"))
			return
		}

	} else {
		// see if this ticker is even supported, and if not return 404
		_, supportedTicker := services.SupportedTickers[ticker]
		if !supportedTicker {
			w.WriteHeader(404)
			w.Write([]byte("Ticker not supported"))
			return
		}

		// we support this ticker!
		// store this ticker in cache and the fetch data
		addedTicker := models.TickerDetails{Ticker: ticker}
		services.TickerCache[ticker] = &addedTicker

		services.GetTickerDetails(services.TickerCache[ticker], polygonApiKey)
		services.GetTickerDividends(services.TickerCache[ticker], polygonApiKey)
		services.GetTickerPrice(services.TickerCache[ticker], polygonApiKey)

		// we can run the following in goroutines as they depend on the data above to be set
		var wg sync.WaitGroup
		wg.Go(func() { services.GetTickerDivYield(services.TickerCache[ticker]) })
		wg.Go(func() { services.GetTickerNews(services.TickerCache[ticker], polygonApiKey) })
		wg.Go(func() {
			services.GetTickerRelatedCompanies(services.TickerCache[ticker], polygonApiKey, services.SupportedTickers)
		})

		wg.Wait()

		err := views.TickerPage(services.TickerCache[ticker]).Render(r.Context(), w)
		if err != nil {
			w.Write([]byte("Error while rendering index view"))
			return
		}
	}

}
