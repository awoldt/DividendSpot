package polygonresponses

type TickerDetailsResponse struct {
	Results TickerDetails `json:"results"`
}

type Address struct {
	Address    string `json:"address1"`
	City       string `json:"city"`
	PostalCode string `json:"postal_code"`
	State      string `json:"state"`
}

type TickerDetails struct {
	Name    string  `json:"name"`
	Ticker  string  `json:"ticker"`
	Address Address `json:"address"`
	Website string  `json:"homepage_url"`
	Phone   string  `json:"phone_number"`
}
