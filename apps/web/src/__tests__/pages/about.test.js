"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_router_dom_1 = require("react-router-dom");
var index_1 = __importDefault(require("../../pages/about/index"));
(0, vitest_1.describe)('AboutPage', function () {
    (0, vitest_1.it)('should render about page', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
        (0, vitest_1.expect)(react_1.screen.getByText('关于系统')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should display system information', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
        (0, vitest_1.expect)(react_1.screen.getByText('系统信息')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('多店铺管理系统')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('专为连锁店铺设计的综合管理系统，支持总部-分店管理模式，提供统一的管理界面和分散的操作权限。')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('版本 v1.0.0')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should display system features', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
        (0, vitest_1.expect)(react_1.screen.getByText('主要功能')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('店铺层级管理')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('权限控制')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('跨店铺报表')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('资源共享')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should display technologies', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
        (0, vitest_1.expect)(react_1.screen.getByText('技术栈')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('React')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('TypeScript')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('TDesign')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should display system status', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
        (0, vitest_1.expect)(react_1.screen.getByText('系统状态')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('运行状态')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('连接状态')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('数据状态')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should display team members', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
        (0, vitest_1.expect)(react_1.screen.getByText('开发团队')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('张三')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('项目经理')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('李四')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('前端开发')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should display contact information', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
        (0, vitest_1.expect)(react_1.screen.getByText('联系我们')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('客服电话:')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('技术支持:')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('官方网站:')).toBeInTheDocument();
    });
});
