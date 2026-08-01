---
title: Node.js从入门到精通
date: 2026-07-30
tags: 
  - 转载
  - 技术文档
  - 知识
---

很多人第一次接触 Node.js，会把它理解成"用 JavaScript 写后端"。
这句话没错，但远远不够。

真正掌握 Node.js，意味着你不仅会启动一个 HTTP 服务，还能理解异步 I/O、事件循环、模块系统、流、进程管理、数据库、测试、安全、性能优化和线上部署。

如果你正在学习前端，希望补齐服务端能力；或者已经写过一些 Node.js 接口，却总感觉知识零散，那么这篇文章可以作为一张完整的学习地图。

---

## 一、Node.js 到底是什么？

Node.js 是一个基于 V8 JavaScript 引擎的 JavaScript 运行时。

浏览器中的 JavaScript 主要操作页面、响应用户交互；Node.js 则让 JavaScript 可以脱离浏览器运行，并获得文件系统、网络、进程、操作系统等服务端能力。

需要先澄清三个常见误区。

### 1. Node.js 不是一门新语言

它使用的仍然是 JavaScript。

你在前端学过的变量、函数、对象、数组、Promise、`async/await` 等语法，在 Node.js 中依然适用。

### 2. Node.js 不是一个 Web 框架

Express、Koa、NestJS 才是框架。

Node.js 本身提供了底层运行环境，以及 `http`、`fs`、`path`、`stream` 等核心模块。

### 3. "单线程"不等于"只能做一件事"

Node.js 中，JavaScript 代码通常在一个主线程中执行，但文件读写、网络请求、DNS 查询等任务可以由操作系统或底层线程池协助处理。

因此，Node.js 非常擅长处理大量 I/O 密集型任务，例如：

- REST API；
- BFF 服务；
- 即时通信；
- API 网关；
- 文件上传与下载；
- 服务端渲染；
- 自动化脚本与开发工具。

但对于长时间占用 CPU 的计算任务，例如视频转码、大规模图像处理、复杂科学计算，不能直接堆在主线程中执行，否则会阻塞整个服务。

---

## 二、安装 Node.js 与创建第一个项目

实际开发中，建议使用 Node.js 的活跃 LTS 版本，并通过版本管理工具管理多个版本。

安装完成后，可以检查环境：

```bash
node -v
npm -v
```

创建项目：

```bash
mkdir nodejs-learning
cd nodejs-learning
npm init -y
```

执行后会生成 `package.json`，它是 Node.js 项目的核心配置文件之一。

一个最基础的 `package.json` 如下：

```json
{
  "name": "nodejs-learning",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node src/index.js",
    "dev": "node --watch src/index.js"
  }
}
```

其中：

- `name`：项目名称；
- `version`：项目版本；
- `type: "module"`：启用 ES Module；
- `scripts`：项目命令；
- `npm run dev`：以监听模式启动，文件变化后自动重启。

创建入口文件：

```bash
mkdir src
```

```javascript
// src/index.js
console.log('Hello Node.js!');
```

运行：

```bash
npm run start
```

至此，你已经完成了第一个 Node.js 程序。

---

## 三、掌握模块系统：CommonJS 与 ES Module

随着项目变大，不可能把所有代码都写在一个文件中。模块系统负责拆分代码、导出能力和管理依赖。

Node.js 中常见两套模块规范。

### 1. CommonJS

CommonJS 使用 `require` 和 `module.exports`：

```javascript
// math.cjs
function add(a, b) {
  return a + b;
}

module.exports = {
  add
};
```

```javascript
// index.cjs
const { add } = require('./math.cjs');

console.log(add(2, 3));
```

### 2. ES Module

ES Module 使用 `import` 和 `export`：

```javascript
// math.js
export function add(a, b) {
  return a + b;
}
```

```javascript
// index.js
import { add } from './math.js';

console.log(add(2, 3));
```

新项目通常更推荐 ES Module，因为它与现代前端工程保持一致，也更利于静态分析和工具链处理。

不过在维护老项目时，你仍然会频繁遇到 CommonJS。

### 3. ES Module 中如何获取当前目录？

CommonJS 中可以直接使用 `__dirname`，但 ES Module 中没有这个全局变量，可以这样处理：

```javascript
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname);
```

---

## 四、npm：依赖管理与项目脚本

npm 不只是"下载包的工具"，它还承担依赖管理、版本锁定、脚本执行和包发布等职责。

### 1. 安装生产依赖

```bash
npm install express
```

