package main

import (
	"dividendspot/routes"
	"log"
	"net/http"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("error loading .env file")
	}

	fs := http.FileServer(http.Dir("public"))
	http.Handle("/public/", http.StripPrefix("/public/", fs))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/":
			routes.IndexHandler(w, r)
		default:
			routes.TickerHandler(w, r)
		}
	})

	http.ListenAndServe(":8080", nil)
}
