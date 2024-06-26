/*
Copyright © 2024 SuperPaxos <superpaxxs@hotmail.com>
*/
package cmd

import (
	"v2note/internal/server"

	"github.com/spf13/cobra"
)

// serveCmd represents the serve command
var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Run V2Note in server mode",
	Long: `The serve command launches V2Note as a backend service on a server, enabling access from any location via a web browser.
It facilitates future cloud synchronization and real-time collaborative editing, leveraging CRDT technology for data consistency.`,
	Run: func(cmd *cobra.Command, args []string) {
		server.Start(embedFiles, false)
	},
}

func init() {
	rootCmd.AddCommand(serveCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// serveCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// serveCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