生产依赖会写入 `dependencies`。

### 2. 安装开发依赖

```bash
npm install --save-dev eslint
```

开发依赖会写入 `devDependencies`，通常包括测试、代码检查、构建等工具。

### 3. `package-lock.json` 有什么用？

它会锁定实际安装的依赖版本与依赖树，帮助不同环境得到尽可能一致的安装结果。

因此，业务项目通常应该提交 `package-lock.json`。

在 CI 或生产环境中，优先使用：

```bash
npm ci
```

它会严格根据锁文件安装依赖，结果更可预测。

### 4. 语义化版本

常见版本格式：

```
主版本.次版本.修订版本
```

例如：

```
3.2.1
```

一般来说：

- 修订版本：修复兼容性问题；
- 次版本：增加向后兼容的新功能；
- 主版本：可能包含不兼容变更。

依赖版本前常见的符号：

```json
{
  "dependencies": {
    "some-package": "^3.2.1",
    "another-package": "~2.4.0"
  }
}
```

- `^3.2.1`：通常允许升级次版本和修订版本，但不跨主版本；
- `~2.4.0`：通常只允许升级修订版本；
- 精确版本：只安装指定版本。

---

## 五、异步编程：Node.js 的核心能力

Node.js 最重要的学习门槛，不是语法，而是异步思维。

### 1. 为什么需要异步？

假设读取一个文件需要 200 毫秒。

如果程序必须停在原地等待，整个服务在这段时间里就无法继续处理其他请求。

异步 I/O 的思路是：

1. 发起文件读取；
2. 主线程继续处理其他任务；
3. 文件读取完成后，再执行对应回调。

这也是 Node.js 能高效处理大量并发连接的重要原因。

### 2. 回调函数

早期 Node.js 大量使用回调：

```javascript
import fs from 'node:fs';

fs.readFile('./data.txt', 'utf8', (error, content) => {
  if (error) {
    console.error(error);
    return;
  }

  console.log(content);
});
```

约定通常是"错误优先回调"，第一个参数表示错误。

当异步步骤不断嵌套时，代码很容易变成"回调地狱"。

### 3. Promise

Promise 可以让异步流程更清晰：

```javascript
import { readFile } from 'node:fs/promises';

readFile('./data.txt', 'utf8')
  .then((content) => {
    console.log(content);
  })
  .catch((error) => {
    console.error(error);
  });
```

### 4. `async/await`

现代 Node.js 项目中，最常见的写法是：

```javascript
import { readFile } from 'node:fs/promises';

async function main() {
  try {
    const content = await readFile('./data.txt', 'utf8');
    console.log(content);
  } catch (error) {
    console.error('读取失败：', error);
  }
}

main();
```

`async/await` 本质上仍然基于 Promise，但阅读体验更接近同步代码。

### 5. 串行与并行

下面的代码是串行执行：

```javascript
const user = await getUser();
const orders = await getOrders();
```

如果两个任务互不依赖，可以并行：

```javascript
const [user, orders] = await Promise.all([
  getUser(),
  getOrders()
]);
```

`Promise.all` 中任意一个任务失败，整体就会失败。

如果希望收集所有执行结果，可以使用：

```javascript
const results = await Promise.allSettled([
  getUser(),
  getOrders()
]);
```

实际项目中，能并行的任务不要无意义地串行等待。

---

## 六、理解事件循环

事件循环是理解 Node.js 性能问题的关键。

可以把 Node.js 主线程想象成一个只有一名工作人员的窗口。

同步代码会直接排队执行；异步任务交给底层系统处理，完成后把对应回调重新放入待执行队列。

下面的输出顺序是什么？

```javascript
console.log('A');

setTimeout(() => {
  console.log('B');
}, 0);

Promise.resolve().then(() => {
  console.log('C');
});

console.log('D');
```

结果通常是：

```
A
D
C
B
```

原因是：

1. 同步代码先执行；
2. Promise 回调属于微任务；
3. 定时器回调在后续事件循环阶段执行。

不过，真实事件循环比这个模型更复杂。学习初期先记住一句话：

> 不要在主线程中执行长时间的同步任务。

例如下面的代码会阻塞服务：

```javascript
function blockMainThread() {
  const start = Date.now();

  while (Date.now() - start < 5000) {
    // 持续占用 CPU 五秒
  }
}
```

在这五秒内，当前进程几乎无法及时响应其他请求。

CPU 密集型任务可以考虑：

