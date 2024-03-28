package services

import "v2note/internal/repositories"

// CollectionServiceImpl implements the CollectionService interface.
type CollectionServiceImpl struct {
	repo repositories.CollectionRepositoryQ
}

// NewCollectionService creates a new instance of CollectionServiceImpl.
// It accepts a CollectionRepositoryQ and returns a new CollectionServiceImpl.
func NewCollectionService(repo repositories.CollectionRepositoryQ) *CollectionServiceImpl {
	return &CollectionServiceImpl{repo: repo}
}

// CreateCollection creates a new collection with the specified ID and name.
// It returns an error if the creation fails.
func (cs *CollectionServiceImpl) CreateCollection(collectionID, name string) error {
	return cs.repo.CreateCollection(collectionID, name)
}

// GetCollectionName retrieves the name of the collection specified by the collectionID.
// It returns the name of the collection and any error encountered.
func (cs *CollectionServiceImpl) GetCollectionName(collectionID string) (string, error) {
	collection, err := cs.repo.GetCollection(collectionID)
	if err != nil {
		return "", err
	}
	return collection.Name, nil
}

// IndexCollection returns a map of collection IDs to their names.
// It returns the map and any error encountered.
func (cs *CollectionServiceImpl) IndexCollection() (map[string]string, error) {
	collections, err := cs.repo.IndexCollection()
	if err != nil {
		return nil, err
	}

	collectionMap := make(map[string]string)
	for _, collection := range collections {
		collectionMap[collection.ID] = collection.Name
	}
	return collectionMap, nil
}

// DeleteCollection deletes the collection specified by the collectionID.
func (cs *CollectionServiceImpl) DeleteCollection(collectionID string) error {
	return cs.repo.DeleteCollection(collectionID)
}
