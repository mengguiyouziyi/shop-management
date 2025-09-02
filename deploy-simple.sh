#!/bin/bash

# 店铺管理系统 Docker 部署脚本
# 简化版本 - 开发环境部署

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
    docker-compose -f docker-compose.simple.yml down --remove-orphans 2>/dev/null || true
    docker system prune -f 2>/dev/null || true
}

# 构建并启动服务
deploy() {
    print_info "开始构建和部署店铺管理系统..."
    
    # 构建镜像
    print_info "构建 Docker 镜像..."
    docker-compose -f docker-compose.simple.yml build --no-cache
    
    # 启动容器
    print_info "启动容器..."
    docker-compose -f docker-compose.simple.yml up -d
    
    print_success "部署完成！"
}

# 检查服务状态
check_status() {
    print_info "检查服务状态..."
    docker-compose -f docker-compose.simple.yml ps
}

# 查看日志
view_logs() {
    print_info "查看应用日志..."
    docker-compose -f docker-compose.simple.yml logs -f --tail=100
}

# 停止服务
stop_services() {
    print_info "停止所有服务..."
    docker-compose -f docker-compose.simple.yml down
    print_success "服务已停止"
}

# 显示帮助信息
show_help() {
    echo "店铺管理系统 Docker 部署脚本"
    echo ""
    echo "用法: $0 [命令]"
    echo ""
    echo "命令:"
    echo "  deploy     构建并部署应用"
    echo "  status     检查服务状态"
    echo "  logs       查看日志"
    echo "  stop       停止服务"
    echo "  cleanup    清理资源"
    echo "  help       显示帮助"
    echo ""
    echo "示例:"
    echo "  $0 deploy   # 部署应用"
    echo "  $0 status   # 检查状态"
    echo "  $0 logs     # 查看日志"
}

# 主函数
main() {
    check_docker
    check_docker_compose
    
    case ${1:-help} in
        "deploy")
            cleanup
            deploy
            check_status
            ;;
        "status")
            check_status
            ;;
        "logs")
            view_logs
            ;;
        "stop")
            stop_services
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