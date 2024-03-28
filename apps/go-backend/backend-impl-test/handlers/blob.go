package handlers

import (
	"backend-impl-test/models"
	"io"
	"net/http"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm/clause"
)

// GetBlob retrieves a blob from the database based on the provided ID and key.
func (h *BlobHandler) GetBlob(c echo.Context) error {
	id := c.Param("id")
	key := c.Param("key")
	var blob models.Blob
	result := h.db.Where("id = ? AND collection_id = ?", key, id).First(&blob)
	if result.Error != nil {
		return result.Error
	}
	return c.Blob(http.StatusOK, "application/octet-stream", blob.Data)
}

// Put handles the HTTP PUT request to store a blob in the database.
func (h *BlobHandler) Put(c echo.Context) error {
	id := c.Param("id")
	key := c.Param("key")

	data, err := io.ReadAll(c.Request().Body)
	if err != nil {
		return err
	}
	blob := models.Blob{
		CollectionID: id,
		ID:           key,
		Data:         data,
	}
	h.db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "id"}},
		DoUpdates: clause.AssignmentColumns([]string{"data"}),
	}).Create(&blob)
	return c.JSON(http.StatusOK, blob)
}

// DeleteBlob deletes a blob using the provided ID and key.
func (h *BlobHandler) DeleteBlob(c echo.Context) error {
	id := c.Param("id")
	key := c.Param("key")
	result := h.db.Where("id = ? AND collection_id = ?", key, id).Delete(&models.Blob{})
	if result.Error != nil {
		return result.Error
	}
	return c.JSON(http.StatusOK, result.RowsAffected)
}

// Index is a function that returns the id array of blobs.
func (h *BlobHandler) Index(c echo.Context) error {
	var blobs []models.Blob
	result := h.db.Find(&blobs)
	if result.Error != nil {
		return result.Error
	}
	// 返回 blobs 的 id 数组
	ids := make([]string, len(blobs))
	for i, blob := range blobs {
		ids[i] = blob.ID
	}
	return c.JSON(http.StatusOK, ids)
}
