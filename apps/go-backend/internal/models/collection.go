package models

// Collection is a collection model.
type Collection struct {
	BasicModel
	ID    string `gorm:"primaryKey;column:id"`
	Name  string `gorm:"column:name"`
	Docs  []Doc  `gorm:"foreignKey:CollectionID;references:ID"`
	Blobs []Blob `gorm:"foreignKey:CollectionID;references:ID"`
}

func (Collection) TableName() string {
	return "collections"
}

// var _ = reflect.TypeOf(Collection{})
