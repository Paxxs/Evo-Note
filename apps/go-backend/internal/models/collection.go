package models

type Collection struct {
	BasicModel
	ID    string `gorm:"primaryKey"`
	Name  string
	Docs  []Doc
	Blobs []Blob
}
