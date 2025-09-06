package constants

import "net/http"

var OneDayInSeconds int64 = 86400

func ErrorResponse(w http.ResponseWriter) {
	w.WriteHeader(500)
	w.Write([]byte("Error on server"))
}
