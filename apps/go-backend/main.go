/*
Copyright © 2024 SuperPaxos <superpaxxs@hotmail.com>
*/
package main

import (
	"embed"
	"v2note/cmd"

	"github.com/spf13/cobra"
)

//go:embed all:dist
var assets embed.FS

func main() {
	// https://github.com/spf13/cobra/issues/844
	cobra.MousetrapHelpText = ""

	cmd.Execute(&assets)
}
