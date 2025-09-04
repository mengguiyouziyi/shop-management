# 店铺管理系统

这是一个基于Taro和React的跨平台店铺管理系统，包含小程序和Web端。

## 项目结构

```
.
├── apps/
│   ├── mp/     # 小程序端
│   └── web/    # Web端
├── packages/   # 共享包
└── docs/       # 文档
```

## 功能模块

1. 首页 - 概览和快捷操作
2. 商品管理 - 商品增删改查
3. 订单管理 - 订单处理和跟踪
4. 会员管理 - 会员信息和积分
5. 数据报表 - 业务数据分析
6. POS收银 - 快速收银结账
7. 系统设置 - 应用配置

## 开发指南

请查看 [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) 了解如何进行项目开发。

## 项目规则使用指南

请查看 [docs/project-rules.md](docs/project-rules.md) 了解如何使用项目规则体系。

## 小程序端开发

### 启动开发服务器

```bash
cd apps/mp
npm install
npm run dev
```

### 构建生产版本

```bash
cd apps/mp
npm run build:prod
```

### 代码质量检查

```bash
cd apps/mp
npm run lint      # 检查代码问题
npm run lint:fix  # 自动修复可修复的问题
npm run format    # 格式化所有源代码
```

## Web端开发

```bash
cd apps/web
npm install
npm run dev
```

## 项目规则

本项目使用了一套完整的规则体系来保证代码质量和开发一致性：

### 项目级规则
- `check.mdc` - 代码质量检查规则
- `clean.mdc` - 代码清理和格式化规则
- `code-analysis.mdc` - 代码分析规则
- `commit.mdc` - 提交信息规范规则
- `implement-task.mdc` - 任务实现规则

### 全局规则
- `github-issue-creation.mdc` - GitHub问题创建规范

### 特定项目规则
- `general-rules.mdc` - 通用开发规则
- `mp-rules.mdc` - 小程序项目特定规则
- `web-rules.mdc` - Web项目特定规则

这些规则文件位于 `.cursor/rules/` 目录下。

## 技术栈

### 小程序端
- Taro 3.x
- React 18
- Redux状态管理

### Web端
- React 18
- TypeScript
- Tailwind CSS
- React Router
- Redux Toolkit

## 部署

### 小程序端
构建后将产物上传至对应小程序平台。

### Web端
构建后部署至静态服务器或CDN。

## 贡献

请遵循项目的提交规范和代码风格。