"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_router_dom_1 = require("react-router-dom");
var index_1 = __importDefault(require("../../pages/help/index"));
// 设置全局超时时间
var originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
beforeAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000; // 30秒
});
afterAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
});
(0, vitest_1.describe)('HelpPage', function () {
    (0, vitest_1.it)('should render help page', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
        (0, vitest_1.expect)(react_1.screen.getByText('系统帮助文档')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should display all tabs', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
        (0, vitest_1.expect)(react_1.screen.getByText('系统介绍')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('店铺管理')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('店铺层级')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('跨店铺报表')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('资源共享')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('总部-分店管理')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should display introduction content', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
        (0, vitest_1.expect)(react_1.screen.getByText('多店铺管理系统介绍')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('主要功能')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('系统特点')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should display store management content', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
        // Click on the store management tab
        var storeTab = react_1.screen.getByText('店铺管理');
        storeTab.click();
        (0, vitest_1.expect)(react_1.screen.getByText('店铺管理')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('创建店铺')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('编辑店铺')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('删除店铺')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should display hierarchy content', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
        // Click on the hierarchy tab
        var hierarchyTab = react_1.screen.getByText('店铺层级');
        hierarchyTab.click();
        (0, vitest_1.expect)(react_1.screen.getByText('店铺层级管理')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('层级结构')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('查看层级')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should display cross-store reports content', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
        // Click on the reports tab
        var reportsTab = react_1.screen.getByText('跨店铺报表');
        reportsTab.click();
        (0, vitest_1.expect)(react_1.screen.getByText('跨店铺报表')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('销售报表')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('库存报表')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should display resource sharing content', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
        // Click on the sharing tab
        var sharingTab = react_1.screen.getByText('资源共享');
        sharingTab.click();
        (0, vitest_1.expect)(react_1.screen.getByText('资源共享')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('分享资源')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('请求资源')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('管理请求')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should display headquarters management content', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
        // Click on the headquarters tab
        var headquartersTab = react_1.screen.getByText('总部-分店管理');
        headquartersTab.click();
        (0, vitest_1.expect)(react_1.screen.getByText('总部-分店管理')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('管理设置')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('数据同步')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('分店管理')).toBeInTheDocument();
    });
});
