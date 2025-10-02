package services

import (
	"html/template"
	"net/http"
)

type TickerDescription struct {
	Ticker      string `json:"ticker"`
	Description string `json:"description"`
}

type SupportedTicker struct {
	Ticker string `json:"ticker"`
	Name   string `json:"name"`
}

type Styles struct {
	Link string
}

type Scripts struct {
	Src string
}

type Head struct {
	Title       string
	Description string
	Styles      []Styles
	JsonL       template.JS
}

func ErrorResponse(w http.ResponseWriter, msg string) {
	w.WriteHeader(500)
	w.Write([]byte(msg))
}

func NotFoundResponse(w http.ResponseWriter, msg string) {
	w.WriteHeader(404)
	w.Write([]byte(msg))
}
