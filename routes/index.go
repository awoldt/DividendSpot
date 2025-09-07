package routes

import (
	"dividendspot/constants"
	"html/template"
	"net/http"
)

type indexPageData struct {
	Head constants.Head
}

func IndexHandler(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles(
		"./views/index.html",
		"./views/templates/head.html",
	)
	if err != nil {
		constants.ErrorResponse(w)
		return
	}

	tmpl.Execute(w, indexPageData{
		Head: constants.Head{
			Title:  "DividendSpot – Public Companies, ETFs & Funds Dividends",
			Styles: []constants.Styles{{Link: "/public/css/index.css"}},
		},
	})
}
