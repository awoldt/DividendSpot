package main

import (
	"dividendspot/routes"
	"dividendspot/services"
	"fmt"
	"net/http"
	"os"
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
	router.Get("/about", func(w http.ResponseWriter, r *http.Request) {
		page, err := os.ReadFile("about.html")
		if err != nil {
			w.WriteHeader(500)
			w.Write([]byte("There was an error while serving about page"))
			return
		}

		w.Header().Add("content-type", "text/html")
		w.Write(page)
	})
	router.Get("/privacy", func(w http.ResponseWriter, r *http.Request) {
		page, err := os.ReadFile("privacy.html")
		if err != nil {
			w.WriteHeader(500)
			w.Write([]byte("There was an error while serving privacy page"))
			return
		}

		w.Header().Add("content-type", "text/html")
		w.Write(page)
	})

	router.Post("/search", routes.SearchHandler)
	router.Get("/{ticker}", routes.CompanyHandler)

	http.ListenAndServe(":8080", router)
}

func generateSitemap() string {
	// read the supported ticker

	var tickers []string
	for k := range services.SupportedTickers {
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
