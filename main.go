package main

import (
	"dividendspot/routes"
	"net/http"
)

func main() {
	fs := http.FileServer(http.Dir("public"))
	http.Handle("/public/", http.StripPrefix("/public/", fs))

	http.HandleFunc("/", routes.IndexHandler)

	http.ListenAndServe(":8080", nil)
}
