package models

type HeadTag struct {
	Title          string
	Description    string
	Styles         []Styles
	CanonicalLink  string
	OpengraphImage string
	JSONL          string
}

type Styles struct {
	Link string
}
