package models

import (
	polygonresponses "dividendspot/models/polygon_responses"
	"fmt"
	"html/template"
	"math"
	"os"
	"strconv"
	"strings"
	"time"
)

type TickerDetails struct {
	Name           string
	Ticker         string
	Address        string
	Website        string
	Phone          string
	Description    string
	CurrentPrice   polygonresponses.TickerPrice
	Dividends      []polygonresponses.TickerDividend
	DividendYield  float64
	RelatedTickers []polygonresponses.RelatedTicker
	News           []polygonresponses.NewsResults

	ExpiredTimestamps ExpiredTimestamps
}

type ExpiredTimestamps struct {
	// a struct that tracks the epoch seconds in which each part of
	// the page should update

	// they are at different expire times bc some parts of the page dont need to
	// update as frequently, while other parts do

	DividendsExpiresAt int64
	PriceExpiresAt     int64
	NewsExpiresAt      int64
}

func (t TickerDetails) GenerateJsonL() template.JS {
	// stupid ass template.JS casue a regular string will for some fucking
	// reason return the \"\" in the template i dont get it

	var sb strings.Builder
	sb.WriteString("{")

	sb.WriteString("\"@context\": \"https://schema.org\",")
	sb.WriteString("\"@type\": \"Corporation\",")

	name := fmt.Sprintf("\"name\": \"%v\",", t.Name)
	sb.WriteString(name)

	if t.Description != "" {
		description := fmt.Sprintf("\"description\": \"%v\",", t.Description)
		sb.WriteString(description)
	}

	if t.Website != "" {
		website := fmt.Sprintf("\"url\": \"%v\",", t.Website)
		sb.WriteString(website)
	}

	if t.HasCompanyLogo() {
		logo := fmt.Sprintf("\"logo\": \"https://dividendspot.com/imgs/company-logo/%v.png\",", t.Ticker)
		sb.WriteString(logo)
	}

	if t.Phone != "" {
		phone := fmt.Sprintf("\"telephone\": \"%v\",", t.Phone)
		sb.WriteString(phone)
	}

	ticker := fmt.Sprintf("\"tickerSymbol\": \"%v\"", t.Ticker)
	sb.WriteString(ticker)

	sb.WriteString("}")

	return template.JS(sb.String())
}

func (t TickerDetails) HasCompanyLogo() bool {
	// this will read from the public folder and find out if this ticker has a img
	// if not dont render the img tag on the client

	if _, err := os.Stat(fmt.Sprintf("./public/imgs/logos/%v.png", t.Ticker)); err != nil {
		return false
	}

	return true
}

func (t TickerDetails) LowerTicker() string {
	return strings.ToLower(t.Ticker)
}

func (d TickerDetails) GenerateTickerSummary() []string {
	// generate as many insights about the dividends as possible

	var summaries []string

	if len(d.Dividends) > 0 {
		storedMostRecentPayday := false
		var mostRecentPayday time.Time
		maxPayoutAmount := 0.0
		total := 0.0
		today := time.Now()

		for _, v := range d.Dividends {
			total += v.Amount
			if v.Amount > maxPayoutAmount {
				maxPayoutAmount = v.Amount
			}

			if !storedMostRecentPayday {
				t, err := time.Parse("2006-01-02", v.PayDate)
				if err == nil {
					if t.Before(today) {
						mostRecentPayday = t
						storedMostRecentPayday = true
					}
				}
			}

		}

		avg := total / float64(len(d.Dividends))

		recentPayDayYear := strings.Split(d.Dividends[0].PayDate, "-")[0]
		oldestPayDayYear := strings.Split(d.Dividends[len(d.Dividends)-1].PayDate, "-")[0]

		num1, err1 := strconv.Atoi(recentPayDayYear)
		num2, err2 := strconv.Atoi(oldestPayDayYear)

		if err1 == nil && err2 == nil {
			summaries = append(summaries, fmt.Sprintf("%v has issued %v dividend payments over the past %v years", d.Name, len(d.Dividends), math.Abs(float64(num1)-float64(num2))))
		}

		summaries = append(summaries, fmt.Sprintf("The most recent dividend was paid %v days ago, on %v", int(today.Sub(mostRecentPayday).Hours()/24), mostRecentPayday.Format("January 2, 2006")))

		summaries = append(summaries, fmt.Sprintf("The highest dividend payed out to investors during this period was $%.2f per share", maxPayoutAmount))
		summaries = append(summaries, fmt.Sprintf("The average dividend paid during this period was $%.2f per share.", avg))
	}

	return summaries
}

func (t TickerDetails) GetTickerDividendFrequencyString() string {
	// if no dividends, return empty string
	if len(t.Dividends) == 0 {
		return ""
	}

	f := t.Dividends[0].Frequency

	switch f {
	case 1:
		return "Yearly"
	case 4:
		return "Quarterly"
	case 6:
		return "Biannually"
	case 12:
		return "Monthly"
	default:
		return ""
	}
}
