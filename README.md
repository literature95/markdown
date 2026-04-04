# MarkShare - Markdown 跨平台共享平台

## 项目概述

基于 Web 的跨平台 Markdown 文件共享系统，采用苹果风格设计，支持 Linux、Windows、macOS 三大平台间的文件共享与查看。

## 设计风格

采用 **Apple Human Interface Guidelines** 设计语言：
- 极简主义 + 大留白
- 渐变蓝色主题 (#0071e3)
- SF Pro 字体风格
- 毛玻璃效果 + 柔和阴影
- 精致动画过渡

## 功能模块

### v1.0 核心功能
- [x] 用户注册 / 登录（JWT 认证）
- [x] Markdown 文件 CRUD
- [x] 文件列表管理
- [x] Markdown 实时预览
- [x] 文件分享功能
- [x] 苹果风格 UI 重设计

### v1.1 扩展功能
- [x] 文件版本历史
- [ ] Git 版本控制
- [ ] 实时协作编辑

### v1.2 高级功能
- [ ] 全文搜索
- [ ] AI 辅助编辑

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端 | React + TypeScript + Vite | 界面框架 |
| 样式 | Tailwind CSS + 自定义CSS | 苹果风格设计系统 |
| 编辑器 | Textarea + Marked | Markdown 编辑与预览 |
| 后端 | Express + Node.js | API 服务 |
| 数据库 | SQLite (sql.js) | 数据存储 |
| 认证 | JWT | 用户认证 |

## 项目结构

```
markdown/
├── src/
│   ├── client/                 # 前端 React 代码
│   │   ├── api/
│   │   │   ├── client.ts      # API 调用
│   │   │   └── socket.ts      # WebSocket 通信
│   │   ├── components/
│   │   │   └── Header.tsx     # 导航栏组件
│   │   ├── pages/
│   │   │   ├── Home.tsx       # 主页（文档管理）
│   │   │   └── Login.tsx      # 登录/注册页
│   │   ├── App.tsx            # 根组件
│   │   ├── main.tsx           # 入口文件
│   │   ├── index.css          # 全局样式（苹果风格）
│   │   └── index.html         # HTML 模板
│   └── server/                # 后端 Express 代码
│       ├── config/
│       │   └── database.js    # SQLite 数据库配置
│       ├── middlewares/
│       │   └── auth.js        # JWT 认证中间件
│       ├── models/
│       │   ├── FileVersion.js # 文件版本模型
│       │   └── User.js        # 用户模型
│       ├── routes/
│       │   ├── ai.js          # AI 路由
│       │   ├── auth.js        # 认证路由
│       │   ├── files.js       # 文件路由
│       │   ├── search.js      # 搜索路由
│       │   ├── shares.js      # 分享路由
│       │   └── versions.js    # 版本路由
│       ├── utils/
│       │   └── validators.js  # 输入验证
│       ├── index.js           # 主服务器文件
│       └── index.test.js      # 服务器测试
├── data/                      # 数据库文件目录
├── docs/                      # 项目文档
│   ├── architecture.md        # 架构文档
│   └── roadmap.md             # 路线图
├── tests/                     # 测试文件
│   └── api.test.js            # API 测试
├── .env                       # 环境变量配置
├── .env.example               # 环境变量示例
├── .eslintrc.js              # ESLint 配置
├── .gitignore                # Git 忽略文件
├── API.md                    # API 文档
├── DEPLOYMENT.md             # 部署文档
├── DEVELOPMENT.md             # 开发文档
├── package.json
├── tailwind.config.js        # Tailwind CSS 配置
├── tsconfig.json             # TypeScript 配置
├── tsconfig.node.json        # Node TypeScript 配置
└── vite.config.ts            # Vite 配置
```

## 开发进度

### 已完成
- [x] 项目初始化与配置
- [x] 数据库设计与实现
- [x] 用户认证系统 (JWT)
- [x] 文件 CRUD 操作
- [x] 文件分享功能
- [x] 文件版本历史
- [x] 苹果风格 UI 重设计
- [x] 登录/注册页面
- [x] 主页文档管理界面

### 进行中
- [ ] 全文搜索功能
- [ ] AI 辅助编辑

### 待开发
- [ ] Git 版本控制集成
- [ ] 实时协作编辑

## 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

### 构建生产版本
```bash
npm run build
```

### 环境变量配置
复制 `.env.example` 为 `.env` 并配置：
```bash
cp .env.example .env
```

## API 文档

详见 [API.md](./API.md)

## 部署文档

详见 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 开发文档

详见 [DEVELOPMENT.md](./DEVELOPMENT.md)
