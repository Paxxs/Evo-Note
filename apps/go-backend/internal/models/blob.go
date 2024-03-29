package models

// Blob is a blob model.
type Blob struct {
	BasicModel
	ID string `gorm:"primaryKey"`
	// CollectionID string `gorm:"foreignKey:ID; references:CollectionID"`
	ContentType  string `gorm:"type:text"`
	CollectionID string
	Collection   Collection `gorm:"foreignKey:CollectionID"`
	Data         []byte     `gorm:"type:blob"`
}
