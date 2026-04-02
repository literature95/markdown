# 架构设计

## 技术栈

### 详细技术栈

| 层级 | 技术选型 | 说明 | 优点 |
|------|----------|------|------|
| 前端框架 | React + TypeScript | 构建用户界面 | 组件化开发、类型安全、生态丰富 |
| Markdown 处理 | Marked + highlight.js | Markdown 渲染与代码高亮 | 性能优异、配置简单、支持扩展 |
| 编辑器 | Monaco Editor | 代码编辑器 | VS Code 同款体验、功能强大 |
| 样式框架 | Tailwind CSS | 原子化 CSS 框架 | 快速构建美观界面、响应式设计 |
| 后端 | Node.js + Express | 轻量级 API 服务 | JavaScript 全栈、开发效率高 |
| 数据库 | SQLite | 轻量级数据库 | 无需额外部署、适合小型应用 |
| 存储方案 | 本地文件系统 + Git | 文件存储与版本控制 | 简单直接、提供版本历史 |
| 实时通信 | Socket.IO | WebSocket 封装库 | 自动降级、连接管理、事件驱动 |
| 认证授权 | JWT | 用户认证 | 无状态、跨域支持、易于实现 |
| 部署工具 | Docker | 容器化部署 | 环境隔离、简化部署、易于扩展 |

### 补充技术

| 技术 | 用途 | 选型建议 |
|------|------|----------|
| 日志系统 | 记录系统运行状态 | Winston |
| 错误监控 | 捕获和分析错误 | Sentry |
| 测试框架 | 确保代码质量 | Jest + React Testing Library |
| CI/CD | 自动化构建部署 | GitHub Actions |

## 系统架构图

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Windows       │     │   macOS         │     │   Linux         │
│   浏览器         │     │   浏览器         │     │   浏览器         │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │     Linux 服务器         │
                    │  ┌──────────────────┐   │
                    │  │   Web 应用        │   │
                    │  │  (React + Vite)   │   │
                    │  └────────┬─────────┘   │
                    │           │             │
                    │  ┌────────▼─────────┐   │
                    │  │   Express API    │   │
                    │  └────────┬─────────┘   │
                    │           │             │
                    │  ┌────────▼─────────┐   │
                    │  │   SQLite DB     │   │
                    │  └──────────────────┘   │
                    └─────────────────────────┘
```

## 前端架构

### 技术选型理由

1. **React + TypeScript**：提供良好的开发体验和类型安全
2. **Monaco Editor**：VS Code 同款编辑器，专业级 Markdown 编辑体验
3. **Tailwind CSS**：原子化 CSS 框架，快速构建美观界面

### 项目结构

```
frontend/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── Editor/          # Markdown 编辑器组件
│   │   ├── FileList/        # 文件列表组件
│   │   └── Layout/          # 布局组件
│   ├── pages/               # 页面组件
│   │   ├── Home/            # 首页
│   │   ├── Editor/          # 编辑器页面
│   │   ├── Login/           # 登录页
│   │   └── Register/        # 注册页
│   ├── hooks/               # 自定义 Hooks
│   ├── services/            # API 服务层
│   ├── stores/              # 状态管理
│   ├── utils/               # 工具函数
│   ├── App.tsx
│   └── main.tsx
└── index.html
```

## 后端架构

### 技术选型理由

1. **Express + Node.js**：轻量级 API 框架，与前端技术栈统一
2. **SQLite**：无需额外部署，适合小型应用
3. **Socket.IO**：封装 WebSocket，提供更可靠的实时通信

### 项目结构

```
backend/
├── src/
│   ├── controllers/          # 控制器（处理请求逻辑）
│   ├── middlewares/          # 中间件（认证、日志、错误处理）
│   ├── models/               # 数据模型（数据库操作）
│   ├── routes/               # 路由定义
│   ├── utils/                # 工具函数
│   ├── config/               # 配置文件
│   └── index.js              # 入口文件
├── data/                     # 数据目录
│   └── markdown.db           # SQLite 数据库
├── logs/                     # 日志目录
└── package.json
```

## 数据库设计

### ER 图

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   users     │       │   files     │       │   shares    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │───┐   │ id (PK)     │       │ id (PK)     │
│ username    │   │   │ title       │       │ file_id(FK) │
│ email       │   └───│ owner_id(FK)│       │ user_id(FK) │
│ password    │       │ content     │       │ permission  │
│ created_at  │       │ created_at  │       │ created_at  │
└─────────────┘       │ updated_at  │       └─────────────┘
                      └─────────────┘
                             │
                             │ 1:N (可选 v1.1)
                             ▼
                      ┌─────────────┐
                      │  versions   │
                      ├─────────────┤
                      │ id (PK)     │
                      │ file_id(FK) │
                      │ content     │
                      │ message     │
                      │ git_commit  │
                      │ created_at  │
                      └─────────────┘
```

