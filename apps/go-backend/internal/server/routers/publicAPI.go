package routers

import (
	"v2note/internal/handler"
	"v2note/internal/repositories"
	"v2note/internal/server/middlewares"
	"v2note/internal/services"
	"v2note/pkg/logger"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"gorm.io/gorm"
)

var publicAPI *Router

// InitPublicAPI initializes the public API router.
func InitPublicAPI(db *gorm.DB) *echo.Echo {
	publicAPI = &Router{}
	publicAPI.Name = "publicAPI"

	publicAPI.Init(db)
	// 注册中间件
	registerPublicAPIMiddleware()
	// 注册路由
	registerPublicAPIRouter(db)
	return publicAPI.Echo
}

func registerPublicAPIMiddleware() {
	publicAPI.RegisterMiddleware(middleware.Recover(), middlewares.ZapLogger(
		logger.NewModule("publicAPI").L(),
	))
}

func registerPublicAPIRouter(db *gorm.DB) {

	collectionRepo := repositories.NewCollectionRepository(db)
	collectionService := services.NewCollectionService(collectionRepo)
	collectionHandler := handler.NewCollectionHandler(collectionService)

	docHandler := handler.NewDocHandler(
		services.NewDocService(
			repositories.NewDocRepository(db),
		),
	)

	blobHandler := handler.NewBlobHandler(
		services.NewBlobService(
			repositories.NewBlobRepository(db),
		),
	)

	v1Group := publicAPI.Echo.Group("/api/v1")

	v1Group.GET("/collection", collectionHandler.Index)
	collectionGroup := v1Group.Group("/collection/:id")
	{
		collectionGroup.PUT("", collectionHandler.Put)
		collectionGroup.DELETE("", collectionHandler.Delete)

		blobGroup := collectionGroup.Group("/blob")
		{
			blobGroup.GET("/:key", blobHandler.Get)
			blobGroup.GET("", blobHandler.Index)
			blobGroup.PUT("/:key", blobHandler.Put)
			blobGroup.DELETE("/:key", blobHandler.Delete)
		}

		docGroup := collectionGroup.Group("/doc")
		{
			docGroup.GET("/:key", docHandler.Get)
			docGroup.GET("", docHandler.Index)
			docGroup.PUT("/:key", docHandler.Put)
			docGroup.DELETE("/:key", docHandler.Delete)
		}

	}
}
