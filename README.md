# Markdown 跨平台共享平台

## 项目概述

基于 Web 的跨平台 Markdown 文件共享系统，支持 Linux、Windows、macOS 三大平台间的文件共享、查看和协作编辑。

## MVP 定义

### v1.0 核心功能（第一阶段）
- [ ] 用户注册 / 登录（JWT 认证）
- [ ] Markdown 文件 CRUD（创建、读取、更新、删除）
- [ ] 文件列表管理
- [ ] Markdown 实时预览

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

## 快速开始

```bash
# 克隆项目
git clone <repository-url>
cd markdown-1

# 详细开发指南见 DEVELOPMENT.md
```

## 项目文档

- [开发指南](./DEVELOPMENT.md)
- [部署文档](./DEPLOYMENT.md)
- [API 文档](./API.md)
- [架构设计](./docs/architecture.md)
- [版本规划](./docs/roadmap.md)

## 项目进度

详见 [版本规划](./docs/roadmap.md#开发进度看板)
