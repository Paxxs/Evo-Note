package server

import (
	"embed"
	"v2note/pkg/configs"

	// "fmt"
	"io/fs"
	"net/http"
	"net/http/httputil"
	"net/url"

	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
)

func loadFrontendStatic(e *echo.Echo) {
	if configs.DevFlag {
		mylog.Info("using dev mode(proxy dev server)", zap.Bool("DevFlag", configs.DevFlag))
		proxyDevServer := httputil.NewSingleHostReverseProxy(&url.URL{
			Scheme: "http",
			Host:   "localhost:3000",
		})
		mylog.Debug("proxy dev server", zap.String("url", "http://localhost:3000"))
		e.GET("/*", echo.WrapHandler(proxyDevServer))
		return
	}
	assetHandler := http.FileServer(getFileSystem(embedFiles))
	e.GET("/*", echo.WrapHandler(assetHandler))
}

func getFileSystem(embedFiles *embed.FS) http.FileSystem {

	mylog.Info("using server mode, load frontend static.")
	// fmt.Println("using server mode")
	distFs, err := fs.Sub(embedFiles, "dist")
	if err != nil {
		panic(err)
	}

	return http.FS(distFs)
}
