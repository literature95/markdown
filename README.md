# Markdown 跨平台共享平台

## 项目概述

基于 Web 的跨平台 Markdown 文件共享系统，支持 Linux、Windows、macOS 三大平台间的文件共享、查看和协作编辑。

## MVP 定义

### v1.0 核心功能（第一阶段）
- [x] 用户注册 / 登录（JWT 认证）
- [x] Markdown 文件 CRUD（创建、读取、更新、删除）
- [x] 文件列表管理
- [x] Markdown 实时预览

### v1.1 扩展功能（第二阶段）
- [ ] 文件分享功能
- [ ] Git 版本控制
- [ ] 实时协作编辑

### v1.2 高级功能（第三阶段）
- [ ] 全文搜索
- [ ] AI 辅助编辑

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端 | React + TypeScript | 界面框架 |
| 编辑器 | Monaco Editor | Markdown 编辑 |
| 后端 | Express + Node.js | API 服务 |
| 数据库 | SQLite | 数据存储 |
| 实时通信 | Socket.IO | 实时协作 |

## 项目结构

```
markdown/
├── src/
│   ├── client/                 # 前端 React 代码
│   │   ├── api/
│   │   │   └── client.ts      # API 调用
│   │   ├── components/
│   │   │   ├── FileList.tsx   # 文件列表组件
│   │   │   └── Header.tsx     # 导航栏组件
│   │   ├── pages/
│   │   │   ├── Home.tsx       # 主页
│   │   │   └── Login.tsx      # 登录页
│   │   ├── App.tsx            # 根组件
│   │   ├── main.tsx           # 入口文件
│   │   ├── index.css          # 全局样式
│   │   └── index.html         # HTML 模板
│   └── server/                # 后端 Express 代码
│       ├── config/
│       │   └── database.js    # SQLite 数据库配置
│       ├── middlewares/
│       │   └── auth.js        # JWT 认证中间件
│       ├── models/
│       │   └── User.js        # 用户模型
│       ├── routes/
│       │   ├── auth.js        # 认证路由
│       │   └── files.js       # 文件路由
│       ├── utils/
│       │   └── validators.js  # 输入验证
│       └── index.js           # 主服务器文件
├── data/                      # 数据库文件目录
├── docs/                      # 项目文档
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```

## 快速开始

```bash
# 克隆项目
git clone <repository-url>
cd markdown-1

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 查看应用。

**详细开发指南见 [DEVELOPMENT.md](./DEVELOPMENT.md)**

## 项目文档

- [开发指南](./DEVELOPMENT.md)
- [部署文档](./DEPLOYMENT.md)
- [API 文档](./API.md)
- [架构设计](./docs/architecture.md)
- [版本规划](./docs/roadmap.md)

## 项目进度

详见 [版本规划](./docs/roadmap.md#开发进度看板)
