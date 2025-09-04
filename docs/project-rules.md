# 项目规则使用指南

本文档详细说明如何在小程序开发中使用项目规则体系。

## 目录结构

```
.cursor/rules/
├── check.mdc           # 代码质量检查规则
├── clean.mdc           # 代码清理和格式化规则
├── code-analysis.mdc   # 代码分析规则
├── commit.mdc          # 提交信息规范规则
├── implement-task.mdc  # 任务实现规则
├── global/             # 全局规则
│   └── github-issue-creation.mdc
└── project/            # 项目特定规则
    ├── general-rules.mdc
    ├── mp-rules.mdc
    └── web-rules.mdc
```

## 代码质量检查 (check.mdc)

### 使用方法

1. **ESLint代码检查**:
   ```bash
   cd apps/mp
   npm run lint
   ```

2. **ESLint自动修复**:
   ```bash
   cd apps/mp
   npm run lint:fix
   ```

### 规则说明

- 检查未使用的变量和函数
- 检查潜在的错误和不良实践
- 确保代码风格一致性
- 检查React和Taro特定规则

## 代码清理和格式化 (clean.mdc)

### 使用方法

1. **Prettier代码格式化**:
   ```bash
   cd apps/mp
   npm run format
   ```

### 规则说明

- 统一代码缩进和换行
- 统一引号和分号使用
- 统一对象和数组格式
- 统一函数和类的格式

## 代码分析 (code-analysis.mdc)

### 使用方法

1. **运行代码分析**:
   ```bash
   cd apps/mp
   npm run lint
   ```

### 分析内容

- 代码复杂度分析
- 重复代码检测
- 潜在性能问题识别
- 安全漏洞检查

## 提交规范 (commit.mdc)

### 提交格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 提交类型

- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 示例

```
feat(products): 添加商品搜索功能

实现商品搜索功能，支持按名称和分类搜索

Closes #123
```

## 任务实现 (implement-task.mdc)

### 开发流程

1. **创建功能分支**:
   ```bash
   git checkout -b feature/功能名称
   ```

2. **开发实现**:
   - 按照组件化思想开发
   - 遵循Taro和React最佳实践
   - 编写必要的注释

3. **代码检查和格式化**:
   ```bash
   npm run lint:fix
   npm run format
   ```

4. **提交代码**:
   ```bash
   git add .
   git commit -m "feat: 实现功能描述"
   ```

## 全局规则

### GitHub Issue创建 (github-issue-creation.mdc)

创建GitHub Issue时应包含以下内容:
- 清晰的标题
- 详细的描述
- 重现步骤
- 预期行为和实际行为
- 环境信息

## 项目特定规则

### 通用规则 (general-rules.mdc)

1. **命名规范**:
   - 文件名: 小写字母，单词间用连字符分隔
   - 变量名: 驼峰命名法
   - 函数名: 驼峰命名法，动词开头
   - 类名: 帕斯卡命名法

2. **注释规范**:
   - 函数必须有注释说明功能、参数和返回值
   - 复杂逻辑需要行内注释
   - 文件头部需要文件说明

3. **Git工作流**:
   - 每个功能在独立分支开发
   - 提交信息遵循约定式提交规范
   - Pull Request需要代码审查

### 小程序规则 (mp-rules.mdc)

1. **页面开发**:
   - 页面文件放在`src/pages/`目录下
   - 每个页面包含`index.jsx`和`index.css`
   - 页面在`app.config.js`中注册

2. **组件开发**:
   - 组件文件放在`src/components/`目录下
   - 使用类组件或函数组件
   - 组件属性需要类型检查

3. **状态管理**:
   - 页面级状态使用useState
   - 全局状态使用Redux
   - 避免过度使用全局状态

4. **性能优化**:
   - 列表渲染使用key属性
   - 避免在render中进行复杂计算
   - 使用React.memo优化函数组件

### Web规则 (web-rules.mdc)

1. **技术栈**:
   - React 18
   - TypeScript
   - Tailwind CSS
   - React Router

2. **组件开发**:
   - 优先使用函数组件和Hooks
   - 使用TypeScript进行类型检查
   - 合理拆分大组件为小组件

3. **路由管理**:
   - 使用React Router进行路由管理
   - 路由组件懒加载
   - 路由守卫实现权限控制

## 最佳实践

### 1. 组件设计

- 单一职责原则：每个组件只负责一个功能
- 开放封闭原则：对扩展开放，对修改封闭
- 优先使用函数组件和Hooks
- 合理使用props和state

### 2. 状态管理

- 局部状态：使用useState或useReducer
- 全局状态：使用Redux
- 状态更新：使用不可变数据更新方式
- 状态结构：扁平化状态结构

### 3. 性能优化

- 使用React.memo避免不必要的重新渲染
- 使用useCallback和useMemo优化计算密集型函数
- 懒加载组件和路由
- 图片压缩和懒加载

### 4. 错误处理

- 网络请求添加try-catch
- 组件边界错误处理
- 用户输入验证
- 友好的错误提示

## 工具使用

### 1. 开发工具

- VS Code推荐插件:
  - ESLint
  - Prettier
  - Taro
  - React

### 2. 调试工具

- Taro DevTools
- 微信开发者工具
- React DevTools

### 3. 构建工具

- Webpack
- Babel
- PostCSS

## 常见问题

### 1. ESLint报错

- 未使用的变量：删除未使用的变量或添加`eslint-disable-next-line`注释
- 未定义的变量：检查变量是否正确导入或定义
- 格式问题：运行`npm run format`自动格式化

### 2. 样式问题

- 样式不生效：检查选择器优先级和样式导入顺序
- 响应式问题：使用rpx单位和媒体查询
- 性能问题：避免使用复杂的CSS选择器

### 3. 性能问题

- 页面加载慢：检查资源大小和网络请求
- 卡顿问题：优化渲染性能和事件处理
- 内存泄漏：检查事件监听器和定时器清理

通过遵循这些规则和最佳实践，可以确保项目代码质量和开发效率，提高团队协作效果。