- 拆分计算；
- 使用 `worker_threads`；
- 转交独立计算服务；
- 使用任务队列异步处理；
- 横向扩容多个进程或容器。

---

## 七、核心模块：先把基本功练扎实

在引入第三方包之前，建议先熟悉 Node.js 自带的核心模块。

### 1. `fs`：文件系统

```javascript
import { readFile, writeFile } from 'node:fs/promises';

const filePath = './message.txt';

await writeFile(filePath, 'Hello Node.js', 'utf8');

const content = await readFile(filePath, 'utf8');

console.log(content);
```

### 2. `path`：路径处理

不要手动拼接系统路径：

```javascript
const filePath = 'uploads/' + fileName;
```

更稳妥的写法是：

```javascript
import path from 'node:path';

const filePath = path.join('uploads', fileName);
```

`path.join` 会根据操作系统处理路径分隔符。

### 3. `os`：操作系统信息

```javascript
import os from 'node:os';

console.log('CPU 核心数：', os.cpus().length);
console.log('总内存：', os.totalmem());
console.log('空闲内存：', os.freemem());
```

### 4. `events`：事件机制

```javascript
import { EventEmitter } from 'node:events';

const emitter = new EventEmitter();

emitter.on('order-created', (order) => {
  console.log('收到新订单：', order.id);
});

emitter.emit('order-created', {
  id: 'ORDER_1001'
});
```

事件机制适合做模块之间的轻量解耦。

但跨进程、跨机器的可靠消息传递，应该使用专业消息队列，而不是只依赖内存事件。

### 5. `crypto`：加密与哈希

```javascript
import { createHash } from 'node:crypto';

const hash = createHash('sha256')
  .update('hello')
  .digest('hex');

console.log(hash);
```

注意：普通哈希不适合直接存储用户密码。密码应使用专门的慢哈希算法，并正确配置盐值和计算成本。

---

## 八、Stream：处理大文件的正确姿势

假设要把一个 2GB 文件发送给客户端。

如果使用 `readFile`，程序可能会尝试一次性把整个文件读入内存，带来巨大的内存压力。

Stream 的思路是"边读边处理"。

```javascript
import fs from 'node:fs';

const readStream = fs.createReadStream('./large-file.zip');

readStream.on('data', (chunk) => {
  console.log('收到一块数据：', chunk.length);
});

readStream.on('end', () => {
  console.log('读取完成');
});

readStream.on('error', (error) => {
  console.error('读取失败：', error);
});
```

更推荐使用 `pipeline`，它能更好地处理错误和背压：

```javascript
import fs from 'node:fs';
import { pipeline } from 'node:stream/promises';

await pipeline(
  fs.createReadStream('./source.txt'),
  fs.createWriteStream('./target.txt')
);
```

Stream 常用于：

- 大文件上传与下载；
- 视频和音频传输；
- 数据压缩；
- 日志处理；
- 数据库结果导出；
- ETL 数据管道。

掌握 Stream，是从"会写接口"走向"理解 Node.js"的重要一步。

---

## 九、使用原生 `http` 模块搭建服务

下面用 Node.js 自带的 `http` 模块创建一个服务：

```javascript
import http from 'node:http';

const server = http.createServer((request, response) => {
  response.statusCode = 200;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');

  response.end(JSON.stringify({
    message: 'Hello Node.js'
  }));
});

server.listen(3000, () => {
  console.log('服务已启动：http://localhost:3000');
});
```

访问：

```bash
http://localhost:3000
```

一个请求到达时，我们通常需要处理：

- 请求方法；
- 请求路径；
- 查询参数；
- 请求头；
- 请求体；
- 状态码；
- 响应内容；
- 异常情况。

原生模块能帮助你理解 Web 框架到底做了什么。

例如，手动区分路由：

```javascript
import http from 'node:http';

const server = http.createServer((request, response) => {
  const { method, url } = request;

  response.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (method === 'GET' && url === '/api/users') {
    response.statusCode = 200;
    response.end(JSON.stringify({
      data: [
        { id: 1, name: '小明' },
        { id: 2, name: '小红' }
      ]
    }));
    return;
  }

  response.statusCode = 404;
  response.end(JSON.stringify({
    message: '接口不存在'
  }));
});

server.listen(3000);
```

当路由、参数解析和错误处理越来越复杂时，就需要使用框架。

---

## 十、Express 实战：完成一个 REST API

安装 Express：

```bash
npm install express
```

创建 `src/app.js`：

