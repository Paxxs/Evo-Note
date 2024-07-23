package models

// Doc is a doc model.
type Doc struct {
	BasicModel
	ID           string     `gorm:"primaryKey;column:id"`
	CollectionID string     `gorm:"column:collection_id"`
	Collection   Collection `gorm:"foreignKey:CollectionID;references:ID"`
	UpdateData   []byte     `gorm:"type:blob;column:update_data"`
}

func (Doc) TableName() string {
	return "docs"
}

// var _ = reflect.TypeOf(Doc{})
