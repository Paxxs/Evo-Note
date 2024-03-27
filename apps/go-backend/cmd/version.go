/*
Copyright © 2024 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"fmt"
	"v2note/pkg/configs"

	"runtime/debug"

	"github.com/spf13/cobra"
)

// versionCmd represents the version command
var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Displays the build information of the application",
	Long: `The buildinfo command displays detailed build information of the application,
including the path, main version, vcs revision, and timestamp.

This command is useful for developers and users to understand the build context and version
of the application, facilitating easier tracking and management.`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Printf("😀 %s version %s\n", configs.AppName, configs.Version)
		fmt.Println("Made with ❤️ by SuperPaxos\n--------------------------")
		info, ok := debug.ReadBuildInfo()
		if !ok {
			fmt.Println("No build info")
			return
		}

		fmt.Println("Path:", info.Path)
		if info.Main.Version != "" {
			fmt.Println("Main Version:", info.Main.Version)
		}

		// 遍历Settings寻找vcs信息
		for _, setting := range info.Settings {
			switch setting.Key {
			case "vcs.revision":
				fmt.Println("Revision:", setting.Value)
			case "vcs.time":
				fmt.Println("Time:", setting.Value)
			case "GOOS":
				fmt.Println("OS:", setting.Value)
			case "GOARCH":
				fmt.Println("ARCH:", setting.Value)
			}
		}
	},
}

func init() {
	rootCmd.AddCommand(versionCmd)
}
