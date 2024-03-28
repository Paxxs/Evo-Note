package handler

import "v2note/internal/services"

// BlobHandler handles blob requests.
type BlobHandler struct {
	service services.BlobService
}

// DocHandler handles doc requests.
type DocHandler struct {
	service services.DocService
}

// CollectionHandler handles collection requests.
type CollectionHandler struct {
	service services.CollectionService
}
