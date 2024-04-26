package models

// Blob is a blob model.
type Blob struct {
	BasicModel
	ID           string     `gorm:"primaryKey;column:id"`
	ContentType  string     `gorm:"type:text;column:content_type"`
	CollectionID string     `gorm:"column:collection_id"`
	Collection   Collection `gorm:"foreignKey:CollectionID;references:ID"`
	Data         []byte     `gorm:"type:blob;column:data"`
}

func (Blob) TableName() string {
	return "blobs"
}

// var _ = reflect.TypeOf(Blob{})
