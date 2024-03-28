package services

import (
	"v2note/internal/models"
	"v2note/internal/repositories"
)

// DocServiceImpl implements the DocService interface.
type DocServiceImpl struct {
	repo repositories.DocRepositoryQ
}

// NewDocService creates a new instance of DocServiceImpl.
// It takes a DocRepositoryQ as a parameter and returns a pointer to a new DocServiceImpl.
func NewDocService(repo repositories.DocRepositoryQ) *DocServiceImpl {
	return &DocServiceImpl{repo: repo}
}

// GetDocUpdates retrieves the update data of a document identified by collectionID and id.
// It returns the data as a byte slice and any error encountered.
func (ds *DocServiceImpl) GetDocUpdates(collectionID, id string) ([]byte, error) {
	doc, err := ds.repo.GetDoc(collectionID, id)
	if err != nil {
		return nil, err
	}
	return doc.UpdateData, nil
}

// PutDocUpdates updates the document identified by collectionID and id with the provided data.
// It returns any error encountered during the update.
func (ds *DocServiceImpl) PutDocUpdates(collectionID, id string, data []byte) error {
	doc := &models.Doc{
		ID:           id,
		CollectionID: collectionID,
		UpdateData:   data,
	}
	return ds.repo.PutDoc(doc)
}

// DeleteDoc deletes the document identified by collectionID and id.
// It returns any error encountered during the deletion.
func (ds *DocServiceImpl) DeleteDoc(collectionID, id string) error {
	return ds.repo.DeleteDoc(collectionID, id)
}

// IndexDocIDs lists the IDs of all documents.
// It returns a slice of string IDs and any error encountered.
func (ds *DocServiceImpl) IndexDocIDs(collectionID string) ([]string, error) {
	docs, err := ds.repo.IndexDoc(collectionID)
	if err != nil {
		return nil, err
	}

	var ids []string
	for _, doc := range docs {
		ids = append(ids, doc.ID)
	}
	return ids, nil
}
