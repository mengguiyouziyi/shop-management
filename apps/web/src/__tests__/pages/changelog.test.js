"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_router_dom_1 = require("react-router-dom");
var index_1 = __importDefault(require("../../pages/changelog/index"));
(0, vitest_1.describe)('ChangelogPage', function () {
    (0, vitest_1.it)('should render changelog page', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
        (0, vitest_1.expect)(react_1.screen.getByText('系统更新日志')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should display tabs', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
        (0, vitest_1.expect)(react_1.screen.getByText('全部更新')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('新功能')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('功能改进')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('问题修复')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should display changelog entries', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
        // Check for default entries
        (0, vitest_1.expect)(react_1.screen.getByText('多店铺管理系统上线')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('系统帮助文档')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('系统设置功能')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should display category tags', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
        // Check for category tags
        (0, vitest_1.expect)(react_1.screen.getByText('新功能')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should display filter options', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
        // Check for filter options
        (0, vitest_1.expect)(react_1.screen.getByText('版本:')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('类型:')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('全部版本')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('全部类型')).toBeInTheDocument();
    });
});
