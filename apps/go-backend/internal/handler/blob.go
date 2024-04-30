package handler

import (
	"io"
	"net/http"
	"strings"
	"v2note/internal/services"

	"github.com/labstack/echo/v4"
)

// NewBlobHandler creates a new instance of BlobHandler.
func NewBlobHandler(service services.BlobService) *BlobHandler {
	return &BlobHandler{service: service}
}

// Get handles GET requests to retrieve a blob from the database by ID and key.
func (bh *BlobHandler) Get(c echo.Context) error {
	id := c.Param("id")
	key := c.Param("key")
	blobId := mergeStrings(id, key)

	data, err := bh.service.GetBlob(id, blobId)
	if err != nil {
		return err // TODO: 是否数据为 404
	}

	return c.Blob(http.StatusOK, "application/octet-stream", data)
}

// Put handles the PUT requests to update or create a blob in the database.
func (bh *BlobHandler) Put(c echo.Context) error {
	id := c.Param("id")
	key := c.Param("key")
	blobId := mergeStrings(id, key)

	contentType := c.Request().Header.Get("Content-Type")
	data, err := io.ReadAll(c.Request().Body)
	if err != nil {
		return err
	}

	if err := bh.service.PutBlob(id, blobId, data, contentType); err != nil {
		return err
	}
	return c.NoContent(http.StatusOK)
}

// Delete handles DELETE requests to remove a blob by ID and key in the database.
func (bh *BlobHandler) Delete(c echo.Context) error {
	id := c.Param("id")
	key := c.Param("key")
	blobId := mergeStrings(id, key)
	if err := bh.service.DeleteBlob(id, blobId); err != nil {
		return err
	}
	return c.NoContent(http.StatusOK)
}

// Index handles GET requests to list all blob ids in the database by collection id.
func (bh *BlobHandler) Index(c echo.Context) error {
	id := c.Param("id")
	keys, err := bh.service.IndexBlobIDs(id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, keys)
}

func mergeStrings(a, b string) string {
	var builder strings.Builder
	builder.Grow(len(a) + len(b)) // 预先分配足够的空间
	builder.WriteString(a)
	builder.WriteString(b)
	return builder.String()
}
