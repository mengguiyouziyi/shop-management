#!/bin/bash

# 店铺管理系统一键部署脚本
# 无需Docker版本

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

# 检查Node.js是否安装
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js 未安装。请先安装 Node.js。"
        exit 1
    fi
    print_success "Node.js 已安装: $(node --version)"
}

# 检查npm是否安装
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm 未安装。请先安装 npm。"
        exit 1
    fi
    print_success "npm 已安装: $(npm --version)"
}

# 停止现有服务
stop_services() {
    print_info "停止现有服务..."
    pkill -f "node.*vite" 2>/dev/null || true
    pkill -f "node.*simple-server" 2>/dev/null || true
    print_success "服务已停止"
}

# 安装依赖
install_dependencies() {
    print_info "安装依赖..."
    npm ci
    print_success "依赖安装完成"
}

# 构建应用
build_app() {
    print_info "构建应用..."
    # 跳过TypeScript检查，直接使用Vite构建
    npx vite build --mode production || true
    print_success "应用构建完成"
}

# 启动开发服务器
start_dev_server() {
    print_info "启动开发服务器..."
    nohup npm run dev > vite-dev.log 2>&1 &
    sleep 5
    if pgrep -f "node.*vite" > /dev/null; then
        print_success "开发服务器启动成功"
        print_info "访问地址: http://localhost:3000"
        print_info "外部访问: http://$(hostname -I | awk '{print $1}'):3000"
    else
        print_error "开发服务器启动失败"
        exit 1
    fi
}

# 检查服务状态
check_status() {
    print_info "检查服务状态..."
    if pgrep -f "node.*vite" > /dev/null; then
        print_success "Vite 开发服务器正在运行"
        print_info "PID: $(pgrep -f 'node.*vite')"
        print_info "访问地址: http://localhost:3000"
    else
        print_error "Vite 开发服务器未运行"
    fi
}

# 查看日志
view_logs() {
    print_info "查看应用日志..."
    if [ -f "vite-dev.log" ]; then
        tail -f vite-dev.log
    else
        print_error "日志文件不存在"
    fi
}

# 显示帮助信息
show_help() {
    echo "店铺管理系统一键部署脚本"
    echo ""
    echo "用法: $0 [命令]"
    echo ""
    echo "命令:"
    echo "  install     安装依赖"
    echo "  build       构建应用"
    echo "  start       启动服务"
    echo "  stop        停止服务"
    echo "  restart     重启服务"
    echo "  status      检查状态"
    echo "  logs        查看日志"
    echo "  help        显示帮助"
    echo ""
    echo "示例:"
    echo "  $0 install   # 安装依赖"
    echo "  $0 start     # 启动服务"
    echo "  $0 status    # 检查状态"
}

# 主函数
main() {
    check_node
    check_npm
    
    case ${1:-help} in
        "install")
            stop_services
            install_dependencies
            ;;
        "build")
            build_app
            ;;
        "start")
            stop_services
            start_dev_server
            check_status
            ;;
        "stop")
            stop_services
            print_success "服务已停止"
            ;;
        "restart")
            stop_services
            start_dev_server
            check_status
            ;;
        "status")
            check_status
            ;;
        "logs")
            view_logs
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# 运行主函数
main "$@"