# 店铺管理系统

[![CI](https://github.com/your-username/shop-system/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/shop-system/actions/workflows/ci.yml)

一个现代化的零售店铺管理系统，支持商品管理、会员管理、订单处理、财务统计、多店铺管理等功能。系统具备响应式设计，可在桌面端和移动端使用，并支持离线操作。

## 功能特性

### 核心功能
- **商品管理** - 商品信息维护、库存管理
- **会员管理** - 会员信息管理、积分系统
- **订单管理** - POS收银系统、订单查询
- **财务管理** - 日常财务记录、收支统计
- **多店铺管理** - 支持多个店铺独立管理
- **供应链管理** - 供应商管理、采购订单
- **报表分析** - 销售报表、库存报表

### 技术特性
- **响应式设计** - 支持桌面端和移动端
- **离线支持** - 网络断开时仍可正常操作
- **权限管理** - 基于角色的访问控制
- **数据持久化** - 本地数据存储与同步
- **CI/CD** - 自动化测试与部署

## 技术栈

### 前端
- React 18
- TypeScript
- Vite
- TDesign React组件库
- Zustand状态管理

### 后端
- 浏览器存储（IndexedDB、LocalStorage）
- 无服务器架构

### 部署
- Docker
- Nginx
- GitHub Actions

## 快速开始

### 环境要求
- Node.js 16+
- npm 7+

### 安装依赖
```bash
cd apps/web
npm install
```

### 开发模式
```bash
cd apps/web
npm run dev
```

### 构建生产版本
```bash
cd apps/web
npm run build
```

### 运行测试
```bash
cd apps/web
npm run test
```

### Docker部署
```bash
docker-compose up -d
```

## 项目结构

```
shop-system/
├── apps/
│   └── web/              # 前端应用
│       ├── src/          # 源代码
│       │   ├── components/  # UI组件
│       │   ├── hooks/       # 自定义Hooks
│       │   ├── pages/       # 页面组件
│       │   ├── services/    # 业务服务
│       │   ├── store/       # 状态管理
│       │   ├── types/       # TypeScript类型定义
│       │   └── utils/       # 工具函数
│       ├── public/          # 静态资源
│       └── tests/           # 测试文件
├── packages/                # 共享包
│   └── core/                # 核心业务逻辑
├── .github/
│   └── workflows/          # CI/CD配置
├── docs/                   # 文档
└── docker-compose.yml      # Docker配置
```

## 用户角色

| 角色 | 权限 |
|------|------|
| 管理员(admin) | 所有功能 |
| 收银员(cashier) | 会员管理、POS收银、财务日报 |
| 库存管理员(inventory) | 商品管理、供应商管理、采购订单、库存管理 |
| 财务人员(finance) | 财务日报 |

## 默认账户

- 管理员：admin / admin123
- 收银员：cashier / cashier123
- 库存管理员：inventory / inventory123
- 财务人员：finance / finance123

## 文档

- [用户手册](USER_MANUAL.md) - 系统使用指南
- [系统架构](SYSTEM_ARCHITECTURE.md) - 技术架构设计
- [开发计划](DEVELOPMENT_PLAN.md) - 开发路线图
- [测试总结](TESTING_SUMMARY.md) - 测试报告

## 部署

### 使用Docker部署

1. 构建并启动服务：
```bash
docker-compose up -d
```

2. 访问应用：
```
http://localhost
```

### 手动部署

1. 构建生产版本：
```bash
cd apps/web
npm run build
```

2. 将`dist`目录下的文件部署到Web服务器

## CI/CD

项目使用GitHub Actions进行持续集成和持续部署：

- 代码推送到`main`或`develop`分支时自动触发
- 运行测试并生成覆盖率报告
- 构建生产版本
- 部署到相应环境

## 贡献

欢迎提交Issue和Pull Request来改进系统。

### 开发流程

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 许可证

[MIT](LICENSE)

## 联系方式

如有问题，请联系：
- 邮箱：support@shop-system.com
- 在线客服：系统内右下角"在线客服"按钮