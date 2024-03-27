package routers

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"gorm.io/gorm"
)

var publicAPI *Router

func InitPublicAPI(db *gorm.DB) *echo.Echo {
	publicAPI = &Router{}
	publicAPI.Name = "publicAPI"

	publicAPI.Init(db)
	// 注册中间件
	registerPublicAPIMiddleware()
	// 注册路由
	registerPublicAPIRouter()
	return publicAPI.Echo
}

func registerPublicAPIMiddleware() {
	publicAPI.RegisterMiddleware(middleware.Recover())
}

func registerPublicAPIRouter() {
	v1Group := publicAPI.Echo.Group("/api/v1")

	v1Group.GET("/collection", func(c echo.Context) error {
		return nil
	})
	collectionGroup := v1Group.Group("/collection/:id")
	{
		replaceMe := func(c echo.Context) error {
			return nil
		}

		collectionGroup.PUT("", replaceMe)
		collectionGroup.DELETE("", replaceMe)

		blobGroup := collectionGroup.Group("/blob")
		{
			blobGroup.GET("/:key", replaceMe)
			blobGroup.GET("", replaceMe)
			blobGroup.PUT("/:key", replaceMe)
			blobGroup.DELETE("/:key", replaceMe)
		}

		docGroup := collectionGroup.Group("/doc")
		{
			docGroup.GET("/:key", replaceMe)
			docGroup.GET("", replaceMe)
			docGroup.PUT("/:key", replaceMe)
			docGroup.DELETE("/:key", replaceMe)
		}

	}
}
