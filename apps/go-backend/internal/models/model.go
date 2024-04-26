package models

import "gorm.io/gorm"

type BasicModel struct {
	gorm.Model
}

type Tabler interface {
	TableName() string
}
