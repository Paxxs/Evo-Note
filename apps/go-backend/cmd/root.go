/*
Copyright © 2024 SuperPaxos <superpaxxs@hotmail.com>
*/
package cmd

import (
	"embed"
	"fmt"
	"os"
	"v2note/internal/app"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var cfgFile string
var embedFiles *embed.FS

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "v2note",
	Short: "Launch the V2Note application",
	Long: `V2Note offers a dual editing experience, combining visual block and canvas modes in a single note interface.
It operates on a local-first approach, ensuring data privacy and control. This command opens the V2Note window,
providing a seamless, cross-platform note-taking environment without reliance on cloud services.`,
	Run: func(cmd *cobra.Command, args []string) {
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

	rootCmd.PersistentFlags().StringVar(&cfgFile, "config", "", "config file (default is $HOME/.v2note.yaml)")

	// Cobra also supports local flags, which will only run
	// when this action is called directly.
	rootCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}

// initConfig reads in config file and ENV variables if set.
func initConfig() {
	if cfgFile != "" {
		// Use config file from the flag.
		viper.SetConfigFile(cfgFile)
	} else {
		// Find home directory.
		home, err := os.UserHomeDir()
		cobra.CheckErr(err)

		// Search config in home directory with name ".v2note" (without extension).
		viper.AddConfigPath(home)
		viper.SetConfigType("yaml")
		viper.SetConfigName(".v2note")
	}

	viper.AutomaticEnv() // read in environment variables that match

	// If a config file is found, read it in.
	if err := viper.ReadInConfig(); err == nil {
		fmt.Fprintln(os.Stderr, "Using config file:", viper.ConfigFileUsed())
	}
}
