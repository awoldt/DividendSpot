package main

import (
	"dividendspot/constants"
	"dividendspot/routes"
	"fmt"
	"net/http"
	"slices"
	"strings"

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
		switch r.Method {
		case http.MethodGet:
			{
				switch r.URL.Path {
				case "/sitemap.xml":
					{
						w.Write([]byte(generateSitemap()))
					}

				case "/robots.txt":
					{
						w.Header().Set("content-type", "text/plain")
						w.Write([]byte("User-agent: *\nDisallow:"))
					}

				case "/ads.txt":
					{
						w.Header().Set("content-type", "text/plain")
						w.Write([]byte("google.com, pub-4106301283765460, DIRECT, f08c47fec0942fa0"))
					}

				case "/about":
					{
						routes.AboutHandler(w, r)
					}

				case "/privacy":
					{

						routes.PirvacyHandler(w, r)
					}

				case "/":
					{
						routes.IndexHandler(w, r)
					}

				// TICKER ROUTES
				default:
					{
						routes.CompanyHandler(w, r)
					}
				}
			}

		case http.MethodPost:
			{
				switch r.URL.Path {
				case "/search":
					{
						routes.SearchHandler(w, r)
					}
				}
			}
		}

	})

	http.ListenAndServe(":8080", nil)
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
