package routes

import (
	"dividendspot/constants"
	"html/template"
	"net/http"
)

type PageData struct {
	Title   string
	Heading string
	Message string
}

func IndexHandler(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./views/index.html")
	if err != nil {
		constants.ErrorResponse(w)
	}

	tmpl.Execute(w, PageData{
		Title:   "home page",
		Heading: "welcome!",
		Message: "this html was rendered with go templates",
	})
}
