package services

// BlobService defines the interface for blob operations.
type BlobService interface {
	GetBlob(collectionID, id string) ([]byte, error)
	PutBlob(collectionID, id string, data []byte, contentType string) error
	DeleteBlob(collectionID, id string) error
	IndexBlobIDs(collectionID string) ([]string, error)
}

// DocService defines the interface for document operations.
type DocService interface {
	GetDocUpdates(collectionID, id string) ([]byte, error)
	PutDocUpdates(collectionID, id string, data []byte) error
	DeleteDoc(collectionID, id string) error
	IndexDocIDs(collectionID string) ([]string, error)
}

// CollectionService defines the interface for collection operations.
type CollectionService interface {
	CreateCollection(collectionID, name string) error
	GetCollectionName(collectionID string) (string, error)
	IndexCollection() (map[string]string, error)
	DeleteCollection(collectionID string) error
}
