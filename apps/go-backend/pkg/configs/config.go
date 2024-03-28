package configs

// cspell:words mapstructure Maxlifetime

import (
	"bytes"
	"fmt"
	"strings"
	"v2note/pkg/logger"

	"github.com/spf13/viper"
	"go.uber.org/zap"
	"gopkg.in/yaml.v2"
)

// Config 结构体定义了应用程序的总体配置结构，包括服务器、日志和数据库配置。
type Config struct {
	Server server `mapstructure:"SERVER" yaml:"server"` // Server 字段映射服务器配置。
	Log    log    `mapstructure:"LOG" yaml:"log"`       // Log 字段映射日志配置。
	// DataBase database `mapstructure:"DB" yaml:"db"`         // DataBase 字段映射数据库配置，特别是 MySQL。
}

// // database 结构体包含了数据库连接和操作的配置信息。
// type database struct {
// 	Enable       bool   `mapstructure:"ENABLE" yaml:"enable"`                 // Enable 定义了是否启用数据库。
// 	Dsn          string `mapstructure:"DSN" yaml:"dsn"`                       // Dsn 提供了数据库源名称，用于数据库连接。
// 	MaxIdleConns int    `mapstructure:"MAX_IDLE_CONNS" yaml:"max_idle_conns"` // MaxIdleConns 定义了连接池中的最大闲置连接数。
// 	MaxOpenConns int    `mapstructure:"MAX_OPEN_CONNS" yaml:"max_open_conns"` // MaxOpenConns 定义了连接池中的最大打开连接数。
// 	Maxlifetime  int    `mapstructure:"MAX_LIFETIME" yaml:"max_lifetime"`     // Maxlifetime 定义了连接的最大生命周期（秒）。
// }

var (
	// Path 存储配置文件的路径。
	Path string

	// Server 存储服务器配置的实例。
	Server server

	// Log 存储日志配置的实例。
	Log log

	// // DataBase 存储数据库配置的实例。
	// DataBase database

	// Version 定义了应用程序的版本号。
	Version = "v1.0.0"

	// AppName 定义了应用程序的名称。
	AppName = "v2Note"
	mLog    *zap.Logger
)

// NewConfig generates a new config struct with default values.
func NewConfig() *Config {
	return &Config{
		Server: server{
			Port: "4115",
			Host: "0.0.0.0",
		},
		Log: log{},
		// DataBase: database{
		// 	MaxIdleConns: 10,
		// },
	}
}

// Setup sets up the configuration by reading from the specified Path or the default "conf" directory and then sets the configuration type to YAML. It also automatically loads environment variables and sets the configuration file to the struct object.
func Setup() {
	mLog = logger.NewModule("configs").L()
	// default config
	// https://github.com/spf13/viper/issues/188#issuecomment-413368673
	b, err := yaml.Marshal(NewConfig())
	if err != nil {
		panic(err)
	}
	viper.SetConfigType("yaml")

	if err := viper.MergeConfig(bytes.NewReader(b)); err != nil {
		panic(err)
	}

	if Path != "" {
		viper.SetConfigFile(Path)
	} else {
		viper.AddConfigPath("conf")
		viper.SetConfigName("default")
	}

	if err := viper.MergeInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			// Config file not found; ignore error if desired
			// mLog.Warn("配置文件未找到。", zap.Error(err))
			// fmt.Println("配置文件未找到。", err)
		} else {

			// Config file was found but another error was produced
			mLog.Warn("Configuration file read/write error:", zap.Error(err))
			// mLog.Panic("配置文件未找到。", zap.Error(err))
			// panic(err)
		}
	}

	viper.SetEnvPrefix("MF_V2NOTE")
	viper.AutomaticEnv()
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	// if err := viper.ReadInConfig(); err != nil {
	// 	panic(err)
	// }

	if err := setConfig(); err != nil { // 最后设定配置文件到结构体对象中
		mLog.Panic("Configuration file parsing error:", zap.Error(err))
		// panic(err)
	}
	viper.SafeWriteConfig()
	// fmt.Println("全部配置：", viper.AllKeys())
	mLog.Debug("All configuration：", zap.String("config", fmt.Sprintf("%v", viper.AllSettings())))
}

// Reset 配置文件重设
func Reset() error {
	return setConfig()
}

// setConfig 将配置文件内容设置到结构体对象中
func setConfig() error {
	var config Config
	if err := viper.Unmarshal(&config); err != nil {
		return err
	}

	Server = config.Server
	Log = config.Log
	// DataBase = config.DataBase
	// viper.WriteConfig()
	return nil
}
