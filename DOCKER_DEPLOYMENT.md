# Docker 部署说明

## 快速开始

### 1. 环境准备
确保服务器已安装：
- Docker (>= 20.10)
- Docker Compose (>= 2.0)
- Git

### 2. 克隆项目
```bash
git clone <your-repo-url>
cd shop
```

### 3. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，修改必要的配置
```

### 4. 部署应用

#### 开发环境
```bash
./deploy.sh deploy dev
```

#### 生产环境
```bash
./deploy.sh deploy prod
```

### 5. 检查状态
```bash
./deploy.sh status
```

### 6. 查看日志
```bash
./deploy.sh logs
```

## 手动部署（如果脚本不可用）

### 1. 构建镜像
```bash
docker build -f Dockerfile.prod -t shop-management-system:latest .
```

### 2. 启动容器
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 3. 检查运行状态
```bash
docker ps
docker-compose -f docker-compose.prod.yml ps
```

## 访问应用

- 开发环境: http://localhost:3000
- 生产环境: http://your-server-ip

## 常用命令

### 查看实时日志
```bash
docker-compose logs -f shop-management-system
```

### 停止服务
```bash
docker-compose down
```

### 重新构建并启动
```bash
docker-compose build --no-cache
docker-compose up -d
```

### 进入容器
```bash
docker exec -it shop-management-system sh
```

### 清理资源
```bash
docker system prune -a
```

## 故障排除

### 1. 端口冲突
检查端口是否被占用：
```bash
netstat -tlnp | grep :80
```

### 2. 权限问题
确保 Docker 有正确权限：
```bash
sudo usermod -aG docker $USER
```

### 3. 内存不足
检查系统资源：
```bash
docker stats
```

### 4. 网络问题
检查 Docker 网络：
```bash
docker network ls
docker network inspect shop-network
```

## 更新应用

### 1. 拉取最新代码
```bash
git pull origin main
```

### 2. 重新构建
```bash
docker-compose build --no-cache
docker-compose up -d
```

## 备份和恢复

### 备份数据
```bash
# 备份数据库（如果使用）
docker exec shop-postgres pg_dump -U shopuser shop_management > backup.sql

# 备份整个数据目录
docker run --rm -v shop_data:/data -v $(pwd):/backup alpine tar czf /backup/backup.tar.gz -C /data .
```

### 恢复数据
```bash
# 恢复数据库
docker exec -i shop-postgres psql -U shopuser shop_management < backup.sql

# 恢复数据目录
docker run --rm -v shop_data:/data -v $(pwd):/backup alpine tar xzf /backup/backup.tar.gz -C /data
```

## 监控和维护

### 健康检查
```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Health}}"
```

### 资源使用情况
```bash
docker stats --no-stream
```

### 日志管理
```bash
# 限制日志大小
docker-compose up -d --log-opt max-size=10m --log-opt max-file=3
```

## 安全建议

1. **修改默认密码**: 在生产环境中修改所有默认密码
2. **使用 HTTPS**: 配置 SSL 证书
3. **防火墙配置**: 只开放必要端口
4. **定期更新**: 定期更新 Docker 镜像和依赖
5. **监控日志**: 监控异常访问和错误
6. **数据备份**: 定期备份重要数据