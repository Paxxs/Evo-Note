package configs

// cspell:words mapstructure

// log 结构体定义了日志的配置信息。
type log struct {
	Level string `mapstructure:"LEVEL" yaml:"level"` // Level 定义了日志记录的级别（如 debug、info、warn、error）。
}
