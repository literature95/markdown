# 部署文档

## 部署方式

| 方式 | 适用场景 | 难度 |
|------|----------|------|
| Docker Compose | 生产环境 | 中等 |
| 手动部署 | 定制化需求 | 较高 |

## Docker 部署（推荐）

### 前置要求

- Docker 24+
- Docker Compose 2.0+

### 部署步骤

```bash
# 1. 克隆项目
git clone <repository-url>
cd markdown-1

# 2. 创建环境变量文件
cp backend/.env.example backend/.env

# 3. 编辑 .env 配置
# PORT=3000
# JWT_SECRET=your-production-secret
# DB_PATH=/app/data/markdown.db

# 4. 构建并启动
docker-compose up -d

# 5. 查看日志
docker-compose logs -f
```

### 访问服务

- 前端：http://localhost:80
- 后端 API：http://localhost:3000
- 健康检查：http://localhost:3000/api/health

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
cd frontend
npm install
npm run build
```

### 3. 配置后端

```bash
cd backend
npm install --production
```

### 4. 配置 Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/markdown-1/frontend/dist;
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
cd backend
PORT=3000 JWT_SECRET=your-secret npm start

# 启动 Nginx
sudo nginx -t
sudo systemctl restart nginx
```

## 环境变量

| 变量 | 必填 | 说明 | 示例 |
|------|------|------|------|
| PORT | 否 | 服务端口，默认 3000 | 3000 |
| JWT_SECRET | 是 | JWT 密钥（生产环境必须更改） | random-string |
| DB_PATH | 否 | 数据库路径，默认 ./data/markdown.db | /app/data/markdown.db |
| NODE_ENV | 否 | 运行环境，默认 development | production |
| FRONTEND_URL | 否 | 前端地址，用于 CORS | http://localhost:5173 |

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
# Docker 部署
docker-compose logs -f

# 手动部署
tail -f backend/logs/app.log
```

### 数据库备份

```bash
# Docker 部署
docker exec markdown-1-backend-1 sqlite3 /app/data/markdown.db ".backup /backup/markdown.db"

# 手动部署
sqlite3 backend/data/markdown.db ".backup backup/markdown.db"
```

### 更新部署

```bash
git pull origin main
docker-compose build
docker-compose up -d
```
