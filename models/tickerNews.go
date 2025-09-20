package models

type Publisher struct {
	Name string `json:"name"`
}

type NewsResults struct {
	Title                     string    `json:"title"`
	PublishedOnUTC            string    `json:"published_utc"`
	Url                       string    `json:"article_url"`
	TickersMentionedInArticle []string  `json:"tickers"`
	Description               string    `json:"description"`
	Author                    string    `json:"author"`
	Publisher                 Publisher `json:"publisher"`
}

type TickerNewsResponse struct {
	Results []NewsResults `json:"results"`
}
