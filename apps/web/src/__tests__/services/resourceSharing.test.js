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
var resourceSharing_1 = require("../../services/resourceSharing");
var store_1 = require("../../services/store");
(0, vitest_1.describe)('ResourceSharingService', function () {
    var resourceSharingService;
    var storeService;
    (0, vitest_1.beforeEach)(function () {
        resourceSharingService = resourceSharing_1.ResourceSharingService.getInstance();
        storeService = store_1.StoreService.getInstance();
        // Clear localStorage before each test
        localStorage.clear();
    });
    (0, vitest_1.it)('should get instance', function () {
        (0, vitest_1.expect)(resourceSharingService).toBeDefined();
        var anotherInstance = resourceSharing_1.ResourceSharingService.getInstance();
        (0, vitest_1.expect)(anotherInstance).toBe(resourceSharingService);
    });
    (0, vitest_1.it)('should handle empty resources', function () { return __awaiter(void 0, void 0, void 0, function () {
        var sharedResources, storeResources;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, resourceSharingService.getAllSharedResources()];
                case 1:
                    sharedResources = _a.sent();
                    (0, vitest_1.expect)(sharedResources).toHaveLength(0);
                    return [4 /*yield*/, resourceSharingService.getSharedResourcesForStore('store1')];
                case 2:
                    storeResources = _a.sent();
                    (0, vitest_1.expect)(storeResources).toHaveLength(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should handle empty share requests', function () { return __awaiter(void 0, void 0, void 0, function () {
        var shareRequests, storeRequests;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, resourceSharingService.getAllShareRequests()];
                case 1:
                    shareRequests = _a.sent();
                    (0, vitest_1.expect)(shareRequests).toHaveLength(0);
                    return [4 /*yield*/, resourceSharingService.getShareRequestsForStore('store1')];
                case 2:
                    storeRequests = _a.sent();
                    (0, vitest_1.expect)(storeRequests).toHaveLength(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should create and manage resource sharing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var store1, store2, sharedResource, allSharedResources, store2Resources, updatedStore2Resources;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, storeService.createStore({
                        name: 'Store 1',
                        code: 'S1',
                        address: 'Address 1',
                        phone: '123456789',
                        manager: 'Manager 1',
                        isActive: true,
                        level: 0
                    })];
                case 1:
                    store1 = _a.sent();
                    // 等待一点时间确保第二个店铺有不同ID
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 10); })];
                case 2:
                    // 等待一点时间确保第二个店铺有不同ID
                    _a.sent();
                    return [4 /*yield*/, storeService.createStore({
                            name: 'Store 2',
                            code: 'S2',
                            address: 'Address 2',
                            phone: '987654321',
                            manager: 'Manager 2',
                            isActive: true,
                            level: 1,
                            parentId: store1.id
                        })];
                case 3:
                    store2 = _a.sent();
                    // 确保两个店铺ID不同
                    (0, vitest_1.expect)(store1.id).not.toBe(store2.id);
                    return [4 /*yield*/, resourceSharingService.shareResource('product1', 'product', store1.id, [store2.id])];
                case 4:
                    sharedResource = _a.sent();
                    (0, vitest_1.expect)(sharedResource).toBeDefined();
                    (0, vitest_1.expect)(sharedResource.id).toBe('product_product1_' + store1.id);
                    (0, vitest_1.expect)(sharedResource.type).toBe('product');
                    (0, vitest_1.expect)(sharedResource.sourceStoreId).toBe(store1.id);
                    (0, vitest_1.expect)(sharedResource.sharedWith).toHaveLength(1);
                    (0, vitest_1.expect)(sharedResource.sharedWith[0].storeId).toBe(store2.id);
                    return [4 /*yield*/, resourceSharingService.getAllSharedResources()];
                case 5:
                    allSharedResources = _a.sent();
                    (0, vitest_1.expect)(allSharedResources).toHaveLength(1);
                    return [4 /*yield*/, resourceSharingService.getSharedResourcesForStore(store2.id)];
                case 6:
                    store2Resources = _a.sent();
                    (0, vitest_1.expect)(store2Resources).toHaveLength(1);
                    (0, vitest_1.expect)(store2Resources[0].id).toBe(sharedResource.id);
                    // 测试停止资源共享
                    return [4 /*yield*/, resourceSharingService.stopSharingResource(sharedResource.id, // 使用完整资源ID
                        store1.id, store2.id)];
                case 7:
                    // 测试停止资源共享
                    _a.sent();
                    return [4 /*yield*/, resourceSharingService.getSharedResourcesForStore(store2.id)];
                case 8:
                    updatedStore2Resources = _a.sent();
                    (0, vitest_1.expect)(updatedStore2Resources).toHaveLength(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should create and process share requests', function () { return __awaiter(void 0, void 0, void 0, function () {
        var store1, store2, shareRequest, allRequests, store1Requests, updatedRequests;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, storeService.createStore({
                        name: 'Store 1',
                        code: 'S1',
                        address: 'Address 1',
                        phone: '123456789',
                        manager: 'Manager 1',
                        isActive: true,
                        level: 0
                    })];
                case 1:
                    store1 = _a.sent();
                    // 等待一点时间确保第二个店铺有不同ID
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 10); })];
                case 2:
                    // 等待一点时间确保第二个店铺有不同ID
                    _a.sent();
                    return [4 /*yield*/, storeService.createStore({
                            name: 'Store 2',
                            code: 'S2',
                            address: 'Address 2',
                            phone: '987654321',
                            manager: 'Manager 2',
                            isActive: true,
                            level: 1,
                            parentId: store1.id
                        })];
                case 3:
                    store2 = _a.sent();
                    return [4 /*yield*/, resourceSharingService.createShareRequest('product1', 'product', 'Test Product', store2.id, store1.id)];
                case 4:
                    shareRequest = _a.sent();
                    (0, vitest_1.expect)(shareRequest).toBeDefined();
                    (0, vitest_1.expect)(shareRequest.resourceId).toBe('product1');
                    (0, vitest_1.expect)(shareRequest.resourceType).toBe('product');
                    (0, vitest_1.expect)(shareRequest.requestingStoreId).toBe(store2.id);
                    (0, vitest_1.expect)(shareRequest.targetStoreId).toBe(store1.id);
                    (0, vitest_1.expect)(shareRequest.status).toBe('pending');
                    return [4 /*yield*/, resourceSharingService.getAllShareRequests()];
                case 5:
                    allRequests = _a.sent();
                    (0, vitest_1.expect)(allRequests).toHaveLength(1);
                    return [4 /*yield*/, resourceSharingService.getShareRequestsForStore(store1.id)];
                case 6:
                    store1Requests = _a.sent();
                    (0, vitest_1.expect)(store1Requests).toHaveLength(1);
                    (0, vitest_1.expect)(store1Requests[0].id).toBe(shareRequest.id);
                    // 处理共享请求（批准）
                    return [4 /*yield*/, resourceSharingService.processShareRequest(shareRequest.id, 'approved')];
                case 7:
                    // 处理共享请求（批准）
                    _a.sent();
                    return [4 /*yield*/, resourceSharingService.getAllShareRequests()];
                case 8:
                    updatedRequests = _a.sent();
                    (0, vitest_1.expect)(updatedRequests[0].status).toBe('approved');
                    return [2 /*return*/];
            }
        });
    }); });
});
