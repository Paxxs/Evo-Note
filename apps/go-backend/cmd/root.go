/*
Copyright © 2024 SuperPaxos <superpaxxs@hotmail.com>
*/
package cmd

import (
	"embed"
	"os"
	"runtime"
	"v2note/internal/app"
	"v2note/pkg/configs"
	"v2note/pkg/logger"

	"github.com/spf13/cobra"
)

var embedFiles *embed.FS

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "v2note",
	Short: "Launch the V2Note application",
	Long: `V2Note offers a dual editing experience, combining visual block and canvas modes in a single note interface.
It operates on a local-first approach, ensuring data privacy and control. This command opens the V2Note window,
providing a seamless, cross-platform note-taking environment without reliance on cloud services.`,
	Run: func(cmd *cobra.Command, args []string) {
		// https://stackoverflow.com/a/45795717/17509626
		if runtime.GOOS == "windows" {
			hideConsoleWindow()
		}
		app.Run(embedFiles)
	},
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute(embedfs *embed.FS) {
	embedFiles = embedfs
	err := rootCmd.Execute()
	if err != nil {
		os.Exit(1)
	}
}

func init() {
	cobra.OnInitialize(initConfig)

	// Here you will define your flags and configuration settings.
	// Cobra supports persistent flags, which, if defined here,
	// will be global for your application.

	// rootCmd.PersistentFlags().StringVar(&cfgFile, "config", "", "config file (default is $HOME/.v2note.yaml)")

	rootCmd.PersistentFlags().StringVarP(&configs.Path, "config", "c", "", "config file (default is conf/default.yaml)")

	// Cobra also supports local flags, which will only run
	// when this action is called directly.
	// rootCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}

// initConfig reads in config file and ENV variables if set.
func initConfig() {
	// if configs.Path == "" {
	// 	// 如果没有指定配置文件，GUI 模式默认存到 HOME 目录下
	// 	home, err := os.UserHomeDir()
	// 	cobra.CheckErr(err)
	// 	configs.Path = filepath.Join(home, ".v2note.yaml")
	// }
	configs.Setup()
	logger.Setup(configs.Log.Level)
}
