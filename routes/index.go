package routes

import (
	"dividendspot/constants"
	"dividendspot/services"
	"fmt"
	"html/template"
	"net/http"
)

type indexPageData struct {
	Head          constants.Head
	RecentPayouts []singlePayout
}

// we only want to showcase a single payout on the homepage for each ticker
type singlePayout struct {
	Ticker   string                   `json:"ticker"`
	Dividend services.TickerDividends `json:"dividend"`
}

func IndexHandler(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles(
		"./views/index.html",
		"./views/templates/head.html",
		"./views/templates/index/recentPayoutsTable.html",
	)
	if err != nil {
		constants.ErrorResponse(w, err.Error())
		return
	}

	// check the cache for tickers with dividends stored already (only add max of 20)
	var payouts []singlePayout

	for k, v := range services.TickerCache {
		if len(payouts) == 20 {
			break
		}
		if len(v.Dividends) == 0 {
			continue
		}

		payouts = append(payouts, singlePayout{Ticker: k, Dividend: v.Dividends[0]})
	}

	fmt.Println(payouts)

	tmpl.Execute(w, indexPageData{
		Head: constants.Head{
			Title:  "DividendSpot – Public Companies, ETFs & Funds Dividends",
			Styles: []constants.Styles{{Link: "/public/css/index.css"}},
		},
		RecentPayouts: payouts,
	})
}
