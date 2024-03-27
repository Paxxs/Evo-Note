package configs_test

import (
	"fmt"
	"os"
	"testing"
	"time"
	"v2note/pkg/configs"

	"github.com/stretchr/testify/assert"
	"gopkg.in/yaml.v2"
)

// TestEnvironmentVariableParsing 测试环境变量解析功能
func TestEnvironmentVariableParsing(t *testing.T) {
	// 设置测试用的环境变量
	os.Setenv("MF_V2NOTE_SERVER_PORT", "80811")
	os.Setenv("MF_V2NOTE_LOG_LEVEL", "debug2")

	// 调用 setup 函数，这里假设 setup 是前面代码段中定义的函数
	configs.Reset()
	configs.Setup()

	os.Unsetenv("MF_V2NOTE_SERVER_PORT")
	os.Unsetenv("MF_V2NOTE_LOG_LEVEL")

	// 验证环境变量是否被正确解析和加载
	assert.Equal(t, "80811", configs.Server.Port, "服务器端口配置应该等于 8080")
	assert.Equal(t, "debug2", configs.Log.Level, "日志级别配置应该等于 debug")
	// assert.Equal(t, 50, DataBase.MaxIdleConns, "数据库 MaxIdleConns 应该正确设置")
	// assert.Equal(t, "123456", DataBase.Dsn, "数据库 DSN 配置应该正确设置")
}

// TestConfigFileToStruct 测试配置文件内容是否正确设置到结构体对象中
func TestConfigFileToStruct(t *testing.T) {

	configs.Path = "conf/test.yaml"

	configFile, err := os.ReadFile(configs.Path)
	if err != nil {
		panic(err)
	}

	var c configs.Config
	if err := yaml.Unmarshal(configFile, &c); err != nil {
		panic(err)
	}
	// t.Logf("配置文件内容：%s\nServer 配置：%+v\nLog 配置：%+v\n", string(configFile), c.Server, c.Log)

	// 重置
	configs.Reset()
	configs.Setup()

	os.Setenv("MF_V2NOTE_SERVER_PORT", "789") // 后期的环境变量不会影响
	time.Sleep(5 * time.Second)

	// 验证配置是否正确加载到结构体中
	assert.Equal(t, c.Server.Port, configs.Server.Port, fmt.Sprintf("从配置文件中读取的端口值应该是 %s", c.Server.Port))
	assert.Equal(t, c.Log.Level, configs.Log.Level, fmt.Sprintf("从配置文件中读取的日志级别应该是 %s", c.Log.Level))
}
