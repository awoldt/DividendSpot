package constants

import "net/http"

func ErrorResponse(w http.ResponseWriter) {
	w.WriteHeader(500)
	w.Write([]byte("Error on server"))
}
