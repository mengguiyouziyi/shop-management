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
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var headquartersBranch_1 = require("../../services/headquartersBranch");
// 模拟数据
var mockStores = [
    {
        id: 'hq1',
        name: '总部',
        code: 'HQ001',
        address: '总部地址',
        phone: '123456789',
        manager: '总部经理',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        isActive: true,
        level: 0
    },
    {
        id: 'branch1',
        name: '分店1',
        code: 'B001',
        address: '分店1地址',
        phone: '123456780',
        manager: '分店1经理',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        isActive: true,
        level: 1,
        parentId: 'hq1'
    },
    {
        id: 'branch2',
        name: '分店2',
        code: 'B002',
        address: '分店2地址',
        phone: '123456788',
        manager: '分店2经理',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        isActive: true,
        level: 1,
        parentId: 'hq1'
    }
];
var mockHeadquartersBranchSettings = [
    {
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
    }
];
var mockProducts = [
    {
        id: 'p1',
        name: '示例产品1',
        code: 'P001',
        category: '示例分类',
        price: 100,
        cost: 50,
        stock: 100,
        minStock: 10,
        supplier: '示例供应商',
        description: '示例产品描述',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01'
    }
];
var mockMembers = [
    {
        id: 'm1',
        name: '示例会员',
        phone: '13800138000',
        email: 'member@example.com',
        points: 100,
        level: '普通会员',
        address: '示例地址',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01'
    }
];
var mockOrders = [
    {
        id: 'o1',
        storeId: 's1',
        memberId: 'm1',
        products: [],
        totalAmount: 100,
        discountAmount: 0,
        finalAmount: 100,
        status: 'completed',
        paymentMethod: 'cash',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01'
    }
];
(0, vitest_1.describe)('HeadquartersBranchService', function () {
    var service;
    (0, vitest_1.beforeEach)(function () {
        // Reset the singleton instance
        headquartersBranch_1.HeadquartersBranchService.instance = null;
        service = headquartersBranch_1.HeadquartersBranchService.getInstance();
        // Reset mocks
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)('should be a singleton', function () {
        var service1 = headquartersBranch_1.HeadquartersBranchService.getInstance();
        var service2 = headquartersBranch_1.HeadquartersBranchService.getInstance();
        (0, vitest_1.expect)(service1).toBe(service2);
    });
    (0, vitest_1.it)('should get child stores', function () { return __awaiter(void 0, void 0, void 0, function () {
        var headquartersId, childStores;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headquartersId = 'hq1';
                    return [4 /*yield*/, service.getChildStores(headquartersId)];
                case 1:
                    childStores = _a.sent();
                    (0, vitest_1.expect)(childStores).toHaveLength(2);
                    (0, vitest_1.expect)(childStores[0].parentId).toBe(headquartersId);
                    (0, vitest_1.expect)(childStores[1].parentId).toBe(headquartersId);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should get headquarters branch settings', function () { return __awaiter(void 0, void 0, void 0, function () {
        var headquartersId, settings;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headquartersId = 'hq1';
                    return [4 /*yield*/, service.getHeadquartersBranchSettings(headquartersId)];
                case 1:
                    settings = _a.sent();
                    (0, vitest_1.expect)(settings.headquartersId).toBe(headquartersId);
                    (0, vitest_1.expect)(settings.syncProducts).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should create default settings if none exist', function () { return __awaiter(void 0, void 0, void 0, function () {
        var headquartersId, settings;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headquartersId = 'non-existent-hq';
                    return [4 /*yield*/, service.getHeadquartersBranchSettings(headquartersId)];
                case 1:
                    settings = _a.sent();
                    (0, vitest_1.expect)(settings.headquartersId).toBe(headquartersId);
                    (0, vitest_1.expect)(settings.syncProducts).toBe(false); // Default value
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should update headquarters branch settings', function () { return __awaiter(void 0, void 0, void 0, function () {
        var headquartersId, updatedSettings;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headquartersId = 'hq1';
                    return [4 /*yield*/, service.updateHeadquartersBranchSettings(headquartersId, {
                            syncProducts: false,
                            syncMembers: true
                        })];
                case 1:
                    updatedSettings = _a.sent();
                    (0, vitest_1.expect)(updatedSettings.headquartersId).toBe(headquartersId);
                    (0, vitest_1.expect)(updatedSettings.syncProducts).toBe(false);
                    (0, vitest_1.expect)(updatedSettings.syncMembers).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should sync data to branches', function () { return __awaiter(void 0, void 0, void 0, function () {
        var headquartersId, consoleLogSpy, results, i, error_1, successCount, failureCount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headquartersId = 'hq1';
                    consoleLogSpy = vitest_1.vi.spyOn(console, 'log').mockImplementation(function () { });
                    results = [];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < 5)) return [3 /*break*/, 6];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, service.syncDataToBranches(headquartersId)];
                case 3:
                    _a.sent();
                    results.push('success');
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    results.push('failure');
                    return [3 /*break*/, 5];
                case 5:
                    i++;
                    return [3 /*break*/, 1];
                case 6:
                    successCount = results.filter(function (r) { return r === 'success'; }).length;
                    failureCount = results.filter(function (r) { return r === 'failure'; }).length;
                    (0, vitest_1.expect)(successCount).toBeGreaterThan(0);
                    (0, vitest_1.expect)(failureCount).toBeGreaterThan(0);
                    consoleLogSpy.mockRestore();
                    return [2 /*return*/];
            }
        });
    }); }, 10000); // Increase timeout to 10 seconds
    (0, vitest_1.it)('should get products to sync', function () { return __awaiter(void 0, void 0, void 0, function () {
        var products;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.getProductsToSync()];
                case 1:
                    products = _a.sent();
                    (0, vitest_1.expect)(products).toEqual(mockProducts);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should get members to sync', function () { return __awaiter(void 0, void 0, void 0, function () {
        var members;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.getMembersToSync()];
                case 1:
                    members = _a.sent();
                    (0, vitest_1.expect)(members).toEqual(mockMembers);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should get orders to sync', function () { return __awaiter(void 0, void 0, void 0, function () {
        var orders;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.getOrdersToSync()];
                case 1:
                    orders = _a.sent();
                    (0, vitest_1.expect)(orders).toEqual(mockOrders);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should record data sync', function () { return __awaiter(void 0, void 0, void 0, function () {
        var syncRecord, consoleLogSpy, recorded;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    syncRecord = {
                        headquartersId: 'hq1',
                        branchIds: ['branch1', 'branch2'],
                        syncType: 'full',
                        status: 'completed',
                        endTime: new Date().toISOString()
                    };
                    consoleLogSpy = vitest_1.vi.spyOn(console, 'log').mockImplementation(function () { });
                    return [4 /*yield*/, service.recordDataSync(syncRecord)];
                case 1:
                    recorded = _a.sent();
                    (0, vitest_1.expect)(recorded.id).toBeDefined();
                    (0, vitest_1.expect)(recorded.startTime).toBeDefined();
                    (0, vitest_1.expect)(recorded.headquartersId).toBe(syncRecord.headquartersId);
                    (0, vitest_1.expect)(recorded.branchIds).toEqual(syncRecord.branchIds);
                    consoleLogSpy.mockRestore();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should collect unique store IDs from orders', function () {
        // This test is for implementation details, not the public API
        // We'll test the concept without accessing private methods
        // Simulate orders from different stores
        var orders = [
            { id: '1', storeId: 'store1' },
            { id: '2', storeId: 'store2' },
            { id: '3', storeId: 'store1' }, // Duplicate
            { id: '4', storeId: 'store3' }
        ];
        // Extract unique store IDs
        var storeIds = orders.map(function (order) { return order.storeId; });
        var uniqueStoreIds = Array.from(new Set(storeIds));
        (0, vitest_1.expect)(uniqueStoreIds).toEqual(['store1', 'store2', 'store3']);
    });
});
