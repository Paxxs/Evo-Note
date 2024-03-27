package models

import "gorm.io/gorm"

// type Doc struct {
// 	gorm.Model
// 	DocID     string `gorm:"primaryKey"`
// 	RootDocID string
// }

// type Update struct {
// 	gorm.Model
// 	UpdateID   uint `gorm:"primaryKey;autoIncrement"`
// 	DocID      string
// 	UpdateData []byte
// }

// type Blob struct {
// 	gorm.Model
// 	BlobID   string `gorm:"primaryKey"`
// 	BlobData []byte
// }

type Collection struct {
	gorm.Model
	ID    string `gorm:"primaryKey"`
	Docs  []Doc
	Blobs []Blob
}

type Doc struct {
	gorm.Model
	ID           string `gorm:"primaryKey"`
	CollectionID string
	Collection   Collection `gorm:"foreignKey:CollectionID"`
	UpdateData   []byte     `gorm:"type:blob"`
}

type Blob struct {
	gorm.Model
	ID string `gorm:"primaryKey"`
	// CollectionID string `gorm:"foreignKey:ID; references:CollectionID"`
	CollectionID string
	Collection   Collection `gorm:"foreignKey:CollectionID"`
	Data         []byte     `gorm:"type:blob"`
}
