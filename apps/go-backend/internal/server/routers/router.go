package routers

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type Router struct {
	Echo *echo.Echo
	Name string
	DB   *gorm.DB
}

func (r *Router) Init(db *gorm.DB) {
	r.DB = db
	r.Echo = echo.New()
	r.Echo.HideBanner = true
	r.Echo.HidePort = true
}

func (r *Router) RegisterMiddleware(middleware ...echo.MiddlewareFunc) {
	r.Echo.Use(middleware...)
}
