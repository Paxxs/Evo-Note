package repositories

import (
	"errors"
	"v2note/internal/models"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// // BlobRepositoryQ defines the interface for blob storage operations.
// type BlobRepositoryQ interface {
// 	GetBlob(collectionID, id string) (*models.Blob, error)
// 	PutBlob(blob *models.Blob) error
// 	DeleteBlob(collectionID, id string) error
// 	IndexBlob() ([]*models.Blob, error)

// 	// GetBlob(blob *models.Blob) error
// 	// DeleteBlob(blob *models.Blob) error
// 	// PutBlob(blob *models.Blob) error
// 	// IndexBlob(blobs []models.Blob) error
// }

// BlobRepository implements the BlobRepositoryQ interface using a GORM database.
type BlobRepository struct {
	DB *gorm.DB
}

// NewBlobRepository creates a new BlobRepository with the provided database connection.
func NewBlobRepository(db *gorm.DB) *BlobRepository {
	return &BlobRepository{DB: db}
}

// GetBlob retrieves a blob by its ID and collection ID from the repository.
func (r *BlobRepository) GetBlob(collectionID, id string) (*models.Blob, error) {
	var blob models.Blob
	err := r.DB.Where("id = ? AND collection_id = ?", id, collectionID).First(&blob).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("blob not found")
		}
		return nil, err
	}
	return &blob, nil
}

// DeleteBlob removes a blob by its ID and collection ID from the repository.
func (r *BlobRepository) DeleteBlob(collectionID, id string) error {
	return r.DB.Where("id = ? AND collection_id = ?", id, collectionID).Delete(&models.Blob{}).Error
}

// PutBlob inserts or updates a blob in the repository.
func (r *BlobRepository) PutBlob(blob *models.Blob) error {
	return r.DB.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "id"}},
		DoUpdates: clause.AssignmentColumns([]string{"data"}),
	}).Create(&blob).Error
}

// IndexBlob returns a list of all blobs in a specified collection.
func (r *BlobRepository) IndexBlob(collectionID string) ([]*models.Blob, error) {
	var blobs []*models.Blob
	return blobs, r.DB.Where("collection_id = ?", collectionID).Find(&blobs).Error
}
