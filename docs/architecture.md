# 架构设计

## 技术栈

### 详细技术栈

| 层级 | 技术选型 | 说明 | 优点 |
|------|----------|------|------|
| 前端框架 | React + TypeScript | 构建用户界面 | 组件化开发、类型安全、生态丰富 |
| Markdown 处理 | Marked + highlight.js | Markdown 渲染与代码高亮 | 性能优异、配置简单、支持扩展 |
| 编辑器 | Textarea + 预览机制 | 基于浏览器 textarea 和实时渲染预览 | 简单易维护、低依赖 |
| 样式框架 | Tailwind CSS | 原子化 CSS 框架 | 快速构建美观界面、响应式设计 |
| 后端 | Node.js + Express | 轻量级 API 服务 | JavaScript 全栈、开发效率高 |
| 数据库 | SQLite (sql.js) | 本地文件数据库 | 无需额外部署、轻量持久化 |
| 存储方案 | 本地 SQLite 文件 | 数据库存储于本地文件 | 适合小型应用、无需外部 DB |
| 实时通信 | Socket.IO（依赖已安装，尚未集成） | 预留实时协作 | 计划用于后续实时协作 |
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
2. **Textarea + 预览机制**：当前基于浏览器 textarea 和 Marked 实现 Markdown 编辑体验
3. **Tailwind CSS**：原子化 CSS 框架，快速构建美观界面

### 项目结构

```
markdown/
├── src/
│   ├── client/              # 前端 React 代码
│   │   ├── api/             # API 调用封装
│   │   │   └── client.ts
│   │   ├── components/      # 可复用组件
│   │   │   ├── FileList.tsx
│   │   │   └── Header.tsx
│   │   ├── pages/           # 页面组件
│   │   │   ├── Home.tsx
│   │   │   └── Login.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.css
│   │   └── index.html
│   └── server/              # 后端 Express 代码
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
├── docs/
│   ├── architecture.md
│   └── roadmap.md
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── .env.example
```

### 前端结构 (src/client/)

```
src/client/
├── api/                     # API 请求封装
│   └── client.ts
├── components/              # 可复用组件
│   ├── FileList.tsx
│   └── Header.tsx
├── pages/                   # 页面组件
│   ├── Home.tsx
│   └── Login.tsx
├── App.tsx
├── main.tsx
├── index.css
└── index.html
```

### 后端结构 (src/server/)

```
src/server/
├── config/                  # 配置文件
│   └── database.js
├── middlewares/             # 中间件
│   └── auth.js
├── models/                  # 数据模型
│   └── User.js
├── routes/                  # 路由
│   ├── auth.js
│   ├── files.js
│   └── shares.js
├── utils/                   # 工具函数
│   └── validators.js
├── index.js
└── index.test.js
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
| user_id | INTEGER | NOT NULL, FK(users.id) | 所有者 ID |
| title | TEXT | NOT NULL | 文件标题 |
| content | TEXT | | 文件内容（Markdown） |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 更新时间 |

**索引：**
- `idx_files_user_id` ON `files(user_id)`
- `idx_files_updated_at` ON `files(updated_at)`

#### shares 共享表

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 共享 ID |
| file_id | INTEGER | NOT NULL, FK(files.id) | 文件 ID |
| share_token | TEXT | NOT NULL UNIQUE | 分享令牌 |
| expires_at | DATETIME | | 过期时间 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

**索引：**
- `idx_shares_file_id` ON `shares(file_id)`
- `idx_shares_token` ON `shares(share_token)`

#### versions 版本表 (规划)

未来版本可扩展为完整 Git 版本控制。当前代码库尚未集成版本历史管理。

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
3. **状态管理**：计划使用 Socket.IO 房间管理，每个文件一个房间，待后续集成

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
