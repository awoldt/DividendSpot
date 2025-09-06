package constants

import "net/http"

type Styles struct {
	Link string
}

type Head struct {
	Title  string
	Styles []Styles
}

var OneDayInSeconds int64 = 86400

func ErrorResponse(w http.ResponseWriter) {
	w.WriteHeader(500)
	w.Write([]byte("Error on server"))
}
