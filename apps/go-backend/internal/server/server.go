package server

import (
	"context"
	"embed"
	"net/http"
	"os"
	"os/signal"
	"time"
	"v2note/internal/server/routers"

	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"gorm.io/gorm"
)

var e *echo.Echo
var embedFiles *embed.FS
var db *gorm.DB // TODO 移除db

// Start server
func Start(files *embed.FS, webviewMode bool) {
	// Router init
	embedFiles = files
	e = routers.InitPublicAPI(db)
	e.Logger.SetLevel(log.DEBUG)

	// load static files
	if !webviewMode {
		loadFrontendStatic(e)
	}

	// windows 上这个信号应该不起作用的
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt)
	defer stop()

	// Start server
	go func() {
		if err := e.Start("localhost:8080"); err != nil && err != http.ErrServerClosed {
			e.Logger.Fatal("shutting down the server", err)
		}
	}()

	// 如果在 webview 下，不等待中断信号，由 webview 来管理生命周期
	if webviewMode {
		e.Logger.Info("webview mode")
		return
	}

	// Wait for interrupt signal to gracefully shutdown the server with a timeout of 10 seconds.
	<-ctx.Done()
	Stop()
}

// Stop server
func Stop() {
	// Shutdown server
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := e.Shutdown(ctx); err != nil {
		e.Logger.Fatal(err)
	}
}
