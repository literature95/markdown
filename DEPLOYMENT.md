# 部署文档

## 部署方式

| 方式 | 适用场景 | 难度 |
|------|----------|------|
| 本地部署 | 开发环境 | 低 |
| 生产部署 | 生产环境 | 中等 |

## 本地部署

### 前置要求

- Node.js 18+
- npm 9+
- 可选：Nginx 反向代理

### 部署步骤

```bash
# 1. 克隆项目
git clone <repository-url>
cd markdown
npm install

# 2. 创建环境变量文件
cp .env.example .env

# 3. 编辑 .env 配置
# PORT=3001
# JWT_SECRET=your-production-secret
# DB_PATH=./data/markdown.db
# NODE_ENV=production
# APP_URL=http://localhost:3001
# VITE_API_URL=http://localhost:3001/api
# FRONTEND_URL=http://localhost:3000

# 4. 构建前端
npm run build

# 5. 启动服务
npm start
```

### 访问服务

- 前端（开发模式）：http://localhost:5173
- 后端 API：http://localhost:3001
- 健康检查：http://localhost:3001/api/health

## 手动部署

### 1. 安装依赖

```bash
# 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 Nginx
sudo apt-get install -y nginx
```

### 2. 构建前端

```bash
npm install
npm run build
```

### 3. 配置后端

```bash
npm install --production
```

### 4. 配置 Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/markdown/dist/client;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

### 5. 启动服务

```bash
# 启动后端
PORT=3001 JWT_SECRET=your-secret npm start

# 启动 Nginx
sudo nginx -t
sudo systemctl restart nginx
```

## 环境变量

| 变量 | 必填 | 说明 | 示例 |
|------|------|------|------|
| PORT | 否 | 服务端口，默认 3001 | 3001 |
| JWT_SECRET | 是 | JWT 密钥（生产环境必须更改） | random-string |
| DB_PATH | 否 | 数据库路径，默认 ./data/markdown.db | /app/data/markdown.db |
| NODE_ENV | 否 | 运行环境，默认 development | production |
| APP_URL | 否 | 后端应用 URL | http://localhost:3001 |
| VITE_API_URL | 否 | 前端 API 基础地址 | http://localhost:3001/api |
| FRONTEND_URL | 否 | 前端地址，用于 CORS | http://localhost:3000 |

## 上线前检查清单

### 环境配置
- [ ] `.env` 文件已创建并配置
- [ ] `JWT_SECRET` 已更改（不要使用默认值）
- [ ] `NODE_ENV=production` 已设置

### 安全配置
- [ ] HTTPS 已配置（使用 Let's Encrypt 或其他证书）
- [ ] 防火墙已配置（仅开放必要端口）
- [ ] CORS 已正确配置

### 数据备份
- [ ] 数据库自动备份已配置
- [ ] 文件目录定期备份已配置
- [ ] 备份恢复流程已测试

### 监控告警
- [ ] 日志已配置（Winston）
- [ ] 错误告警已设置
- [ ] 系统监控已启用

## 维护

### 日志查看

```bash
tail -f src/server/logs/app.log
```

### 数据库备份

```bash
sqlite3 data/markdown.db ".backup backup/markdown.db"
```

### 更新部署

```bash
git pull origin main
npm install
npm run build
npm start
```
