package handler

import "v2note/internal/services"

type BlobHandler struct {
	service services.BlobService
}

type DocHandler struct {
	service services.DocService
}

func NewDocHandler(service services.DocService) *DocHandler {
	return &DocHandler{service: service}
}

type CollectionHandler struct {
	service services.CollectionService
}

func NewBlobHandler(service services.BlobService) *BlobHandler {
	return &BlobHandler{service: service}
}

func NewCollectionHandler(service services.CollectionService) *CollectionHandler {
	return &CollectionHandler{service: service}
}
