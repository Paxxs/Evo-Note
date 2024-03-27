package main

import (
	"backend-impl-test/handlers"
	"backend-impl-test/models"

	"github.com/glebarez/sqlite"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"gorm.io/gorm"
)

func main() {
	e := echo.New()

	e.Use(middleware.Logger(), middleware.Recover())

	db, err := gorm.Open(sqlite.Open("gorm.db"), &gorm.Config{})
	if err != nil {
		e.Logger.Fatal("failed to connect database", err)
	}
	db.AutoMigrate(&models.Blob{}, &models.Doc{}, &models.Collection{})
	v1Group := e.Group("/api/v1")
	blobHandler := handlers.NewBlobHandler(db)
	docHandler := handlers.NewDocHandler(db)
	collectionHandler := handlers.NewCollectionHandler(db)

	v1Group.GET("/collection", collectionHandler.Index)
	collectionGroup := v1Group.Group("/collection/:id")
	{
		collectionGroup.PUT("", collectionHandler.AddCollection)
		collectionGroup.DELETE("", collectionHandler.DeleteCollection)

		blobGroup := collectionGroup.Group("/blob")
		{
			blobGroup.GET("/:key", blobHandler.GetBlob)
			blobGroup.GET("", blobHandler.Index)
			blobGroup.PUT("/:key", blobHandler.PutBlob)
			blobGroup.DELETE("/:key", blobHandler.DeleteBlob)
		}

		docGroup := collectionGroup.Group("/doc")
		{
			docGroup.GET("/:key", docHandler.GetDocUpdates)
			docGroup.GET("", docHandler.Index)
			docGroup.PUT("/:key", docHandler.PutDocUpdates)
			docGroup.DELETE("/:key", docHandler.DeleteDocUpdates)
		}

	}
	// // Define routes
	// e.POST("/docs", func(c echo.Context) error {
	// 	// Implement the function to insert a doc
	// 	var doc models.Doc
	// 	if err := c.Bind(&doc); err != nil {
	// 		return err
	// 	}
	// 	result := db.Create(&doc)

	// 	if result.Error != nil {
	// 		return result.Error
	// 	}
	// 	return c.JSON(http.StatusCreated, result)
	// })

	// e.POST("/updates", func(c echo.Context) error {
	// 	// Implement the function to insert an update
	// })

	// e.POST("/blobs", func(c echo.Context) error {
	// 	// Implement the function to insert a blob
	// })

	// e.GET("/blobs/:id", func(c echo.Context) error {
	// 	// Implement the function to retrieve a blob
	// })

	// e.DELETE("/blobs/:id", func(c echo.Context) error {
	// 	// Implement the function to delete a blob
	// })

	// e.GET("/blobs", func(c echo.Context) error {
	// 	// Implement the function to list all blob IDs
	// })

	// Start the server
	e.Logger.Fatal(e.Start(":8080"))
}