```javascript
import express from 'express';

const app = express();

app.use(express.json());

const todos = [
  {
    id: 1,
    title: '学习 Node.js',
    completed: false
  }
];

app.get('/health', (request, response) => {
  response.json({
    status: 'ok'
  });
});

app.get('/api/todos', (request, response) => {
  response.json({
    data: todos
  });
});

app.get('/api/todos/:id', (request, response) => {
  const id = Number(request.params.id);
  const todo = todos.find((item) => item.id === id);

  if (!todo) {
    response.status(404).json({
      message: '任务不存在'
    });
    return;
  }

  response.json({
    data: todo
  });
});

app.post('/api/todos', (request, response) => {
  const title = request.body?.title?.trim();

  if (!title) {
    response.status(400).json({
      message: 'title 不能为空'
    });
    return;
  }

  const todo = {
    id: Date.now(),
    title,
    completed: false
  };

  todos.push(todo);

  response.status(201).json({
    data: todo
  });
});

app.patch('/api/todos/:id', (request, response) => {
  const id = Number(request.params.id);
  const todo = todos.find((item) => item.id === id);

  if (!todo) {
    response.status(404).json({
      message: '任务不存在'
    });
    return;
  }

  if (typeof request.body.title === 'string') {
    todo.title = request.body.title.trim();
  }

  if (typeof request.body.completed === 'boolean') {
    todo.completed = request.body.completed;
  }

  response.json({
    data: todo
  });
});

app.delete('/api/todos/:id', (request, response) => {
  const id = Number(request.params.id);
  const index = todos.findIndex((item) => item.id === id);

  if (index === -1) {
    response.status(404).json({
      message: '任务不存在'
    });
    return;
  }

  todos.splice(index, 1);

  response.status(204).end();
});

app.use((request, response) => {
  response.status(404).json({
    message: '接口不存在'
  });
});

app.use((error, request, response, next) => {
  console.error(error);

  response.status(500).json({
    message: '服务器内部错误'
  });
});

export default app;
```

创建 `src/index.js`：

```javascript
import app from './app.js';

const port = Number(process.env.PORT) || 3000;

const server = app.listen(port, () => {
  console.log(`服务已启动：http://localhost:${port}`);
});

function shutdown(signal) {
  console.log(`收到 ${signal}，准备关闭服务`);

  server.close((error) => {
    if (error) {
      console.error('服务关闭失败：', error);
      process.exit(1);
    }

    console.log('服务已安全关闭');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
```

启动服务：

```bash
npm run dev
```

测试创建任务：

```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"完成 Node.js 实战"}'
```

这个示例已经包含了一个后端项目的基本骨架：

- 路由；
- 参数读取；
- JSON 请求体解析；
- 状态码；
- 数据校验；
- 404 处理；
- 统一异常处理；
- 优雅退出。

不过内存数组只适合演示，进程一旦重启，数据就会丢失。真实项目需要数据库。

---

## 十一、中间件：Express 的核心设计

Express 中间件本质上是一个函数：

```javascript
function middleware(request, response, next) {
  next();
}
```

它可以在请求到达最终路由之前执行逻辑。

例如记录请求耗时：

```javascript
app.use((request, response, next) => {
  const start = Date.now();

  response.on('finish', () => {
    const duration = Date.now() - start;

    console.log(
      `${request.method} ${request.originalUrl} ${response.statusCode} ${duration}ms`
    );
  });

  next();
});
```

中间件常见用途包括：

- 身份认证；
- 权限校验；
- 日志记录；
- 参数校验；
- 跨域处理；
- 限流；
- 安全响应头；
- 异常处理。

中间件顺序非常重要。

例如，解析 JSON 的中间件必须放在读取 `request.body` 的路由之前：

```javascript
app.use(express.json());
```

统一异常处理中间件通常放在所有路由之后。

---

## 十二、项目结构：从"能运行"走向"可维护"

项目变大后，不要继续把所有代码堆在 `app.js` 中。

可以采用分层结构：

```
src/
├── app.js
├── index.js
├── config/
│   └── env.js
├── routes/
│   └── todo.routes.js
├── controllers/
│   └── todo.controller.js
├── services/
│   └── todo.service.js
├── repositories/
│   └── todo.repository.js
├── middlewares/
│   ├── error-handler.js
│   └── auth.js
├── validators/
│   └── todo.validator.js
├── utils/
│   └── logger.js
└── errors/
    └── app-error.js
```

各层职责可以这样划分：

### Route

定义 URL、HTTP 方法和中间件组合。

### Controller

读取请求参数，调用业务层，组织响应。

### Service

处理业务规则，是核心业务逻辑所在。

### Repository

封装数据库访问，不让业务层到处直接写 SQL。

### Middleware

处理认证、日志、异常和通用请求逻辑。

### Validator

校验输入数据格式和业务约束。

这套结构不是唯一答案，但它能帮助团队建立清晰边界。

一个常见原则是：

> Controller 要薄，Service 要聚焦，Repository 只负责数据访问。

---

## 十三、数据库：不要只学"怎么连接"

Node.js 可以连接 MySQL、PostgreSQL、MongoDB、Redis 等数据库。

学习数据库时，不要只停留在"安装驱动并执行查询"，还要理解：

- 表结构与索引；
- 事务；
- 唯一约束；
- 外键；
- 连接池；
- SQL 注入；
- 慢查询；
- 分页；
- 数据迁移；
- 备份与恢复。

### 1. 永远优先使用参数化查询

不要直接拼接用户输入：

```javascript
const sql = `SELECT * FROM users WHERE email = '${email}'`;
```

应该使用参数化查询：

```javascript
const sql = 'SELECT * FROM users WHERE email = ?';
const params = [email];
```

不同数据库驱动的占位符语法可能不同，但核心思想一致：数据与 SQL 结构分离。

### 2. 正确使用连接池

每次请求都新建数据库连接，成本很高。

生产项目通常会在应用启动时创建连接池，请求处理时复用连接。

### 3. 事务不是越多越好

转账、扣库存、创建订单等多步骤操作，通常需要事务保证一致性。

但长事务会占用资源并增加锁竞争。事务范围应该尽可能小。

### 4. ORM 不能替代数据库基础

ORM 可以提高开发效率，但它不会自动解决：

- 索引缺失；
- N+1 查询；
- 事务边界错误；
- 锁冲突；
- 不合理的数据模型；
- 大数据量下的分页性能问题。

会用 ORM，不等于会数据库。

---

## 十四、错误处理：不要让异常到处失控

实际项目中，可以定义统一业务错误：

```javascript
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);

    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
  }
}
```

在业务代码中抛出：

```javascript
import { AppError } from '../errors/app-error.js';

