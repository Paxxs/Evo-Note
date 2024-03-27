package handlers

import "gorm.io/gorm"

type BlobHandler struct {
	db *gorm.DB
}

type DocHandler struct {
	db *gorm.DB
}

type CollectionHandler struct {
	db *gorm.DB
}

func NewBlobHandler(db *gorm.DB) *BlobHandler {
	return &BlobHandler{db: db}
}

func NewDocHandler(db *gorm.DB) *DocHandler {
	return &DocHandler{db: db}
}

func NewCollectionHandler(db *gorm.DB) *CollectionHandler {
	return &CollectionHandler{db: db}
}
