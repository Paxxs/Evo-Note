package models

// Collection is a collection model.
type Collection struct {
	BasicModel
	ID    string `gorm:"primaryKey"`
	Name  string
	Docs  []Doc
	Blobs []Blob
}