export async function getTodoById(id) {
  const todo = await todoRepository.findById(id);

  if (!todo) {
    throw new AppError('任务不存在', 404, 'TODO_NOT_FOUND');
  }

  return todo;
}
```

统一处理：

```javascript
app.use((error, request, response, next) => {
  const statusCode = error.statusCode || 500;

  if (statusCode >= 500) {
    console.error(error);
  }

  response.status(statusCode).json({
    code: error.code || 'INTERNAL_ERROR',
    message: statusCode >= 500 ? '服务器内部错误' : error.message
  });
});
```

生产环境中，不要把完整堆栈、数据库错误、服务器路径直接返回给客户端。

错误信息既要方便排查，也要避免泄露系统内部细节。

---

## 十五、环境变量与配置管理

不要把密码、密钥和生产地址直接写进代码：

```javascript
const databasePassword = '123456';
```

应该使用环境变量：

```javascript
const databasePassword = process.env.DATABASE_PASSWORD;
```

可以集中读取和校验：

```javascript
function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`缺少环境变量：${name}`);
  }

  return value;
}

export const config = {
  port: Number(process.env.PORT) || 3000,
  databaseUrl: requireEnv('DATABASE_URL'),
  jwtSecret: requireEnv('JWT_SECRET')
};
```

常见配置包括：

```
PORT
NODE_ENV
DATABASE_URL
REDIS_URL
JWT_SECRET
LOG_LEVEL
```

需要注意：

- `.env` 文件不应提交敏感生产配置；
- 不要把密钥写进 Git 历史；
- 不同环境使用不同配置；
- 应用启动时尽早校验必要配置；
- 密钥泄露后必须轮换，而不是只删除文件。

---

## 十六、身份认证与权限控制

身份认证解决"你是谁"，权限控制解决"你能做什么"。

常见登录流程：

1. 用户提交账号和密码；
2. 服务端查询用户；
3. 使用安全算法校验密码；
4. 登录成功后签发会话或令牌；
5. 后续请求携带身份凭证；
6. 服务端验证凭证和权限。

不要自行设计加密算法。

常见方案包括：

- 服务端 Session；
- JWT；
- OAuth 2.0；
- OpenID Connect；
- 企业统一身份认证。

使用 JWT 时，要重点关注：

- 过期时间；
- 签名密钥管理；
- 刷新机制；
- 撤销策略；
- 令牌存储位置；
- 权限变更后的同步问题。

JWT 只是令牌格式，不是完整的权限系统。

权限模型可以从简单的角色控制开始：

```javascript
function requireRole(...allowedRoles) {
  return (request, response, next) => {
    const role = request.user?.role;

    if (!role || !allowedRoles.includes(role)) {
      response.status(403).json({
        message: '无权执行此操作'
      });
      return;
    }

    next();
  };
}
```

使用：

```javascript
app.delete(
  '/api/users/:id',
  requireAuth,
  requireRole('admin'),
  deleteUser
);
```

---

## 十七、安全：上线之前必须检查

Node.js 项目常见安全风险并不神秘，大多数来自输入不可信、权限边界模糊和配置错误。

### 1. 校验所有外部输入

包括：

- 请求体；
- URL 参数；
- 查询参数；
- 请求头；
- Cookie；
- 上传文件；
- 第三方接口返回值；
- 消息队列中的消息。

"来自前端"不代表可信，因为任何人都可以绕过前端直接调用接口。

### 2. 防止注入

数据库使用参数化查询。

执行系统命令时，避免把用户输入直接拼入命令字符串。

### 3. 限制请求体大小

```javascript
app.use(express.json({
  limit: '1mb'
}));
```

### 4. 限流

登录、验证码、搜索和公开接口尤其需要限流。

### 5. 设置安全响应头

可以通过安全中间件设置常见安全响应头，但仍需理解每个策略的含义，避免"装上就安全"的错觉。

### 6. 控制跨域

CORS 不是越宽松越好。

生产环境中不要无条件允许任意来源携带敏感凭证。

### 7. 依赖安全

定期检查：

```bash
npm audit
```

但不要机械执行所有自动修复。升级前需要阅读变更说明并运行测试，尤其要关注主版本升级。

### 8. 文件上传

至少检查：

- 文件大小；
- 扩展名；
- MIME 类型；
- 实际文件内容；
- 文件名；
- 存储目录；
- 访问权限；
- 恶意文件扫描。

不要直接使用用户上传的原始文件名作为服务器路径。

---

## 十八、测试：让重构不再靠运气

Node.js 自带测试模块，可以从最简单的单元测试开始。

创建 `src/utils/sum.js`：

```javascript
export function sum(a, b) {
  return a + b;
}
```

创建 `test/sum.test.js`：

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';

import { sum } from '../src/utils/sum.js';

test('sum 可以计算两个数字之和', () => {
  assert.equal(sum(2, 3), 5);
});
```

