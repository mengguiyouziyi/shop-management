# 小程序开发指南

本文档说明如何使用项目规则和工具进行小程序开发。

## 项目结构

```
apps/mp/
├── src/
│   ├── app.js              # 应用入口
│   ├── app.config.js       # 应用配置
│   ├── app.css             # 全局样式
│   ├── pages/              # 页面目录
│   ├── components/         # 组件目录
│   ├── store/              # 状态管理
│   └── utils/              # 工具函数
├── .eslintrc.js            # ESLint配置
├── .prettierrc.js          # Prettier配置
└── package.json            # 项目配置
```

## 开发流程

### 1. 启动开发服务器

```bash
cd apps/mp
npm run dev
```

这将启动Taro开发服务器，并监听文件变化自动编译。

### 2. 创建新页面

1. 在 `src/pages/` 目录下创建新页面文件夹
2. 添加 `index.jsx` 和 `index.css` 文件
3. 在 `app.config.js` 中注册页面路径

### 3. 创建新组件

1. 在 `src/components/` 目录下创建组件文件夹
2. 添加 `index.jsx` 和 `index.css` 文件
3. 在需要使用的页面中导入组件

## 代码质量保证

### ESLint代码检查

```bash
cd apps/mp
npm run lint      # 检查代码问题
npm run lint:fix  # 自动修复可修复的问题
```

ESLint规则基于项目规则文件中的规范，包括：
- JavaScript/JSX语法规范
- React最佳实践
- 小程序开发特定规则

### Prettier代码格式化

```bash
cd apps/mp
npm run format    # 格式化所有源代码
```

Prettier确保代码风格一致性，包括：
- 缩进和换行
- 引号和分号
- 对象和数组格式

## 项目规则应用

### 通用规则 (general-rules.mdc)

这些规则适用于所有项目文件：
- 命名规范（文件名、变量名、函数名）
- 代码组织和结构
- 注释规范
- Git工作流

### 小程序规则 (mp-rules.mdc)

这些规则专门针对小程序开发：
- Taro框架使用规范
- 页面和组件结构规范
- 状态管理规范
- 性能优化建议

## 最佳实践

### 1. 组件开发

- 使用类组件或函数组件（推荐Hooks）
- 组件属性需要类型检查
- 合理拆分大组件为小组件
- 组件样式使用CSS Modules或BEM命名

### 2. 状态管理

- 页面级状态使用useState
- 全局状态使用useAppStore
- 复杂状态逻辑使用useReducer
- 合理分离UI状态和业务状态

### 3. 性能优化

- 列表渲染使用key属性
- 避免在render中进行复杂计算
- 使用React.memo优化函数组件
- 图片资源压缩和懒加载

### 4. 错误处理

- 网络请求添加try-catch
- 组件边界错误处理
- 用户输入验证
- 友好的错误提示

## 测试

### 单元测试

```bash
# TODO: 添加单元测试命令
```

### 端到端测试

```bash
# TODO: 添加E2E测试命令
```

## 部署

### 构建生产版本

```bash
cd apps/mp
npm run build:prod
```

这将生成优化后的小程序代码，用于生产环境部署。

## 常见问题

### 1. ESLint报错

如果遇到ESLint报错，请先尝试运行 `npm run lint:fix` 自动修复。对于无法自动修复的问题，需要手动修改代码。

### 2. 样式问题

- 确保样式文件与组件文件同级
- 使用rpx单位适配不同屏幕
- 避免使用内联样式

### 3. 性能问题

- 检查是否存在不必要的重新渲染
- 优化列表渲染和事件处理
- 减少网络请求次数