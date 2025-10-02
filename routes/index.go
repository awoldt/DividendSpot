package routes

import (
	"dividendspot/models"
	"dividendspot/services"
	"dividendspot/views"
	"net/http"
	"slices"
	"time"
)

func IndexHandler(w http.ResponseWriter, r *http.Request) {

	// check the cache for tickers with dividends stored already
	var payouts []models.SinglePayout

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
		monthFromToday := time.Now().Add((time.Hour * 24) * 30)

		// only include payouts that are within the next 30 days
		if today.After(payDate) || payDate.After(monthFromToday) {
			continue
		}

		payouts = append(payouts, models.SinglePayout{Ticker: k, Dividend: v.Dividends[0]})
	}

	// sort each payout by most recent date
	slices.SortFunc(payouts, func(sp1, sp2 models.SinglePayout) int {
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

	err := views.IndexView(payouts).Render(r.Context(), w)
	if err != nil {
		w.Write([]byte("Error while rendering index view"))
		return
	}
}
