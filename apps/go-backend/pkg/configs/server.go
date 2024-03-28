package configs

// cspell:words mapstructure

// server 结构体包含了应用服务器的配置信息。
type server struct {
	Port string `mapstructure:"PORT" yaml:"port"` // Port 定义服务器监听的端口号。
	Host string `mapstructure:"HOST" yaml:"host"` // Host 定义服务器监听的主机地址。
	// MaxJob            int    `mapstructure:"MAX_JOB" yaml:"max_job"`                           // MaxJob 定义服务器能够同时处理的最大任务数量。
	// CleanOldDataHours int    `mapstructure:"CLEAN_OLD_DATA_HOURS" yaml:"clean_old_data_hours"` // CleanOldDataHours 定义了多少小时后旧数据应该被清理。
	// RunMode           string `mapstructure:"RUN_MODE" yaml:"run_mode"`                         // RunMode 定义了应用的运行模式（如开发模式或生产模式）。
	// ReadTimeout       int    `mapstructure:"READ_TIMEOUT" yaml:"read_timeout"`                 // ReadTimeout 定义了读操作的超时时间（秒）。
	// WriteTimeout      int    `mapstructure:"WRITE_TIMEOUT" yaml:"write_timeout"`               // WriteTimeout 定义了写操作的超时时间（秒）。
}
