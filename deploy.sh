#!/bin/bash

# 店铺管理系统 Docker 部署脚本
# 支持开发和生产环境

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查 Docker 是否安装
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker 未安装。请先安装 Docker。"
        exit 1
    fi
    print_success "Docker 已安装: $(docker --version)"
}

# 检查 Docker Compose 是否安装
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose 未安装。请先安装 Docker Compose。"
        exit 1
    fi
    print_success "Docker Compose 已安装: $(docker-compose --version)"
}

# 清理之前的构建
cleanup() {
    print_info "清理之前的构建..."
    docker-compose down --remove-orphans 2>/dev/null || true
    docker system prune -f 2>/dev/null || true
}

# 构建并启动服务
deploy() {
    local env=$1
    print_info "开始部署店铺管理系统 - 环境: $env"
    
    case $env in
        "dev")
            print_info "使用开发环境配置..."
            docker-compose up --build -d
            ;;
        "prod")
            print_info "使用生产环境配置..."
            docker-compose -f docker-compose.prod.yml up --build -d
            ;;
        *)
            print_error "未知环境: $env。支持的环境: dev, prod"
            exit 1
            ;;
    esac
    
    print_success "部署完成！"
}

# 检查服务状态
check_status() {
    print_info "检查服务状态..."
    docker-compose ps
}

# 查看日志
view_logs() {
    local service=$1
    if [ -z "$service" ]; then
        docker-compose logs -f --tail=100
    else
        docker-compose logs -f --tail=100 "$service"
    fi
}

# 停止服务
stop_services() {
    print_info "停止所有服务..."
    docker-compose down
    print_success "服务已停止"
}

# 更新服务
update_services() {
    print_info "更新服务..."
    git pull origin main
    docker-compose build --no-cache
    docker-compose up -d
    print_success "服务已更新"
}

# 显示帮助信息
show_help() {
    echo "店铺管理系统 Docker 部署脚本"
    echo ""
    echo "用法: $0 [命令] [选项]"
    echo ""
    echo "命令:"
    echo "  deploy [env]     部署应用 (env: dev, prod)"
    echo "  status           检查服务状态"
    echo "  logs [service]   查看日志"
    echo "  stop             停止服务"
    echo "  update           更新服务"
    echo "  cleanup          清理资源"
    echo "  help             显示帮助"
    echo ""
    echo "示例:"
    echo "  $0 deploy prod   # 部署到生产环境"
    echo "  $0 status        # 检查状态"
    echo "  $0 logs          # 查看所有日志"
    echo "  $0 logs app      # 查看应用日志"
}

# 主函数
main() {
    check_docker
    check_docker_compose
    
    case ${1:-help} in
        "deploy")
            deploy ${2:-dev}
            ;;
        "status")
            check_status
            ;;
        "logs")
            view_logs $2
            ;;
        "stop")
            stop_services
            ;;
        "update")
            update_services
            ;;
        "cleanup")
            cleanup
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# 运行主函数
main "$@"