在 `package.json` 中增加：

```json
{
  "scripts": {
    "test": "node --test"
  }
}
```

运行：

```bash
npm test
```

项目中的测试通常分为：

### 单元测试

测试一个函数、类或模块，执行快，定位问题准确。

### 集成测试

测试多个模块协作，例如业务层和数据库。

### 接口测试

从 HTTP 层验证请求、认证、响应和错误处理。

### 端到端测试

从用户流程验证整个系统。

测试重点不是追求一个漂亮的覆盖率数字，而是覆盖高风险逻辑：

- 金额计算；
- 权限判断；
- 订单状态流转；
- 数据一致性；
- 重试逻辑；
- 异常分支。

---

## 十九、日志、监控与可观测性

本地开发时，`console.log` 足够方便；生产环境中，需要结构化日志。

结构化日志示例：

```json
{
  "level": "info",
  "time": "2026-01-01T10:00:00.000Z",
  "requestId": "req_123",
  "method": "GET",
  "path": "/api/todos",
  "statusCode": 200,
  "durationMs": 18
}
```

推荐每个请求携带唯一 `requestId`，这样可以串联：

- 网关日志；
- 应用日志；
- 数据库查询；
- 下游服务调用；
- 异步任务。

线上服务至少应关注：

- 请求量；
- 错误率；
- 响应时间；
- CPU 使用率；
- 内存使用率；
- 事件循环延迟；
- 数据库连接池；
- 慢查询；
- 外部依赖失败率；
- 队列积压；
- 进程重启次数。

健康检查接口也很重要：

```javascript
app.get('/health', (request, response) => {
  response.json({
    status: 'ok',
    uptime: process.uptime()
  });
});
```

更完整的就绪检查还应验证数据库、缓存等关键依赖是否可用。

---

## 二十、性能优化：先测量，再优化

