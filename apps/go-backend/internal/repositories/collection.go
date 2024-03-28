package repositories

import (
	"v2note/internal/models"

	"gorm.io/gorm"
)

// CollectionRepository implements CollectionRepositoryQ for collection operations.
type CollectionRepository struct {
	DB *gorm.DB
}

// NewCollectionRepository creates a new instance of CollectionRepository.
func NewCollectionRepository(db *gorm.DB) *CollectionRepository {
	return &CollectionRepository{DB: db}
}

// CreateCollection adds a new collection with the specified ID and name.
func (r *CollectionRepository) CreateCollection(collectionID, name string) error {
	collection := models.Collection{
		ID:   collectionID,
		Name: name,
	}
	return r.DB.Create(&collection).Error
}

// GetCollection retrieves a collection by its ID.
func (r *CollectionRepository) GetCollection(collectionID string) (*models.Collection, error) {
	var collection models.Collection
	err := r.DB.Where("id = ?", collectionID).First(&collection).Error
	if err != nil {
		return nil, err
	}
	return &collection, nil
}

// UpdateCollection updates the name of a collection specified by its ID.
func (r *CollectionRepository) UpdateCollection(collectionID, name string) error {
	return r.DB.Model(&models.Collection{}).Where("id = ?", collectionID).Update("name", name).Error
}

// DeleteCollection removes a collection by its ID.
func (r *CollectionRepository) DeleteCollection(collectionID string) error {
	return r.DB.Where("id = ?", collectionID).Delete(&models.Collection{}).Error
}

// IndexCollection returns a list of all collections in the database.
func (r *CollectionRepository) IndexCollection() ([]*models.Collection, error) {
	var collections []*models.Collection
	err := r.DB.Find(&collections).Error
	return collections, err
}
