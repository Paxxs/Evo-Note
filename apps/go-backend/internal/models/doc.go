package models

type Doc struct {
	BasicModel
	ID           string `gorm:"primaryKey"`
	CollectionID string
	Collection   Collection `gorm:"foreignKey:CollectionID"`
	UpdateData   []byte     `gorm:"type:blob"`
}