性能优化最忌讳"凭感觉改代码"。

正确流程应该是：

1. 明确性能目标；
2. 构造可重复的压测场景；
3. 收集 CPU、内存、延迟和吞吐量；
4. 找到真正瓶颈；
5. 修改后重新测量。

常见瓶颈包括：

### 1. 同步 API

避免在请求路径中使用可能阻塞主线程的同步操作，例如：

```javascript
import fs from 'node:fs';

const content = fs.readFileSync('./large-file.txt', 'utf8');
```

服务端请求处理中应优先使用异步版本。

### 2. 重复数据库查询

检查 N+1 查询、缺失索引和不必要的全表扫描。

### 3. 返回数据过大

使用分页、字段裁剪、压缩和缓存。

### 4. 无限制并发

一次启动几万个异步任务，并不代表性能更好，反而可能压垮数据库或下游服务。

可以通过任务队列或并发控制限制同时执行数量。

### 5. 内存泄漏

常见原因：

- 全局数组不断增长；
- 缓存没有淘汰策略；
- 事件监听器未移除；
- 定时器未清理；
- 闭包长期引用大对象；
- 请求对象被意外保存。

### 6. CPU 密集计算

使用 Worker 线程：

```javascript
import {
  Worker,
  isMainThread,
  parentPort,
  workerData
} from 'node:worker_threads';

if (isMainThread) {
  const worker = new Worker(new URL(import.meta.url), {
    workerData: 40
  });

  worker.on('message', (result) => {
    console.log('计算结果：', result);
  });

  worker.on('error', (error) => {
    console.error('Worker 失败：', error);
  });
} else {
  const result = fibonacci(workerData);
  parentPort.postMessage(result);
}

function fibonacci(n) {
  if (n <= 1) {
    return n;
  }

  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

示例只是展示机制。真实计算任务还要考虑任务拆分、超时、错误恢复和 Worker 池。

---

## 二十一、缓存与消息队列

当系统流量和复杂度上升后，缓存与消息队列会频繁出现。

### 缓存适合解决什么问题？

- 热点数据重复查询；
- 计算结果复用；
- 会话存储；
- 限流计数；
- 临时状态；
- 分布式锁的部分场景。

缓存设计最难的部分不是"怎么写入"，而是：

- 何时失效；
- 如何更新；
- 如何防止缓存穿透；
- 如何防止缓存击穿；
- 如何防止缓存雪崩；
- 数据不一致能容忍多久。

### 消息队列适合解决什么问题？

- 异步发送邮件和短信；
- 订单后续处理；
- 日志与数据采集；
- 削峰填谷；
- 服务解耦；
- 失败重试；
- 事件驱动架构。

使用队列后，要考虑：

- 消息是否可能重复；
- 消费是否幂等；
- 失败如何重试；
- 是否需要死信队列；
- 消息顺序是否重要；
- 如何监控积压；
- 消息丢失如何处理。

不要把"接入队列"误认为"自动获得可靠性"。

---

## 二十二、Docker 化与生产部署

一个简单的 Dockerfile：

```dockerfile
FROM node:lts-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY src ./src

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "src/index.js"]
```

构建镜像：

```bash
docker build -t node-todo-api .
```

运行：

```bash
docker run --rm \
  -p 3000:3000 \
  -e PORT=3000 \
  node-todo-api
```

生产环境中建议固定明确的 Node.js 镜像版本，并建立依赖升级流程，避免镜像标签变化导致不可预测结果。

一个可上线的服务还应具备：

- 反向代理或负载均衡；
- HTTPS；
- 环境变量与密钥管理；
- 健康检查；
- 自动重启；
- 日志收集；
- 指标监控；- 告警；
- 数据备份；
- 灰度发布；
- 回滚方案；
- 资源限制；
- 优雅退出。

部署完成并不等于项目结束，真正的工程工作从上线后才开始。

---

## 二十三、Node.js 进阶框架怎么选？

掌握原生 Node.js 和 Express 之后，可以根据项目需求选择框架。

### Express

特点：

- 生态成熟；
- 上手简单；
- 灵活；
- 自由度高。

适合中小型 API、教学、快速原型和需要高度自定义的项目。

### Koa

特点：

- 核心精简；
- 中间件机制清晰；
- 更强调组合能力。

适合希望自己搭建项目基础设施的团队。

### NestJS

特点：

- 强工程化；
- 模块、控制器、服务、依赖注入等概念完整；
- 对大型 TypeScript 项目友好。

适合多人协作、业务复杂、生命周期较长的后端项目。

框架不是越重越好。

小项目追求开发速度，大项目更重视规范、边界和长期维护成本。

---

## 二十四、TypeScript：大型项目的重要搭档

JavaScript 灵活，但当项目规模扩大后，类型错误、参数约定和重构成本会明显增加。

TypeScript 可以提供：

- 静态类型检查；
- 更好的编辑器提示；
- 更安全的重构；
- 更清晰的接口契约；
- 更好的团队协作体验。

示例：

```typescript
interface CreateTodoInput {
  title: string;
}

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

