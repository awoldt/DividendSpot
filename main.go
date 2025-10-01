package main

import (
	"dividendspot/constants"
	"dividendspot/routes"
	"fmt"
	"net/http"
	"slices"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		panic("error loading .env file")
	}

	router := chi.NewRouter()

	fs := http.FileServer(http.Dir("public"))
	router.Handle("/public/*", http.StripPrefix("/public/", fs))

	router.Get("/sitemap.xml", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(generateSitemap()))
	})
	router.Get("/robots.txt", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/plain")
		w.Write([]byte("User-agent: *\nDisallow:"))
	})
	router.Get("/ads.txt", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/plain")
		w.Write([]byte("google.com, pub-4106301283765460, DIRECT, f08c47fec0942fa0"))
	})

	router.Get("/", routes.IndexHandler)
	router.Get("/about", routes.AboutHandler)
	router.Get("/privacy", routes.PirvacyHandler)

	router.Post("/search", routes.SearchHandler)
	router.Get("/{ticker}", routes.CompanyHandler)

	http.ListenAndServe(":8080", router)
}

func generateSitemap() string {
	// read the supported ticker

	var tickers []string
	for k := range constants.SupportedTickers {
		tickers = append(tickers, strings.ToLower(k))
	}

	slices.SortFunc(tickers, func(t1, t2 string) int {
		if t1 < t2 {
			return -1
		} else if t2 < t1 {
			return 1
		} else {
			return 0
		}
	})

	var sb strings.Builder
	sb.WriteString("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">")
	sb.WriteString("<url><loc>https://dividendspot.com</loc></url>")
	sb.WriteString("<url><loc>https://dividendspot.com/about</loc></url>")

	for _, v := range tickers {
		str := fmt.Sprintf("<url><loc>https://dividendspot.com/%v</loc></url>", strings.ToLower(v))
		sb.WriteString(str + "\n")
	}

	sb.WriteString("</urlset>")

	return sb.String()
}
