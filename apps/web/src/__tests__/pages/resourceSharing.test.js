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
var index_1 = __importDefault(require("../../pages/resource-sharing/index"));
// Mock data
var mockSharedResources = [
    {
        id: '1',
        name: 'Test Product',
        type: 'product',
        sourceStoreId: '1',
        sourceStoreName: 'Headquarters',
        sharedWith: [
            {
                storeId: '2',
                storeName: 'Test Store 2',
                sharedAt: '2023-01-01T00:00:00Z'
            }
        ],
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
    }
];
var mockShareRequests = [
    {
        id: '1',
        resourceId: '1',
        resourceName: 'Test Product',
        resourceType: 'product',
        requestingStoreId: '2',
        requestingStoreName: 'Test Store 2',
        targetStoreId: '1',
        status: 'pending',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
    }
];
var mockStores = [
    {
        id: '1',
        name: 'Headquarters',
        code: 'HQ',
        address: '123 Main St',
        phone: '555-1234',
        manager: 'John Doe',
        level: 0,
        parentId: null,
        isHeadquarters: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
    },
    {
        id: '2',
        name: 'Test Store 2',
        code: 'TS2',
        address: '456 Oak Ave',
        phone: '555-5678',
        manager: 'Jane Smith',
        level: 1,
        parentId: '1',
        isHeadquarters: false,
        createdAt: '2023-01-02T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z'
    }
];
// Mock services
vitest_1.vi.mock('../../services/resourceSharing', function () {
    return {
        ResourceSharingService: {
            getInstance: function () { return ({
                getSharedResources: vitest_1.vi.fn().mockResolvedValue(mockSharedResources),
                getShareRequests: vitest_1.vi.fn().mockResolvedValue(mockShareRequests),
                shareResource: vitest_1.vi.fn().mockResolvedValue({ success: true }),
                approveRequest: vitest_1.vi.fn().mockResolvedValue({ success: true }),
                rejectRequest: vitest_1.vi.fn().mockResolvedValue({ success: true })
            }); }
        }
    };
});
vitest_1.vi.mock('../../services/store', function () {
    return {
        StoreService: {
            getInstance: function () { return ({
                getAllStores: vitest_1.vi.fn().mockResolvedValue(mockStores)
            }); }
        }
    };
});
vitest_1.vi.mock('../../store/useAppStore', function () {
    return {
        useAppStore: function () { return ({
            currentStore: mockStores[0]
        }); }
    };
});
(0, vitest_1.describe)('ResourceSharingPage', function () {
    (0, vitest_1.beforeEach)(function () {
        // Clear all mocks before each test
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)('should render resource sharing page', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
        (0, vitest_1.expect)(react_1.screen.getByText('资源共享')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should display shared resources', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
                    // Wait for data to load
                    return [4 /*yield*/, (0, react_1.waitFor)(function () {
                            (0, vitest_1.expect)(react_1.screen.getByText('Test Product')).toBeInTheDocument();
                        }, { timeout: 3000 })];
                case 1:
                    // Wait for data to load
                    _a.sent();
                    (0, vitest_1.expect)(react_1.screen.getByText('product')).toBeInTheDocument();
                    (0, vitest_1.expect)(react_1.screen.getByText('Test Store 2')).toBeInTheDocument();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should display share requests', function () { return __awaiter(void 0, void 0, void 0, function () {
        var requestsTab;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
                    requestsTab = react_1.screen.getByText('收到的共享请求');
                    react_1.fireEvent.click(requestsTab);
                    // Wait for data to load
                    return [4 /*yield*/, (0, react_1.waitFor)(function () {
                            (0, vitest_1.expect)(react_1.screen.getByText('Test Product')).toBeInTheDocument();
                        }, { timeout: 3000 })];
                case 1:
                    // Wait for data to load
                    _a.sent();
                    // Check share requests table
                    (0, vitest_1.expect)(react_1.screen.getByText('Test Product')).toBeInTheDocument();
                    (0, vitest_1.expect)(react_1.screen.getByText('product')).toBeInTheDocument();
                    (0, vitest_1.expect)(react_1.screen.getByText('Test Store 2')).toBeInTheDocument();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should switch between tabs', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
        // Initially should show shared resources
        (0, vitest_1.expect)(react_1.screen.getByText('我共享的资源')).toBeInTheDocument();
        // Switch to requests tab
        var requestsTab = react_1.screen.getByText('收到的共享请求');
        react_1.fireEvent.click(requestsTab);
        (0, vitest_1.expect)(react_1.screen.getByText('收到的共享请求')).toBeInTheDocument();
        // Switch back to shared resources tab
        var sharedTab = react_1.screen.getByText('我共享的资源');
        react_1.fireEvent.click(sharedTab);
        (0, vitest_1.expect)(react_1.screen.getByText('我共享的资源')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should open share resource form', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
        var shareButton = react_1.screen.getByText('发起资源共享');
        react_1.fireEvent.click(shareButton);
        (0, vitest_1.expect)(react_1.screen.getByText('发起资源共享')).toBeInTheDocument();
    });
});
