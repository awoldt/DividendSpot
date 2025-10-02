package models

type HeadTag struct {
	Title       string
	Description string
	Styles      []Styles
}

type Styles struct {
	Link string
}
