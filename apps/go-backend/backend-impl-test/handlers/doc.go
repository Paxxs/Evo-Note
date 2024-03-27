package handlers

import (
	"backend-impl-test/models"
	"fmt"
	"io"
	"net/http"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm/clause"
)

// GetDocUpdates retrieves a doc's updates from the database based on the provided ID.
func (h *DocHandler) GetDocUpdates(c echo.Context) error {
	id := c.Param("id")
	key := c.Param("key")
	var doc models.Doc
	result := h.db.Where("collection_id = ? AND id = ?", id, key).First(&doc)
	if result.Error != nil {
		return result.Error
	}
	// 返回 doc 的 UpdateData blob
	return c.Blob(http.StatusOK, "application/octet-stream", doc.UpdateData)
}

// PutDocUpdates handles the HTTP PUT request to store a doc's updates in the database.
func (h *DocHandler) PutDocUpdates(c echo.Context) error {
	id := c.Param("id")
	key := c.Param("key")
	data, err := io.ReadAll(c.Request().Body)
	if err != nil {
		return err
	}
	doc := models.Doc{
		CollectionID: id,
		ID:           key,
		UpdateData:   data,
	}
	h.db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "id"}},
		DoUpdates: clause.AssignmentColumns([]string{"update_data"}),
	}).Create(&doc)
	return c.JSON(http.StatusOK, doc)
}

// DeleteDocUpdates deletes a doc's updates using the provided ID and key.
func (h *DocHandler) DeleteDocUpdates(c echo.Context) error {
	id := c.Param("id")
	key := c.Param("key")
	result := h.db.Where("collection_id = ? AND id = ?", id, key).Delete(&models.Doc{})
	fmt.Println("删除doc", key, result, result.RowsAffected)
	if result.Error != nil {
		return result.Error
	}
	return c.JSON(http.StatusOK, result.RowsAffected)
}

// Index is a function that returns the id array of docs by collection ID.
func (h *DocHandler) Index(c echo.Context) error {
	id := c.Param("id")
	var docs []models.Doc
	result := h.db.Where("collection_id = ?", id).Find(&docs)
	if result.Error != nil {
		return result.Error
	}
	return c.JSON(http.StatusOK, docs)
}
