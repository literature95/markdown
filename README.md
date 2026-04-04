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
│   │   │   └── client.ts      # API 调用
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
│       │   └── User.js        # 用户模型
│       ├── routes/
│       │   ├── auth.js        # 认证路由
│       │   ├── files.js       # 文件路由
│       │   ├── shares.js      # 分享路由
│       │   ├── ai.js          # AI 路由
│       │   └── search.js      # 搜索路由
│       ├── utils/
│       │   └── validators.js  # 输入验证
│       └── index.js           # 主服务器文件
├── data/                      # 数据库文件目录
├── docs/                      # 项目文档
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── .env                       # 环境变量配置
```

## 快速开始

```bash
# 克隆项目
git clone <repository-url>
cd markdown

# 安装依赖
npm install

# 启动开发服务器（前端 + 后端）
npm run dev
```

访问 http://localhost:3000 查看应用。

## 环境变量

```env
PORT=3001              # 服务器端口
JWT_SECRET=your-secret # JWT 密钥
DB_PATH=./data/markdown.db  # 数据库路径
NODE_ENV=development   # 运行环境
```

## 设计规范

### 颜色系统
- Primary: #0071e3
- Primary Hover: #0077ed
- Background: #ffffff
- Background Secondary: #f5f5f7
- Text: #1d1d1f
- Text Secondary: #86868b
- Border: #d2d2d7
- Error: #ff3b30

### 圆角
- Small: 8px
- Medium: 12px
- Large: 16px
- Extra Large: 24px

### 阴影
- sm: 0 1px 3px rgba(0,0,0,0.08)
- md: 0 4px 12px rgba(0,0,0,0.1)
- lg: 0 12px 40px rgba(0,0,0,0.12)

## 项目进度

### 2026-04-04 更新
- [x] 端口配置统一为 3001
- [x] 前端 UI 苹果风格重设计
- [x] Header 导航栏重设计（毛玻璃效果、用户头像下拉菜单）
- [x] 登录/注册页面重设计（渐变背景、居中卡片）
- [x] 主页布局重设计（侧边栏文件列表、主编辑区）
- [x] 全局 CSS 设计系统构建

### 历史进度
详见 [版本规划](./docs/roadmap.md)
