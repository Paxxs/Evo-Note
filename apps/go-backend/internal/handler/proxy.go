package handler

import (
	"bytes"
	"io"
	"net/http"

	"github.com/labstack/echo/v4"
)

// NewProxyHandler creates a new instance of ProxyHandler.
func NewProxyHandler() *ProxyHandler {
	return &ProxyHandler{}
}

// GetImage handles GET requests to proxy an image to the client.
func (*ProxyHandler) GetImage(c echo.Context) error {
	// 从查询参数获取URL
	url := c.QueryParam("url")
	if url == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "URL is required")
	}

	// 对目标URL执行GET请求
	resp, err := http.Get(url)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadGateway, "Error fetching image")
	}
	defer resp.Body.Close()

	// 设置响应头部
	for key, values := range resp.Header {
		for _, value := range values {
			c.Response().Header().Set(key, value)
		}
	}

	// 将响应内容直接转发给客户端
	return c.Stream(resp.StatusCode, resp.Header.Get("Content-Type"), resp.Body)
}

// GetWebPageInfo handles POST requests to proxy a web page information to the client.
func (*ProxyHandler) GetWebPageInfo(c echo.Context) error {
	// 定义目标服务器地址
	targetURL := "https://affine-worker.toeverything.workers.dev/api/worker/link-preview"
	// 创建客户端以发送请求
	client := &http.Client{}

	// 从原始请求中读取正文
	body, err := io.ReadAll(c.Request().Body)
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}

	// 创建新请求
	req, err := http.NewRequest("POST", targetURL, bytes.NewBuffer(body))
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}

	// 复制头信息，特别是 Content-Type
	req.Header.Set("Content-Type", c.Request().Header.Get("Content-Type"))
	// 如果需要，可以设置其他头部，例如 User-Agent 或 Authorization
	// req.Header.Set("User-Agent", "MyCustomUserAgent")
	// req.Header.Set("Authorization", "Bearer your_token_here")

	// 发送请求
	resp, err := client.Do(req)
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}
	defer resp.Body.Close()

	// 读取响应
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}

	// 设置响应头部信息和状态码
	for key, values := range resp.Header {
		for _, value := range values {
			c.Response().Header().Set(key, value)
		}
	}
	return c.String(resp.StatusCode, string(respBody))
}
