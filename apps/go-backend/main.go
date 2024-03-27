/*
Copyright © 2024 SuperPaxos <superpaxxs@hotmail.com>
*/
package main

import (
	"embed"
	"v2note/cmd"
)

//go:embed all:dist
var assets embed.FS

func main() {
	cmd.Execute(&assets)
}
