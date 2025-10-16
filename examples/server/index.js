import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from 'koa-cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = new Koa();
const router = new Router();

// 数据存储目录
const DATA_DIR = path.join(__dirname, 'data');

// 确保数据目录存在
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// 保存数据到文件
async function saveData(type, data) {
  const timestamp = new Date().toISOString();
  const filename = `${type}_${Date.now()}.json`;
  const filepath = path.join(DATA_DIR, filename);
  
  const record = {
    timestamp,
    type,
    data
  };
  
  await fs.writeFile(filepath, JSON.stringify(record, null, 2));
  return filename;
}

// 中间件配置
app.use(cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(bodyParser({
  enableTypes: ['json', 'form'],
  jsonLimit: '10mb',
  formLimit: '10mb'
}));

// 错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error('Server error:', err);
    ctx.status = err.status || 500;
    ctx.body = {
      success: false,
      message: err.message || 'Internal Server Error'
    };
  }
});

// 日志中间件
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ctx.status} - ${ms}ms`);
});

// 路由定义

// 健康检查
router.get('/health', async (ctx) => {
  ctx.body = {
    success: true,
    message: 'Performance SDK Server is running',
    timestamp: new Date().toISOString()
  };
});

// 接收性能数据
router.post('/api/performance', async (ctx) => {
  const data = ctx.request.body;
  
  console.log('Received performance data:', JSON.stringify(data, null, 2));
  
  const filename = await saveData('performance', data);
  
  ctx.body = {
    success: true,
    message: 'Performance data received successfully',
    filename,
    timestamp: new Date().toISOString()
  };
});

// 接收错误数据
router.post('/api/error', async (ctx) => {
  const data = ctx.request.body;
  
  console.log('Received error data:', JSON.stringify(data, null, 2));
  
  const filename = await saveData('error', data);
  
  ctx.body = {
    success: true,
    message: 'Error data received successfully',
    filename,
    timestamp: new Date().toISOString()
  };
});

// 通用日志接口（兼容现有 SDK）
router.post('/api/log', async (ctx) => {
  const data = ctx.request.body;
  
  console.log('Received log data:', JSON.stringify(data, null, 2));
  
  const filename = await saveData('log', data);
  
  ctx.body = {
    success: true,
    message: 'Log data received successfully',
    filename,
    timestamp: new Date().toISOString()
  };
});

// GET 请求处理（用于图片上报方式）
router.get('/api/log', async (ctx) => {
  const { body } = ctx.query;
  
  if (body) {
    try {
      const data = JSON.parse(decodeURIComponent(body));
      console.log('Received GET log data:', JSON.stringify(data, null, 2));
      
      const filename = await saveData('log_get', data);
      
      ctx.body = {
        success: true,
        message: 'GET log data received successfully',
        filename,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      console.error('Error parsing GET data:', err);
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Invalid data format'
      };
    }
  } else {
    ctx.body = {
      success: true,
      message: 'No data received'
    };
  }
});

// 获取存储的数据列表
router.get('/api/data', async (ctx) => {
  try {
    const files = await fs.readdir(DATA_DIR);
    const dataFiles = files.filter(file => file.endsWith('.json'));
    
    ctx.body = {
      success: true,
      files: dataFiles,
      count: dataFiles.length
    };
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Failed to read data directory'
    };
  }
});

// 获取特定数据文件
router.get('/api/data/:filename', async (ctx) => {
  const { filename } = ctx.params;
  const filepath = path.join(DATA_DIR, filename);
  
  try {
    const data = await fs.readFile(filepath, 'utf8');
    ctx.body = JSON.parse(data);
  } catch (err) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      message: 'File not found'
    };
  }
});

// 应用路由
app.use(router.routes());
app.use(router.allowedMethods());

// 启动服务器
const PORT = process.env.PORT || 3000;

async function startServer() {
  await ensureDataDir();
  
  app.listen(PORT, () => {
    console.log(`🚀 Performance SDK Server is running on http://localhost:${PORT}`);
    console.log(`📊 Data will be stored in: ${DATA_DIR}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`📝 API endpoints:`);
    console.log(`   POST http://localhost:${PORT}/api/performance - 性能数据`);
    console.log(`   POST http://localhost:${PORT}/api/error - 错误数据`);
    console.log(`   POST http://localhost:${PORT}/api/log - 通用日志`);
    console.log(`   GET  http://localhost:${PORT}/api/data - 查看数据列表`);
  });
}

startServer().catch(console.error);