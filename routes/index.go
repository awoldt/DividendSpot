package routes

import (
	"dividendspot/constants"
	"dividendspot/models"
	"dividendspot/services"
	"html/template"
	"net/http"
	"slices"
	"time"
)

type indexPageData struct {
	Head          constants.Head
	RecentPayouts []singlePayout
}

// we only want to showcase a single payout on the homepage for each ticker
type singlePayout struct {
	Ticker   string                `json:"ticker"`
	Dividend models.TickerDividend `json:"dividend"`
}

func IndexHandler(w http.ResponseWriter, r *http.Request) {

	tmpl, err := template.ParseFiles(
		"./views/index.html",
		"./views/templates/index/head.html",
		"./views/templates/index/recentPayoutsTable.html",
		"./views/templates/nav.html",
		"./views/templates/footer.html",
	)
	if err != nil {
		constants.ErrorResponse(w, err.Error())
		return
	}

	// check the cache for tickers with dividends stored already
	var payouts []singlePayout

	for k, v := range services.TickerCache {
		if len(payouts) == 50 {
			break
		}
		if len(v.Dividends) == 0 {
			continue
		}

		payDate, err := time.Parse("2006-01-02", v.Dividends[0].PayDate)
		if err != nil {
			continue
		}

		today := time.Now()

		// only include payouts that are in the future
		if today.After(payDate) {
			continue
		}

		payouts = append(payouts, singlePayout{Ticker: k, Dividend: v.Dividends[0]})
	}

	// sort each payout by most recent date
	slices.SortFunc(payouts, func(sp1, sp2 singlePayout) int {
		t1, err1 := time.Parse("2006-01-02", sp1.Dividend.PayDate)
		t2, err2 := time.Parse("2006-01-02", sp2.Dividend.PayDate)

		if err1 != nil || err2 != nil {
			return 0
		}

		if t1.Before(t2) {
			return -1
		} else if t1.After(t2) {
			return 1
		} else {
			return 0
		}
	})

	tmpl.Execute(w, indexPageData{
		Head: constants.Head{
			Title:  "DividendSpot – Public Companies, ETFs & Funds Dividends",
			Styles: []constants.Styles{{Link: "/public/css/index.css"}},
		},
		RecentPayouts: payouts,
	})
}
