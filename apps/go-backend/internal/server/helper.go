package server

import (
	"embed"
	// "fmt"
	"io/fs"
	"net/http"

	"github.com/labstack/echo/v4"
)

func loadFrontendStatic(e *echo.Echo) {
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
