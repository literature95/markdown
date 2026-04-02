# API 文档

## 基础信息

| 项目 | 说明 |
|------|------|
| 基础 URL | `http://localhost:3000/api` |
| 数据格式 | JSON |
| 认证方式 | Bearer Token (JWT) |

## 认证

### 注册

```
POST /auth/register
```

**请求体：**

```json
{
  "username": "string (3-20字符)",
  "email": "string (邮箱格式)",
  "password": "string (最小6字符)"
}
```

**响应 (201)：**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**错误码：**

| 状态码 | 说明 |
|--------|------|
| 400 | 输入验证失败 |
| 409 | 用户名或邮箱已存在 |

---

### 登录

```
POST /auth/login
```

**请求体：**

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**响应 (200)：**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**错误码：**

| 状态码 | 说明 |
|--------|------|
| 400 | 输入验证失败 |
| 401 | 邮箱或密码错误 |

---

## 文件操作

> **注意**：除 `GET /files` 外，所有文件操作需要认证。

### 获取文件列表

```
GET /files
```

**查询参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| page | number | 页码，默认 1 |
| limit | number | 每页数量，默认 20 |
| search | string | 搜索关键词（按标题） |

**响应 (200)：**

```json
{
  "success": true,
  "data": {
    "files": [
      {
        "id": 1,
        "title": "我的文档",
        "content": "# Markdown content",
        "owner_id": 1,
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

---

### 创建文件

```
POST /files
```

**请求体：**

```json
{
  "title": "新文档",
  "content": "# 新文档内容"
}
```

**响应 (201)：**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "新文档",
    "content": "# 新文档内容",
    "owner_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 获取文件详情

```
GET /files/:id
```

**响应 (200)：**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "我的文档",
    "content": "# Markdown content",
    "owner_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**错误码：**

| 状态码 | 说明 |
|--------|------|
| 404 | 文件不存在 |
| 403 | 无访问权限 |

---

### 更新文件

```
PUT /files/:id
```

**请求体：**

```json
{
  "title": "更新后的标题",
  "content": "# 更新后的内容"
}
```

**响应 (200)：**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "更新后的标题",
    "content": "# 更新后的内容",
    "owner_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
}
```

---

### 删除文件

```
DELETE /files/:id
```

**响应 (200)：**

```json
{
  "success": true,
  "message": "文件已删除"
}
```

---

## 共享功能 (v1.1)

### 共享文件

```
POST /files/:id/share
```

**请求体：**

```json
{
  "user_id": 2,
  "permission": "edit"
}
```

**权限级别：**

| 值 | 说明 |
|----|------|
| view | 仅查看 |
| edit | 查看和编辑 |
| admin | 完全控制 |

---

### 获取共享给我的文件

```
GET /shared/files
```

---

### 取消共享

```
DELETE /files/:id/share/:userId
```

---

## 版本控制 (v1.1)

### 获取文件版本列表

```
GET /files/:id/versions
```

**响应 (200)：**

```json
{
  "success": true,
  "data": {
    "versions": [
      {
        "id": "abc123",
        "message": "更新文档内容",
        "author": "testuser",
        "created_at": "2024-01-01T12:00:00.000Z"
      }
    ]
  }
}
```

---

### 恢复文件到指定版本

```
POST /files/:id/versions/:versionId/restore
```

---

## 错误响应格式

所有错误响应遵循以下格式：

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "输入验证失败",
    "details": [
      {
        "field": "email",
        "message": "邮箱格式不正确"
      }
    ]
  }
}
```

## 错误码

| 错误码 | 说明 |
|--------|------|
| VALIDATION_ERROR | 输入验证失败 |
| UNAUTHORIZED | 未认证 |
| FORBIDDEN | 无权限 |
| NOT_FOUND | 资源不存在 |
| CONFLICT | 资源冲突 |
| INTERNAL_ERROR | 服务器内部错误 |
