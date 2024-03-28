package routers

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

// Router represents the router.
type Router struct {
	Echo *echo.Echo
	Name string
	DB   *gorm.DB
}

// Init initializes the router.
func (r *Router) Init(db *gorm.DB) {
	r.DB = db
	r.Echo = echo.New()
	r.Echo.HideBanner = true
	r.Echo.HidePort = true
}

// RegisterMiddleware registers the middleware.
func (r *Router) RegisterMiddleware(middleware ...echo.MiddlewareFunc) {
	r.Echo.Use(middleware...)
}
