package services

import "dividendspot/models"

// THIS MAP BELOW WILL STORE ALL TICKERS CACHED ON THE SERVER!
// the key is a pointer to the ticker in memory

var TickerCache = make(map[string]*models.TickerDetails)
