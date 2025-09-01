"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_router_dom_1 = require("react-router-dom");
var index_1 = __importDefault(require("../../pages/health-check/index"));
// Mock HealthCheckService
vitest_1.vi.mock('../../services/healthCheck', function () { return ({
    HealthCheckService: {
        getInstance: function () { return ({
            checkSystemHealth: vitest_1.vi.fn().mockResolvedValue({
                overall: {
                    status: 'healthy',
                    message: '系统运行正常',
                    timestamp: new Date().toISOString()
                },
                services: {
                    storage: {
                        status: 'healthy',
                        message: '存储服务正常',
                        timestamp: new Date().toISOString()
                    },
                    network: {
                        status: 'healthy',
                        message: '网络连接正常',
                        timestamp: new Date().toISOString()
                    },
                    database: {
                        status: 'healthy',
                        message: '数据库连接正常',
                        timestamp: new Date().toISOString()
                    },
                    authentication: {
                        status: 'healthy',
                        message: '认证服务正常',
                        timestamp: new Date().toISOString()
                    },
                    stores: {
                        status: 'healthy',
                        message: '店铺服务正常 (2 个店铺)',
                        timestamp: new Date().toISOString()
                    }
                },
                timestamp: new Date().toISOString()
            })
        }); }
    }
}); });
(0, vitest_1.describe)('HealthCheckPage', function () {
    (0, vitest_1.it)('should render health check page', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
                    // 等待异步加载完成
                    return [4 /*yield*/, react_1.screen.findByText('系统健康检查')];
                case 1:
                    // 等待异步加载完成
                    _a.sent();
                    (0, vitest_1.expect)(react_1.screen.getByText('系统健康检查')).toBeInTheDocument();
                    (0, vitest_1.expect)(react_1.screen.getByText('整体状态')).toBeInTheDocument();
                    (0, vitest_1.expect)(react_1.screen.getByText('存储服务')).toBeInTheDocument();
                    (0, vitest_1.expect)(react_1.screen.getByText('网络服务')).toBeInTheDocument();
                    (0, vitest_1.expect)(react_1.screen.getByText('数据库服务')).toBeInTheDocument();
                    (0, vitest_1.expect)(react_1.screen.getByText('认证服务')).toBeInTheDocument();
                    (0, vitest_1.expect)(react_1.screen.getByText('店铺服务')).toBeInTheDocument();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should display healthy status', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
                    // 等待异步加载完成
                    return [4 /*yield*/, react_1.screen.findByText('正常')];
                case 1:
                    // 等待异步加载完成
                    _a.sent();
                    (0, vitest_1.expect)(react_1.screen.getByText('正常')).toBeInTheDocument();
                    (0, vitest_1.expect)(react_1.screen.getByText('系统运行正常')).toBeInTheDocument();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should have refresh button', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
                    // 等待异步加载完成
                    return [4 /*yield*/, react_1.screen.findByText('重新检查')];
                case 1:
                    // 等待异步加载完成
                    _a.sent();
                    (0, vitest_1.expect)(react_1.screen.getByText('重新检查')).toBeInTheDocument();
                    return [2 /*return*/];
            }
        });
    }); });
});