### 表结构

#### users 用户表

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 用户 ID |
| username | TEXT | NOT NULL UNIQUE | 用户名 |
| email | TEXT | NOT NULL UNIQUE | 邮箱 |
| password | TEXT | NOT NULL | 密码（bcrypt 加密） |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

**索引：**
- `idx_users_email` ON `users(email)`
- `idx_users_username` ON `users(username)`

#### files 文件表

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 文件 ID |
| title | TEXT | NOT NULL | 文件标题 |
| content | TEXT | | 文件内容（Markdown） |
| owner_id | INTEGER | NOT NULL, FK(users.id) | 所有者 ID |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 更新时间 |

**索引：**
- `idx_files_owner_id` ON `files(owner_id)`
- `idx_files_updated_at` ON `files(updated_at)`

#### shares 共享表 (v1.1)

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 共享 ID |
| file_id | INTEGER | NOT NULL, FK(files.id) | 文件 ID |
| user_id | INTEGER | NOT NULL, FK(users.id) | 被分享用户 ID |
| permission | TEXT | NOT NULL, DEFAULT 'view' | 权限级别 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

**索引：**
- `idx_shares_file_user` ON `shares(file_id, user_id)` UNIQUE

#### versions 版本表 (v1.1)

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | TEXT | PRIMARY KEY | 版本 ID（Git commit hash） |
| file_id | INTEGER | NOT NULL, FK(files.id) | 文件 ID |
| content | TEXT | NOT NULL | 版本内容 |
| message | TEXT | | 提交信息 |
| author | TEXT | NOT NULL | 作者 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

**索引：**
- `idx_versions_file_id` ON `versions(file_id)`

## 实时协作方案 (v1.1)

### 技术选型：OT vs CRDT

| 方案 | 优点 | 缺点 | 推荐 |
|------|------|------|------|
| OT (Operational Transformation) | 算法成熟、应用广泛 | 实现复杂 | ✓ 适合本项目 |
| CRDT (Conflict-free Replicated Data Types) | 实现简单、无需中央协调 | 数据结构复杂 | 备选 |

### 实现方案

1. **冲突处理**：采用 OT 算法处理并发编辑冲突
2. **同步策略**：
   - 字符级同步（细粒度）
   - 运营转换（OT）算法
3. **状态管理**：Socket.IO 房间管理，每个文件一个房间

## 安全设计

### 认证流程

1. 用户登录 → 服务器验证 → 返回 JWT Token
2. 前端存储 Token（localStorage）
3. 请求时携带 Token（Authorization: Bearer xxx）
4. 服务器验证 Token → 解析用户信息

### 安全措施

| 措施 | 说明 |
|------|------|
| 密码加密 | bcrypt 加密存储 |
| JWT 时效 | Token 24 小时过期 |
| CORS | 仅允许指定前端域名 |
| 输入验证 | 使用 Joi/zod 验证输入 |
| SQL 注入 | 使用参数化查询 |
| XSS | 输出转义、CSP 配置 |
