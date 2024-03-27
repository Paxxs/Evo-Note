package handlers

import (
	"backend-impl-test/models"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm/clause"
)

// AddCollection adds a collection
func (h *CollectionHandler) AddCollection(c echo.Context) error {
	id := c.Param("id")
	collection := models.Collection{
		ID: id,
	}
	result := h.db.Clauses(clause.OnConflict{
		UpdateAll: true,
	}).Create(&collection)
	if result.Error != nil {
		return result.Error
	}
	return c.JSON(200, collection)
}

// DeleteCollection deletes a collection
func (h *CollectionHandler) DeleteCollection(c echo.Context) error {
	id := c.Param("id")
	result := h.db.Where("id = ?", id).Delete(&models.Collection{})
	if result.Error != nil {
		return result.Error
	}
	return c.JSON(200, result.RowsAffected)
}

// Index is a function that returns the id array of collections
func (h *CollectionHandler) Index(c echo.Context) error {
	var collections []models.Collection
	result := h.db.Find(&collections)
	if result.Error != nil {
		return result.Error
	}
	return c.JSON(200, collections)
}
