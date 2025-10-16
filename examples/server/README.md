# Performance SDK Server

基于 Koa 的简单服务器，用于接收和存储 Performance SDK 上报的数据。

## 功能特性

- 🚀 基于 Koa 框架的轻量级服务器
- 📊 支持多种数据类型接收（性能数据、错误数据、通用日志）
- 💾 自动文件存储，按时间戳命名
- 🔍 提供数据查询接口
- 🌐 支持 CORS 跨域请求
- 📝 详细的请求日志记录

## 快速开始

### 安装依赖

```bash
cd examples/server
npm install
```

### 启动服务器

```bash
npm start
```

服务器将在 `http://localhost:3000` 启动。

### 开发模式

```bash
npm run dev
```

使用 Node.js 的 `--watch` 模式，文件变更时自动重启。

## API 接口

### 健康检查

```bash
GET /health
```

返回服务器运行状态。

### 接收性能数据

```bash
POST /api/performance
Content-Type: application/json

{
  "type": "performance",
  "data": {
    "loadTime": 1200,
    "domReady": 800
  }
}
```

### 接收错误数据

```bash
POST /api/error
Content-Type: application/json

{
  "type": "error",
  "data": {
    "message": "Script error",
    "stack": "..."
  }
}
```

### 通用日志接口

```bash
POST /api/log
Content-Type: application/json

{
  "type": "log",
  "data": {
    "level": "info",
    "message": "User action"
  }
}
```

### GET 方式上报（图片上报）

```bash
GET /api/log?body=encodeURIComponent(JSON.stringify(data))
```

### 查看数据列表

```bash
GET /api/data
```

返回所有存储的数据文件列表。

### 查看具体数据

```bash
GET /api/data/:filename
```

返回指定文件的数据内容。

## 数据存储

- 数据存储在 `data/` 目录下
- 文件命名格式：`{type}_{timestamp}.json`
- 每个文件包含：
  - `timestamp`: 接收时间
  - `type`: 数据类型
  - `data`: 原始数据

## 示例数据格式

存储的数据文件示例：

```json
{
  "timestamp": "2025-10-16T06:58:22.032Z",
  "type": "performance",
  "data": {
    "type": "performance",
    "data": {
      "loadTime": 1200,
      "domReady": 800
    }
  }
}
```

## 测试

使用 curl 测试接口：

```bash
# 健康检查
curl -X GET http://localhost:3000/health

# 发送性能数据
curl -X POST http://localhost:3000/api/performance \
  -H "Content-Type: application/json" \
  -d '{"type":"performance","data":{"loadTime":1200,"domReady":800}}'

# 查看数据列表
curl -X GET http://localhost:3000/api/data

# 查看具体数据
curl -X GET http://localhost:3000/api/data/performance_1760597902032.json
```

## 环境变量

- `PORT`: 服务器端口，默认 3000

## 注意事项

- 服务器支持 CORS，允许跨域请求
- 请求体大小限制为 10MB
- 数据目录会自动创建
- 所有请求都会记录访问日志