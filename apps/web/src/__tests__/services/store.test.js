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
var store_1 = require("../../services/store");
(0, vitest_1.describe)('StoreService', function () {
    var storeService;
    (0, vitest_1.beforeEach)(function () {
        storeService = store_1.StoreService.getInstance();
        // Clear localStorage before each test
        localStorage.clear();
    });
    (0, vitest_1.it)('should create store', function () { return __awaiter(void 0, void 0, void 0, function () {
        var storeData, store;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    storeData = {
                        name: 'Test Store',
                        code: 'TS001',
                        address: 'Test Address',
                        phone: '123456789',
                        manager: 'Test Manager',
                        isActive: true,
                        level: 0
                    };
                    return [4 /*yield*/, storeService.createStore(storeData)];
                case 1:
                    store = _a.sent();
                    (0, vitest_1.expect)(store).toBeDefined();
                    (0, vitest_1.expect)(store.id).toBeDefined();
                    (0, vitest_1.expect)(store.name).toBe(storeData.name);
                    (0, vitest_1.expect)(store.code).toBe(storeData.code);
                    (0, vitest_1.expect)(store.level).toBe(0); //总部层级为0
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should get all stores', function () { return __awaiter(void 0, void 0, void 0, function () {
        var storeData, stores;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    storeData = {
                        name: 'Test Store',
                        code: 'TS001',
                        address: 'Test Address',
                        phone: '123456789',
                        manager: 'Test Manager',
                        isActive: true,
                        level: 0
                    };
                    return [4 /*yield*/, storeService.createStore(storeData)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, storeService.getAllStores()];
                case 2:
                    stores = _a.sent();
                    (0, vitest_1.expect)(stores).toHaveLength(1);
                    (0, vitest_1.expect)(stores[0].name).toBe(storeData.name);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should manage store permissions', function () { return __awaiter(void 0, void 0, void 0, function () {
        var storeData, store, permissions, storePermission, userPermissions, storePermissions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    storeData = {
                        name: 'Test Store',
                        code: 'TS001',
                        address: 'Test Address',
                        phone: '123456789',
                        manager: 'Test Manager',
                        isActive: true,
                        level: 0
                    };
                    return [4 /*yield*/, storeService.createStore(storeData)];
                case 1:
                    store = _a.sent();
                    permissions = ['read_products', 'write_products'];
                    return [4 /*yield*/, storeService.setStorePermission(store.id, 'user123', 'manager', permissions)];
                case 2:
                    storePermission = _a.sent();
                    (0, vitest_1.expect)(storePermission).toBeDefined();
                    (0, vitest_1.expect)(storePermission.storeId).toBe(store.id);
                    (0, vitest_1.expect)(storePermission.userId).toBe('user123');
                    (0, vitest_1.expect)(storePermission.role).toBe('manager');
                    (0, vitest_1.expect)(storePermission.permissions).toEqual(permissions);
                    return [4 /*yield*/, storeService.getUserPermissions('user123')];
                case 3:
                    userPermissions = _a.sent();
                    (0, vitest_1.expect)(userPermissions).toHaveLength(1);
                    (0, vitest_1.expect)(userPermissions[0].storeId).toBe(store.id);
                    return [4 /*yield*/, storeService.getStorePermissions(store.id)];
                case 4:
                    storePermissions = _a.sent();
                    (0, vitest_1.expect)(storePermissions).toHaveLength(1);
                    (0, vitest_1.expect)(storePermissions[0].userId).toBe('user123');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should handle store hierarchy', function () { return __awaiter(void 0, void 0, void 0, function () {
        var headquartersData, headquarters, branchData, branch, childStores, hierarchy;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headquartersData = {
                        name: '总部',
                        code: 'HQ',
                        address: '总部地址',
                        phone: '123456789',
                        manager: '总部经理',
                        isActive: true,
                        level: 0
                    };
                    return [4 /*yield*/, storeService.createStore(headquartersData)];
                case 1:
                    headquarters = _a.sent();
                    console.log('Headquarters created:', headquarters);
                    branchData = {
                        name: '分店1',
                        code: 'B1',
                        address: '分店地址',
                        phone: '987654321',
                        manager: '分店经理',
                        isActive: true,
                        parentId: headquarters.id,
                        level: 1
                    };
                    return [4 /*yield*/, storeService.createStore(branchData)];
                case 2:
                    branch = _a.sent();
                    console.log('Branch created:', branch);
                    // 验证店铺层级
                    (0, vitest_1.expect)(headquarters.level).toBe(0);
                    (0, vitest_1.expect)(branch.level).toBe(1);
                    (0, vitest_1.expect)(branch.parentId).toBe(headquarters.id);
                    return [4 /*yield*/, storeService.getChildStores(headquarters.id)];
                case 3:
                    childStores = _a.sent();
                    console.log('Child stores:', childStores);
                    (0, vitest_1.expect)(childStores).toHaveLength(1);
                    (0, vitest_1.expect)(childStores[0].id).toBe(branch.id);
                    return [4 /*yield*/, storeService.getStoreHierarchy(branch.id)];
                case 4:
                    hierarchy = _a.sent();
                    (0, vitest_1.expect)(hierarchy).toHaveLength(2);
                    (0, vitest_1.expect)(hierarchy[0].id).toBe(headquarters.id);
                    (0, vitest_1.expect)(hierarchy[1].id).toBe(branch.id);
                    return [2 /*return*/];
            }
        });
    }); });
});
