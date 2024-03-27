package logger_test

import (
	"strings"
	"testing"
	"v2note/pkg/logger"
)

func TestNewModule(t *testing.T) {
	moduleName := "TestModule"
	m := logger.NewModule(moduleName).L()
	if m.Name() != "[Module]"+moduleName {
		t.Errorf("Expected %s, got %s", moduleName, m.Name())
	}
}

func TestModule_Named(t *testing.T) {
	baseName := "Base"
	m := logger.NewModule(baseName)
	subModule := m.Named("Sub")

	moduleName := subModule.L().Name()
	if strings.Compare(moduleName, "[Module]Base.Sub") != 0 {
		t.Errorf("Named module name = %s, want contain 'Base.Sub'", moduleName)
	}
	subModule = subModule.Named("Sub2")
	moduleName = subModule.L().Name()
	if strings.Compare(moduleName, "[Module]Base.Sub.Sub2") != 0 {
		t.Errorf("Named module name = %s, want contain 'Base.Sub.Sub2'", moduleName)
	}
}
