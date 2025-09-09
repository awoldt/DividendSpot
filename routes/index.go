package routes

import (
	"dividendspot/constants"
	"dividendspot/services"
	"fmt"
	"html/template"
	"math"
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
	Ticker   string                   `json:"ticker"`
	Dividend services.TickerDividends `json:"dividend"`
}

func daysAway(payDatestr string) string {
	payDate, err := time.Parse("2006-01-02", payDatestr)
	if err != nil {
		return ""
	}
	today := time.Now()
	days := int(math.Abs(today.Sub(payDate).Hours() / 24))
	if days == 0 {
		return "Today"
	}
	if days == 1 {
		return "Tomorrow"
	}
	return fmt.Sprintf("%v days away", days)
}

func IndexHandler(w http.ResponseWriter, r *http.Request) {
	tmpl := template.New("index.html").Funcs(template.FuncMap{
		"daysAway": daysAway,
	})

	tmpl, err := tmpl.ParseFiles(
		"./views/index.html",
		"./views/templates/head.html",
		"./views/templates/index/recentPayoutsTable.html",
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
