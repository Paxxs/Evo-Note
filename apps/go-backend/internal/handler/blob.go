package handler

import (
	"io"
	"net/http"

	"github.com/labstack/echo/v4"
)

func (bh *BlobHandler) Get(c echo.Context) error {
	id := c.Param("id")
	key := c.Param("key")

	data, err := bh.service.GetBlob(id, key)
	if err != nil {
		return err // TODO: 是否数据为 404
	}

	return c.Blob(http.StatusOK, "application/octet-stream", data)
}

func (bh *BlobHandler) Put(c echo.Context) error {
	id := c.Param("id")
	key := c.Param("key")

	data, err := io.ReadAll(c.Request().Body)
	if err != nil {
		return err
	}

	if err := bh.service.PutBlob(id, key, data); err != nil {
		return err
	}
	return c.NoContent(http.StatusOK)
}
func (bh *BlobHandler) Delete(c echo.Context) error {
	id := c.Param("id")
	key := c.Param("key")
	if err := bh.service.DeleteBlob(id, key); err != nil {
		return err
	}
	return c.NoContent(http.StatusOK)
}

func (bh *BlobHandler) Index(c echo.Context) error {
	id := c.Param("id")
	keys, err := bh.service.IndexBlobIDs(id)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, keys)
}
