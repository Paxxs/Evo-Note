package logger

import (
	"strings"

	"go.uber.org/zap"
)

// Module struct represents a logging Module with a specific name.
// This allows for creating logically separated loggers for different parts of an application.
type Module struct {
	name string
}

// Module is an interface for logging modules.
// type Module interface {
// 	Named(name string) module
// 	L() *zap.Logger
// 	S() *zap.SugaredLogger
// }

// NewModule creates a new logging module with a given name.
// The prefix "[Module]" is added to make it clear in the logs that this is a module-specific logger.
func NewModule(name string) *Module {
	return &Module{name: "[Module]" + name}
}

// Named returns a new module instance with an appended name, allowing for hierarchical naming.
// If the input name is empty, it returns the current module without changes.
// If the current module name is empty, it initializes it with the given name.
// Otherwise, it appends the new name to the existing module name, separated by a dot,
// allowing for a structured, hierarchical naming scheme within the application.
func (m Module) Named(name string) Module {
	if name == "" {
		return m
	}
	if m.name == "" {
		cm := NewModule(name)
		m.name = cm.name
	} else {
		m.name = strings.Join([]string{m.name, name}, ".")
	}
	return m
}

// L returns a *zap.Logger with the module's name applied as a named logger.
// This allows for filtering and identifying log entries specific to this module.
func (m Module) L() *zap.Logger {
	return zap.L().Named(m.name)
}

// S returns a *zap.SugaredLogger with the module's name applied as a named logger.
// The SugaredLogger provides a more flexible API for logging, accepting any combination of arguments.
func (m Module) S() *zap.SugaredLogger {
	return zap.S().Named(m.name)
}
