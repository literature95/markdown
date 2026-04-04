# 开发指南

## 环境要求

| 工具 | 版本 | 说明 |
|------|------|------|
| Node.js | 18+ | 后端运行环境 |
| Git | 2.30+ | 版本控制 |
| Docker | 24+ | 容器化部署（可选） |
| npm | 9+ | 包管理 |

## 项目结构

```
markdown/
├── src/
│   ├── client/                 # 前端 React 代码
│   │   ├── api/                # API 调用封装
│   │   │   └── client.ts
│   │   ├── components/         # 可复用组件
│   │   │   ├── FileList.tsx
│   │   │   └── Header.tsx
│   │   ├── pages/              # 页面组件
│   │   │   ├── Home.tsx
│   │   │   └── Login.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.css
│   │   └── index.html
│   └── server/                 # 后端 Express 服务
│       ├── config/
│       │   └── database.js
│       ├── middlewares/
│       │   └── auth.js
│       ├── models/
│       │   └── User.js
│       ├── routes/
│       │   ├── auth.js
│       │   ├── files.js
│       │   └── shares.js
│       ├── utils/
│       │   └── validators.js
│       ├── index.js
│       └── index.test.js
├── docs/                      # 文档
│   ├── architecture.md
│   └── roadmap.md
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── .env.example
```

## 本地开发

### 1. 克隆并安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd markdown
npm install
```

### 2. 配置环境变量

在项目根目录创建 `.env` 文件，或复制 `.env.example`：

```bash
cp .env.example .env
```

### 3. 启动开发服务器

```bash
npm run dev
```

如果需要分别启动前后端：

```bash
npm run dev:server
npm run dev:client
```

前端默认访问 http://localhost:5173，后端 API 默认 http://localhost:3001

## 常用命令

### 开发模式

```bash
npm run dev         # 同时启动前后端
npm run dev:server  # 启动后端
npm run dev:client  # 启动前端
```

### 生产构建

```bash
npm install
npm run build
npm start
```

## 测试

```bash
npm test
```

## 代码规范

- 提交前运行 `npm run lint`
- 使用 ESLint
- 分支命名：`feature/xxx`、`bugfix/xxx`、`docs/xxx`
- Commit 信息遵循 Conventional Commits

## 数据库

SQLite 数据库文件位于 `data/markdown.db`，首次运行时自动创建。

### 数据库表结构

详见 [架构文档](./docs/architecture.md#数据库设计)

## 常见问题

### 端口被占用

```bash
# 查看端口占用
lsof -i :3001
```

# 结束进程
taskkill /PID <pid> /F
```

### 依赖安装失败

```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install
```
