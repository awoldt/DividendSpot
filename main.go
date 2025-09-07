package main

import (
	"dividendspot/routes"
	"fmt"
	"net/http"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		panic("error loading .env file")
	}

	fs := http.FileServer(http.Dir("public"))
	http.Handle("/public/", http.StripPrefix("/public/", fs))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println(r.URL)

		switch r.URL.Path {
		case "/":
			routes.IndexHandler(w, r)
		// TICKER ROUTES
		default:
			routes.CompanyHandler(w, r)
		}
	})

	http.ListenAndServe(":8080", nil)
}
