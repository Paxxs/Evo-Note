package handler

import (
	"io"
	"net/http"
	"v2note/internal/services"

	"github.com/labstack/echo/v4"
)

// NewDocHandler creates a new instance of DocHandler.
func NewDocHandler(service services.DocService) *DocHandler {
	return &DocHandler{service: service}
}

// Get handles GET requests to retrieve a doc from the database by ID and key.
func (dh *DocHandler) Get(c echo.Context) error {
	id := c.Param("id")
	key := c.Param("key")

	updates, err := dh.service.GetDocUpdates(id, key)
	if err != nil {
		return err
	}

	return c.Blob(http.StatusOK, "application/octet-stream", updates)
}

// Put handles the PUT requests to update or create a doc in the database.
func (dh *DocHandler) Put(c echo.Context) error {
	id := c.Param("id")
	key := c.Param("key")

	data, err := io.ReadAll(c.Request().Body)
	if err != nil {
		return err
	}

	if err := dh.service.PutDocUpdates(id, key, data); err != nil {
		return err
	}
	return c.NoContent(http.StatusOK)
}

// Delete handles DELETE requests to remove a doc by ID and key in the database.
func (dh *DocHandler) Delete(c echo.Context) error {
	id := c.Param("id")
	key := c.Param("key")
	if err := dh.service.DeleteDoc(id, key); err != nil {
		return err
	}
	return c.NoContent(http.StatusOK)
}

// Index handles GET requests to list all doc ids in the database by collection id.
func (dh *DocHandler) Index(c echo.Context) error {
	id := c.Param("id")
	keys, err := dh.service.IndexDocIDs(id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, keys)
}
