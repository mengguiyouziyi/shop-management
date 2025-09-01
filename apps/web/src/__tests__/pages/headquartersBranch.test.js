"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_router_dom_1 = require("react-router-dom");
var index_1 = __importDefault(require("../../pages/headquarters-branch/index"));
var useAppStore_1 = require("../../store/useAppStore");
var headquartersBranch_1 = require("../../services/headquartersBranch");
var store_1 = require("../../services/store");
// Mock dependencies
vitest_1.vi.mock('../../store/useAppStore');
vitest_1.vi.mock('../../services/headquartersBranch');
vitest_1.vi.mock('../../services/store');
(0, vitest_1.describe)('HeadquartersBranchPage', function () {
    var mockCurrentStore = {
        id: 'hq1',
        name: 'Test Headquarters',
        code: 'HQ001',
        address: 'Test Address',
        phone: '123456789',
        manager: 'Test Manager',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        isActive: true,
        level: 0
    };
    var mockBranches = [
        {
            id: 'branch1',
            name: 'Test Branch 1',
            code: 'B001',
            address: 'Branch Address 1',
            phone: '111111111',
            manager: 'Branch Manager 1',
            createdAt: '2023-01-01',
            updatedAt: '2023-01-01',
            isActive: true,
            level: 1,
            parentId: 'hq1'
        },
        {
            id: 'branch2',
            name: 'Test Branch 2',
            code: 'B002',
            address: 'Branch Address 2',
            phone: '222222222',
            manager: 'Branch Manager 2',
            createdAt: '2023-01-01',
            updatedAt: '2023-01-01',
            isActive: true,
            level: 1,
            parentId: 'hq1'
        }
    ];
    var mockSettings = {
        id: 'settings1',
        headquartersId: 'hq1',
        syncProducts: true,
        syncMembers: true,
        syncSuppliers: false,
        syncPricing: true,
        syncInventory: false,
        allowCrossStoreOrders: true,
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01'
    };
    var mockAllStores = __spreadArray([
        mockCurrentStore
    ], mockBranches, true);
    (0, vitest_1.beforeEach)(function () {
        // Reset all mocks
        vitest_1.vi.clearAllMocks();
        // Setup default mock returns
        useAppStore_1.useAppStore.mockReturnValue({
            currentStore: mockCurrentStore
        });
        headquartersBranch_1.HeadquartersBranchService.getInstance.mockReturnValue({
            getChildStores: vitest_1.vi.fn().mockResolvedValue(mockBranches),
            getHeadquartersBranchSettings: vitest_1.vi.fn().mockResolvedValue(mockSettings),
            updateHeadquartersBranchSettings: vitest_1.vi.fn().mockResolvedValue(mockSettings),
            syncDataToBranches: vitest_1.vi.fn().mockResolvedValue(undefined)
        });
        store_1.StoreService.getInstance.mockReturnValue({
            getAllStores: vitest_1.vi.fn().mockResolvedValue(mockAllStores)
        });
    });
    (0, vitest_1.it)('should show loading state initially', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(index_1.default, {}) }));
        // Check loading state
        (0, vitest_1.expect)(react_1.screen.getByText('加载中...')).toBeTruthy();
    });
});
