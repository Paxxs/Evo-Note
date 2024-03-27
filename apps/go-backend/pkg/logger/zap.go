package logger

// cspell:words Syncer dpanic natefinch
import (
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// level is a global atomic logging level used across the application.
// zap.NewAtomicLevel creates an atomic level that can be changed dynamically at runtime,
// which is useful for adjusting the log verbosity without restarting the application.
var level = zap.NewAtomicLevel()

// levels maps string representations of log levels to zap's log level constants.
// This allows for easy parsing of configuration files or environment variables
// that specify the log level as text.
var levels = map[string]zapcore.Level{
	"debug": zap.DebugLevel,
	"info":  zap.InfoLevel,
	"warn":  zap.WarnLevel,
	"error": zap.ErrorLevel,
	"fatal": zap.FatalLevel,
}

// Setup configures the global logger with a specified log level.
// The function is designed to be called at application startup
// to initialize the logging infrastructure based on configuration or command-line arguments.
func Setup(levelString string) {

	setLevel(levelString)

	// Replace zap's global logger with a new logger configured to write to standard output
	// and to use the specified log level. This ensures that all subsequent logging
	// throughout the application uses this configuration.
	zap.ReplaceGlobals(
		zap.New(
			zapcore.NewTee(
				zapcore.NewCore(
					getConsoleEncoder(),     // Configure the logger to use a console-friendly encoder.
					zapcore.Lock(os.Stdout), // Lock os.Stdout to make it safe for concurrent use by multiple goroutines.
					level,                   // Use the globally set log level for filtering log messages.
				),
			),
			// Include the caller information (file and line number) in log messages,
			// which is especially useful for debugging.
			zap.AddCaller(),
		),
	)
}

// Rest sets the logging level with the given string.
// It takes a levelString parameter and does not return any value.
func Rest(levelString string) {
	setLevel(levelString)
}

// setLevel Attempt to parse the provided log level string. If parsing fails,
// default to 'info' level to ensure the application has a reasonable
// verbosity level and doesn't fail due to logging configuration issues.
func setLevel(levelString string) {
	l, ok := levels[levelString]
	if !ok {
		l = zap.InfoLevel
	}

	// Set the global log level to the parsed or defaulted value.
	level.SetLevel(l)
}

// getConsoleEncoder configures and returns a zapcore.Encoder that formats logs for console output.
// The encoder uses a development-friendly format, including colored level encoding and
// ISO8601 timestamp encoding, making logs easier to read during development.
func getConsoleEncoder() zapcore.Encoder {
	encoderConfig := zap.NewDevelopmentEncoderConfig()
	// Configure the time format to ISO8601 for easy readability and standardization.
	encoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	// Use colored level encoding to make log levels stand out in console output.
	encoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
	return zapcore.NewConsoleEncoder(encoderConfig)
}
