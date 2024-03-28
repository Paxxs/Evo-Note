package models

type Blob struct {
	BasicModel
	ID string `gorm:"primaryKey"`
	// CollectionID string `gorm:"foreignKey:ID; references:CollectionID"`
	CollectionID string
	Collection   Collection `gorm:"foreignKey:CollectionID"`
	Data         []byte     `gorm:"type:blob"`
}
