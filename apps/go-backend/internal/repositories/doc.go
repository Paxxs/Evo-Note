package repositories

import (
	"v2note/internal/models"

	"gorm.io/gorm"
)

// DocRepository implements DocRepositoryQ for document operations.
type DocRepository struct {
	DB *gorm.DB
}

// NewDocRepository creates a new instance of DocRepository.
func NewDocRepository(db *gorm.DB) *DocRepository {
	return &DocRepository{DB: db}
}

// GetDoc retrieves a document by its ID and collection ID.
func (r *DocRepository) GetDoc(collectionID, id string) (*models.Doc, error) {
	var doc models.Doc
	err := r.DB.Where("id = ? AND collection_id = ?", id, collectionID).First(&doc).Error
	if err != nil {
		return nil, err
	}
	return &doc, nil
}

// DeleteDoc removes a document by its ID and collection ID.
func (r *DocRepository) DeleteDoc(collectionID, id string) error {
	return r.DB.Where("id = ? AND collection_id = ?", id, collectionID).Delete(&models.Doc{}).Error
}

// PutDoc inserts or updates a document in the database.
func (r *DocRepository) PutDoc(doc *models.Doc) error {
	return r.DB.Save(doc).Error
}

// IndexDoc returns a list of all documents belonging to a specified collection.
func (r *DocRepository) IndexDoc(collectionID string) ([]*models.Doc, error) {
	var docs []*models.Doc
	err := r.DB.Where("collection_id = ?", collectionID).Find(&docs).Error
	return docs, err
}
