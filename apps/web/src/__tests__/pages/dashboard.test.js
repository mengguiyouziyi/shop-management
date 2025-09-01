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
var dashboard_1 = __importDefault(require("../../pages/dashboard"));
var useAppStore_1 = require("../../store/useAppStore");
var store_1 = require("../../services/store");
var crossStoreReporting_1 = require("../../services/crossStoreReporting");
var resourceSharing_1 = require("../../services/resourceSharing");
var headquartersBranch_1 = require("../../services/headquartersBranch");
// Mock dependencies
vitest_1.vi.mock('../../store/useAppStore');
vitest_1.vi.mock('../../services/store');
vitest_1.vi.mock('../../services/crossStoreReporting');
vitest_1.vi.mock('../../services/resourceSharing');
vitest_1.vi.mock('../../services/headquartersBranch');
(0, vitest_1.describe)('DashboardPage', function () {
    var mockCurrentStore = {
        id: 'store1',
        name: 'Test Store',
        code: 'TS001',
        address: 'Test Address',
        phone: '123456789',
        manager: 'Test Manager',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        isActive: true,
        level: 0
    };
    var mockStores = [
        mockCurrentStore,
        {
            id: 'store2',
            name: 'Test Store 2',
            code: 'TS002',
            address: 'Test Address 2',
            phone: '987654321',
            manager: 'Test Manager 2',
            createdAt: '2023-01-01',
            updatedAt: '2023-01-01',
            isActive: true,
            level: 1,
            parentId: 'store1'
        }
    ];
    var mockAggregatedReport = {
        totalSales: 10000,
        totalOrders: 500,
        storeSales: [
            { storeId: 'store1', storeName: 'Test Store', sales: 7000, orderCount: 300 },
            { storeId: 'store2', storeName: 'Test Store 2', sales: 3000, orderCount: 200 }
        ]
    };
    var mockSharedResources = [
        {
            id: 'resource1',
            name: 'Test Product',
            type: 'product',
            sourceStoreId: 'store1',
            sourceStoreName: 'Test Store',
            sharedWith: [{ storeId: 'store2', storeName: 'Test Store 2', sharedAt: '2023-01-01' }],
            createdAt: '2023-01-01',
            updatedAt: '2023-01-01'
        }
    ];
    (0, vitest_1.beforeEach)(function () {
        // Reset all mocks
        vitest_1.vi.clearAllMocks();
        // Mock useAppStore
        useAppStore_1.useAppStore.mockReturnValue({
            currentStore: mockCurrentStore,
            setCurrentStore: vitest_1.vi.fn()
        });
        // Mock StoreService
        var mockStoreService = {
            getAllStores: vitest_1.vi.fn().mockResolvedValue(mockStores)
        };
        store_1.StoreService.getInstance.mockReturnValue(mockStoreService);
        // Mock CrossStoreReportingService
        var mockCrossStoreReportingService = {
            getAggregatedSalesReport: vitest_1.vi.fn().mockResolvedValue(mockAggregatedReport)
        };
        crossStoreReporting_1.CrossStoreReportingService.getInstance.mockReturnValue(mockCrossStoreReportingService);
        // Mock ResourceSharingService
        var mockResourceSharingService = {
            getAllSharedResources: vitest_1.vi.fn().mockResolvedValue(mockSharedResources)
        };
        resourceSharing_1.ResourceSharingService.getInstance.mockReturnValue(mockResourceSharingService);
        // Mock HeadquartersBranchService
        var mockHeadquartersBranchService = {
            getChildStores: vitest_1.vi.fn().mockResolvedValue([mockStores[1]])
        };
        headquartersBranch_1.HeadquartersBranchService.getInstance.mockReturnValue(mockHeadquartersBranchService);
    });
    (0, vitest_1.it)('should render dashboard page', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(dashboard_1.default, {}) }));
                    // Wait for data to load
                    return [4 /*yield*/, (0, react_1.waitFor)(function () {
                            (0, vitest_1.expect)(react_1.screen.getByText('多店铺管理仪表板')).toBeInTheDocument();
                        })];
                case 1:
                    // Wait for data to load
                    _a.sent();
                    // Check tabs
                    (0, vitest_1.expect)(react_1.screen.getByText('系统概览')).toBeInTheDocument();
                    (0, vitest_1.expect)(react_1.screen.getByText('店铺管理')).toBeInTheDocument();
                    (0, vitest_1.expect)(react_1.screen.getByText('报表分析')).toBeInTheDocument();
                    (0, vitest_1.expect)(react_1.screen.getByText('资源共享')).toBeInTheDocument();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should display statistics', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(dashboard_1.default, {}) }));
                    // Wait for data to load
                    return [4 /*yield*/, (0, react_1.waitFor)(function () {
                            (0, vitest_1.expect)(react_1.screen.getByText('2')).toBeInTheDocument(); // 店铺总数
                        })];
                case 1:
                    // Wait for data to load
                    _a.sent();
                    // Check statistics
                    (0, vitest_1.expect)(react_1.screen.getByText('10000.00')).toBeInTheDocument(); // 总销售额
                    (0, vitest_1.expect)(react_1.screen.getByText('1')).toBeInTheDocument(); // 共享资源
                    (0, vitest_1.expect)(react_1.screen.getByText('1')).toBeInTheDocument(); // 分店数量
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should display system status', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(dashboard_1.default, {}) }));
                    // Wait for data to load
                    return [4 /*yield*/, (0, react_1.waitFor)(function () {
                            (0, vitest_1.expect)(react_1.screen.getByText('系统状态')).toBeInTheDocument();
                        })];
                case 1:
                    // Wait for data to load
                    _a.sent();
                    // Check system status
                    (0, vitest_1.expect)(react_1.screen.getByText('系统版本:')).toBeInTheDocument();
                    (0, vitest_1.expect)(react_1.screen.getByText('数据库状态:')).toBeInTheDocument();
                    return [2 /*return*/];
            }
        });
    }); });
});
