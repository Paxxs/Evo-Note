package models

// Doc is a doc model.
type Doc struct {
	BasicModel
	ID           string `gorm:"primaryKey"`
	CollectionID string
	Collection   Collection `gorm:"foreignKey:CollectionID"`
	UpdateData   []byte     `gorm:"type:blob"`
}