function createTodo(input: CreateTodoInput): Todo {
  return {
    id: Date.now(),
    title: input.title,
    completed: false
  };
}
```

但 TypeScript 只能在开发和编译阶段提供帮助。

外部请求进入运行时后，类型并不会自动得到保证，因此接口参数仍然必须进行运行时校验。

---

## 二十五、从入门到精通的学习路线

可以按照下面的顺序学习。

### 第一阶段：基础语法与运行环境

掌握：

- JavaScript 基础；
- npm；
- `package.json`；
- CommonJS 与 ES Module；
- 核心模块；
- 命令行参数；
- 环境变量。

目标：能够编写和运行 Node.js 脚本。

### 第二阶段：异步与网络编程

掌握：

- Promise；
- `async/await`；
- 事件循环；
- EventEmitter；
- Stream；
- Buffer；
- HTTP；
- REST API。

目标：能够独立完成一个接口服务。

### 第三阶段：工程化

掌握：

- 项目分层；
- 配置管理；
- 参数校验；
- 统一错误处理；
- 日志；
- 测试；
- ESLint；
- TypeScript；
- Git 工作流。

目标：项目不仅能运行，而且可读、可测、可维护。

### 第四阶段：数据与安全

掌握：

- SQL；
- 索引；
- 事务；
- ORM；
- Redis；
- 身份认证；
- 权限控制；
- 安全防护；
- 文件上传。

目标：能够开发真实业务系统。

### 第五阶段：性能与架构

掌握：

- 性能分析；
- Worker 线程；
- 缓存；
- 消息队列；
- 幂等；
- 限流；
- 重试；
- 熔断；
- 分布式系统基础；
- 可观测性。

目标：能够处理高并发和复杂业务场景。

### 第六阶段：部署与运维

掌握：

- Linux；
- Docker；
- CI/CD；
- HTTPS；
- 反向代理；
- 健康检查；
- 灰度发布；
- 监控告警；
- 容量规划。

目标：让服务稳定地运行在线上，而不只是"在我电脑上没问题"。

---

## 二十六、真正"精通"Node.js 的标志

精通并不等于背完所有 API。

一个真正成熟的 Node.js 开发者，通常具备以下能力：

1. 能判断任务是 I/O 密集型还是 CPU 密集型；
2. 能识别事件循环阻塞；
3. 能设计清晰的模块边界；
4. 能正确处理错误、超时、重试和取消；
5. 能设计数据库索引和事务边界；
6. 能建立认证、授权和输入校验；
7. 能编写可靠测试；
8. 能定位内存、CPU 和延迟问题；
9. 能设计日志、指标和追踪；
10. 能完成部署、监控、告警和回滚；
11. 能在复杂度与开发效率之间做权衡；
12. 能写出别人愿意维护的代码。

技术深度不只体现在"知道多少"，更体现在"能否做出合理选择"。

---

## 结语

Node.js 的入门非常快：

```javascript
console.log('Hello Node.js');
```

但从"能写代码"到"能构建可靠服务"，中间还隔着异步模型、数据库、安全、测试、性能和运维等完整知识体系。

最有效的学习方式，不是继续收藏更多教程，而是完成一个真实项目，并持续迭代：

- 第一版：实现增删改查；
- 第二版：接入数据库；
- 第三版：增加登录与权限；
- 第四版：增加测试和日志；
- 第五版：Docker 化并部署；
- 第六版：压测、监控并优化；
- 第七版：加入缓存、队列和异步任务。

当你能够解释每一个技术选择背后的原因，也能在系统出问题时快速定位根因，你就已经跨过了"会用 Node.js"，开始真正走向"精通 Node.js"。不要只追求把接口写出来，还要追问它在并发、失败、重启、攻击和数据异常时会发生什么。

> [原文链接](https://mp.weixin.qq.com/s/jW6PsxEaNJhUihOH2zzh1A)
