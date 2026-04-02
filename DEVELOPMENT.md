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
markdown-1/
├── backend/                    # 后端服务
│   ├── src/
│   │   ├── controllers/       # 控制器
│   │   ├── middlewares/       # 中间件
│   │   ├── models/            # 数据模型
│   │   ├── routes/            # 路由
│   │   ├── utils/             # 工具函数
│   │   └── index.js           # 入口文件
│   ├── package.json
│   └── .env                   # 环境变量（需创建）
├── frontend/                   # 前端应用
│   ├── src/
│   │   ├── components/        # 组件
│   │   ├── pages/             # 页面
│   │   ├── hooks/             # 自定义 Hooks
│   │   ├── utils/             # 工具函数
│   │   ├── App.tsx            # 根组件
│   │   └── main.tsx           # 入口文件
│   ├── package.json
│   └── vite.config.ts
├── docs/                      # 文档
│   ├── architecture.md
│   └── roadmap.md
└── README.md
```

## 本地开发

### 1. 克隆并安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd markdown-1

# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 2. 配置环境变量

在后端目录创建 `.env` 文件：

```env
PORT=3000
JWT_SECRET=your-secret-key-change-in-production
DB_PATH=./data/markdown.db
NODE_ENV=development
```

### 3. 启动开发服务器

```bash
# 终端1：启动后端
cd backend
npm run dev

# 终端2：启动前端
cd frontend
npm run dev
```

前端默认访问 http://localhost:5173，后端 API 默认 http://localhost:3000

## 常用命令

### 后端

```bash
cd backend

npm run dev      # 开发模式启动
npm start        # 生产模式启动
npm test         # 运行测试
```

### 前端

```bash
cd frontend

npm run dev      # 开发模式启动
npm run build    # 构建生产版本
npm run preview  # 预览生产版本
npm run lint     # 代码检查
```

## 测试

### 后端测试

```bash
cd backend
npm test
```

### 前端测试

```bash
cd frontend
npm test
```

## 代码规范

- 提交前运行 `npm run lint`
- 使用 ESLint + Prettier
- 分支命名：`feature/xxx`、`bugfix/xxx`、`docs/xxx`
- Commit 信息遵循 Conventional Commits

## 数据库

SQLite 数据库文件位于 `backend/data/markdown.db`，首次运行自动创建。

### 数据库表结构

详见 [架构文档](./docs/architecture.md#数据库设计)

## 常见问题

### 端口被占用

```bash
# 查看端口占用
netstat -ano | findstr :3000

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
