package logger_test

import (
	"testing"
	"v2note/pkg/logger"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func TestSetup(t *testing.T) {
	logger.Setup("debug")
	if logger.NewModule("TestModule").L().Level() != zap.DebugLevel {
		t.Errorf("Unexpected log level")
	}
}

func TestRest(t *testing.T) {
	logger.Setup("debug")
	logger.Rest("error")
	log := logger.NewModule("TestModule").L()
	if log.Core().Enabled(zap.ErrorLevel) != true {
		t.Error("Expected error level to be set")
	}
}

func TestSetLevel(t *testing.T) {
	levels := map[string]zapcore.Level{
		"debug": zap.DebugLevel,
		"info":  zap.InfoLevel,
		"warn":  zap.WarnLevel,
		"error": zap.ErrorLevel,
		"fatal": zap.FatalLevel,
	}

	for levelString, expectedLevel := range levels {
		logger.Setup(levelString) // Assuming setLevel is called inside Setup
		actualLevel := logger.NewModule("TestModule").L().Level()
		if actualLevel != expectedLevel {
			t.Errorf("setLevel(%s) = %v, want %v", levelString, actualLevel, expectedLevel)
		}
	}
}
