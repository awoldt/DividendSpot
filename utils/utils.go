package utils

import (
	"strings"
	"time"
)

func CleanDate(date string) string {
	// some dates have a "T" timezone in the string
	// split by that and take the first element in the slice
	str := strings.Split(date, "T")
	t, err := time.Parse("2006-01-02", str[0])
	if err != nil {
		return ""
	}

	return t.Format("January 2, 2006")
}

func LowerTicker(ticker string) string {
	return strings.ToLower(ticker)
}
