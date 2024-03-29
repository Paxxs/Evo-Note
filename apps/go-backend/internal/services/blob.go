package services

import (
	"v2note/internal/models"
	"v2note/internal/repositories"
)

// BlobServiceImpl implements the BlobService interface.
type BlobServiceImpl struct {
	repo repositories.BlobRepositoryQ
}

// NewBlobService creates a new instance of BlobServiceImpl.
func NewBlobService(repo repositories.BlobRepositoryQ) *BlobServiceImpl {
	return &BlobServiceImpl{repo: repo}
}

// GetBlob retrieves the blob data by collectionID and blob ID.
func (bs *BlobServiceImpl) GetBlob(collectionID, id string) ([]byte, error) {
	blob, err := bs.repo.GetBlob(collectionID, id)
	if err != nil {
		return nil, err
	}
	return blob.Data, nil
}

// PutBlob stores the blob data with the given collectionID and blob ID.
func (bs *BlobServiceImpl) PutBlob(collectionID, id string, data []byte, contentType string) error {
	// Create a new blob instance with the provided data
	blob := &models.Blob{
		ID:           id,
		CollectionID: collectionID,
		ContentType:  contentType,
		Data:         data,
	}
	return bs.repo.PutBlob(blob)
}

// DeleteBlob removes the blob identified by collectionID and blob ID.
func (bs *BlobServiceImpl) DeleteBlob(collectionID, id string) error {
	return bs.repo.DeleteBlob(collectionID, id)
}

// IndexBlobIDs lists the IDs of all stored blobs
func (bs *BlobServiceImpl) IndexBlobIDs(collectionID string) ([]string, error) {
	blobs, err := bs.repo.IndexBlob(collectionID)
	if err != nil {
		return nil, err
	}

	var ids []string
	for _, blob := range blobs {
		ids = append(ids, blob.ID)
	}
	return ids, nil
}
