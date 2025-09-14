package routes

import (
	"dividendspot/constants"
	"html/template"
	"net/http"
)

func PirvacyHandler(w http.ResponseWriter, r *http.Request) {

	tmpl, err := template.ParseFiles(
		"./views/privacy.html",
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
			Title:  "Privacy DividendSpot",
			Styles: []constants.Styles{{Link: "/public/css/privacy.css"}},
		},
	})
	if err != nil {
		constants.ErrorResponse(w, err.Error())
	}

}
