package repositories

import "v2note/internal/models"

// DocRepositoryQ defines the interface for document storage operations.
type DocRepositoryQ interface {
	GetDoc(collectionID, id string) (*models.Doc, error)
	DeleteDoc(collectionID, id string) error
	PutDoc(doc *models.Doc) error
	IndexDoc(collectionID string) ([]*models.Doc, error)
}

// CollectionRepositoryQ defines the interface for document collection storage operations.
type CollectionRepositoryQ interface {
	CreateCollection(collectionID, name string) error
	GetCollection(collectionID string) (*models.Collection, error)
	UpdateCollection(collectionID, name string) error
	DeleteCollection(collectionID string) error
	IndexCollection() ([]*models.Collection, error)
}

// BlobRepositoryQ defines the interface for blob storage operations.
type BlobRepositoryQ interface {
	GetBlob(collectionID, id string) (*models.Blob, error)
	PutBlob(blob *models.Blob) error
	DeleteBlob(collectionID, id string) error
	IndexBlob(collectionID string) ([]*models.Blob, error)

	// GetBlob(blob *models.Blob) error
	// DeleteBlob(blob *models.Blob) error
	// PutBlob(blob *models.Blob) error
	// IndexBlob(blobs []models.Blob) error
}
