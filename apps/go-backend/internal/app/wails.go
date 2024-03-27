package app

// cspell:words assetserver Frameless Titlebar
import (
	"embed"
	"log"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/logger"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/linux"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

// assets holds the embedded file system containing the distributed assets.
var assets *embed.FS

//go:embed app-icon.png
var icon []byte

// Run executes the main function of the Go application.
//
// It creates an instance of the app structure and sets the default options for the Wails app.
// The options include the title, width, height, and other properties of the app window.
// It also sets the asset server options and the callback functions for various app events.
// The function then calls the Wails.Run function with the provided options.
// If an error occurs during the execution, it logs the error and exits the application.
func Run(fs *embed.FS) {
	assets = fs
	// Create an instance of the app structure
	app := NewApp()
	// default wails options
	opts := &options.App{
		Title:             "v2Note",
		Width:             1024,
		Height:            768,
		MinWidth:          1024,
		MinHeight:         768,
		DisableResize:     false,
		Frameless:         true,
		StartHidden:       false,
		HideWindowOnClose: false,
		BackgroundColour:  &options.RGBA{R: 255, G: 255, B: 255, A: 80},
		AssetServer: &assetserver.Options{
			Assets: *assets,
		},
		Menu:                     nil,
		Logger:                   nil,
		LogLevel:                 logger.DEBUG,
		OnStartup:                app.startup,
		OnDomReady:               app.domReady,
		OnBeforeClose:            app.beforeClose,
		OnShutdown:               app.shutdown,
		WindowStartState:         options.Normal,
		CSSDragProperty:          "--evo-note-draggable",
		CSSDragValue:             "true",
		EnableDefaultContextMenu: true,
		Bind: []interface{}{
			app,
		},
		// Windows platform specific options
		Windows: &windows.Options{
			WebviewIsTransparent:              true,
			WindowIsTranslucent:               true,
			BackdropType:                      windows.Acrylic,
			DisableWindowIcon:                 false,
			DisableFramelessWindowDecorations: false,
			WebviewUserDataPath:               "",
			ZoomFactor:                        1.0,
		},
		// Mac platform specific options
		Mac: &mac.Options{
			TitleBar: &mac.TitleBar{
				TitlebarAppearsTransparent: true,
				HideTitle:                  true,
				HideTitleBar:               true,
				FullSizeContent:            true,
				UseToolbar:                 false,
				HideToolbarSeparator:       true,
			},
			Appearance:           mac.DefaultAppearance,
			WebviewIsTransparent: true,
			WindowIsTranslucent:  true,
			About: &mac.AboutInfo{
				Title:   "v2Note",
				Message: "A Cutting-Edge, Privacy-Centric Note-taking Experience",
				Icon:    icon,
			},
		},
		// Linux platform specific options
		Linux: &linux.Options{
			Icon: icon,
			WindowIsTranslucent: true,
			ProgramName: "v2Note",
		},
	}

	err := wails.Run(opts)
	
	if err != nil {
		log.Fatal(err)
	}
}
