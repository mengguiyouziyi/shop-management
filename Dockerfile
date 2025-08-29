# 使用官方Node.js运行时作为基础镜像
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json（如果存在）
COPY package*.json ./

# 复制apps/web目录下的package.json
COPY apps/web/package*.json apps/web/

# 安装依赖
RUN cd apps/web && npm ci

# 复制应用代码
COPY . .

# 构建应用
RUN cd apps/web && npm run build

# 使用nginx作为生产环境服务器
FROM nginx:alpine

# 复制构建产物到nginx服务器
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# 复制nginx配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]