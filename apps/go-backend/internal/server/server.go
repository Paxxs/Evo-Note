package server

import (
	"context"
	"embed"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"time"
	"v2note/internal/server/routers"
	"v2note/pkg/configs"
	"v2note/pkg/logger"

	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

var e *echo.Echo
var embedFiles *embed.FS
var db *gorm.DB // TODO 移除db
var mylog *zap.Logger

// Start server
func Start(files *embed.FS, webviewMode bool) {
	mylog = logger.NewModule("Server").L()

	// config path
	mylog.Debug("config path", zap.String("Path", configs.Path))

	// Router init
	embedFiles = files
	e = routers.InitPublicAPI(db)

	// load static files
	if !webviewMode {
		loadFrontendStatic(e)
		e.HidePort = false
	}

	// windows 上这个信号应该不起作用的
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt)
	defer stop()

	// Start server
	go func() {
		if !webviewMode {
			mylog.Info(fmt.Sprintf("starting server on localhost:%s", configs.Server.Port))
		}
		if err := e.Start(":" + configs.Server.Port); err != nil && err != http.ErrServerClosed {
			mylog.Fatal("shutting down the server", zap.Error(err))
		}

	}()

	// 如果在 webview 下，不等待中断信号，由 webview 来管理生命周期
	if webviewMode {
		mylog.Info("webview mode enabled")
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
		mylog.Fatal("shutdown server", zap.Error(err))
	}
}
