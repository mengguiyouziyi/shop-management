"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_router_dom_1 = require("react-router-dom");
var index_1 = __importDefault(require("../../pages/feedback/index"));
// Mock useAuth hook
vitest_1.vi.mock('../../hooks/useAuth', function () { return ({
    useAuth: function () { return ({
        currentUser: {
            id: 'user1',
            name: '张三',
            email: 'zhangsan@example.com',
            role: 'admin'
        }
    }); }
}); });
(0, vitest_1.describe)('FeedbackPage', function () {
    (0, vitest_1.it)('should render feedback page', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
        (0, vitest_1.expect)(react_1.screen.getByText('用户反馈')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should display tabs', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
        (0, vitest_1.expect)(react_1.screen.getByText('提交反馈')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('我的反馈')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should display feedback form', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
        (0, vitest_1.expect)(react_1.screen.getByText('反馈类型')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('优先级')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('标题')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('详细描述')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('提交反馈')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('重置')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should display feedback options', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
        // 反馈类型选项
        (0, vitest_1.expect)(react_1.screen.getByText('问题')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('功能建议')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('改进建议')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('其他')).toBeInTheDocument();
        // 优先级选项
        (0, vitest_1.expect)(react_1.screen.getByText('低')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('中')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('高')).toBeInTheDocument();
    });
});
