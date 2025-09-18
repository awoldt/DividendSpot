package routes

import (
	"dividendspot/constants"
	"html/template"
	"net/http"
)

type pageData struct {
	Head constants.Head
}

func AboutHandler(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles(
		"./views/about.html",
		"./views/templates/about/head.html",
		"./views/templates/nav.html",
		"./views/templates/footer.html",
	)
	if err != nil {
		constants.ErrorResponse(w, err.Error())
		return
	}

	err = tmpl.Execute(w, pageData{
		Head: constants.Head{
			Title:       "About DividendSpot",
			Styles:      []constants.Styles{{Link: "/public/css/about.css"}},
			Description: "DividendsSpot provides clear, accurate, and up-to-date dividend data. Explore payout history, yields, and insights on top dividend-paying stocks with a simple, distraction-free interface.",
		},
	})
	if err != nil {
		constants.ErrorResponse(w, err.Error())
	}
}
