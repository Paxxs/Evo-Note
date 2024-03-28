package handler

import (
	"net/http"
	"v2note/internal/services"

	"github.com/labstack/echo/v4"
)

// NewCollectionHandler creates a new instance of CollectionHandler.
func NewCollectionHandler(service services.CollectionService) *CollectionHandler {
	return &CollectionHandler{service: service}
}

// Index handles GET requests to retrieve all collection ids and names in the database.
func (h *CollectionHandler) Index(c echo.Context) error {
	collectionIDs, err := h.service.IndexCollection()
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, collectionIDs)
}

// Put handles the PUT requests to update or create a collection in the database.
func (h *CollectionHandler) Put(c echo.Context) error {
	id := c.Param("id")
	name := c.Param("name")
	if err := h.service.CreateCollection(id, name); err != nil {
		return err
	}
	return c.NoContent(http.StatusOK)
}

// Delete handles DELETE requests to remove a collection in the database.
func (h *CollectionHandler) Delete(c echo.Context) error {
	id := c.Param("id")
	if err := h.service.DeleteCollection(id); err != nil {
		return err
	}
	return c.NoContent(http.StatusOK)
}
