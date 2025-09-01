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
var healthCheck_1 = require("../../services/healthCheck");
(0, vitest_1.describe)('HealthCheckService', function () {
    var healthCheckService;
    (0, vitest_1.beforeEach)(function () {
        healthCheckService = healthCheck_1.HealthCheckService.getInstance();
        // Clear localStorage before each test
        localStorage.clear();
    });
    (0, vitest_1.it)('should get instance', function () {
        (0, vitest_1.expect)(healthCheckService).toBeDefined();
        var anotherInstance = healthCheck_1.HealthCheckService.getInstance();
        (0, vitest_1.expect)(anotherInstance).toBe(healthCheckService);
    });
    (0, vitest_1.it)('should check storage health', function () { return __awaiter(void 0, void 0, void 0, function () {
        var storageHealth;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, healthCheckService.checkStorageHealth()];
                case 1:
                    storageHealth = _a.sent();
                    (0, vitest_1.expect)(storageHealth).toBeDefined();
                    (0, vitest_1.expect)(storageHealth.status).toBeDefined();
                    (0, vitest_1.expect)(storageHealth.message).toBeDefined();
                    (0, vitest_1.expect)(storageHealth.timestamp).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should check network health', function () { return __awaiter(void 0, void 0, void 0, function () {
        var networkHealth;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, healthCheckService.checkNetworkHealth()];
                case 1:
                    networkHealth = _a.sent();
                    (0, vitest_1.expect)(networkHealth).toBeDefined();
                    (0, vitest_1.expect)(networkHealth.status).toBeDefined();
                    (0, vitest_1.expect)(networkHealth.message).toBeDefined();
                    (0, vitest_1.expect)(networkHealth.timestamp).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should check database health', function () { return __awaiter(void 0, void 0, void 0, function () {
        var databaseHealth;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, healthCheckService.checkDatabaseHealth()];
                case 1:
                    databaseHealth = _a.sent();
                    (0, vitest_1.expect)(databaseHealth).toBeDefined();
                    (0, vitest_1.expect)(databaseHealth.status).toBeDefined();
                    (0, vitest_1.expect)(databaseHealth.message).toBeDefined();
                    (0, vitest_1.expect)(databaseHealth.timestamp).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should check authentication health with no user', function () { return __awaiter(void 0, void 0, void 0, function () {
        var authHealth;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, healthCheckService.checkAuthenticationHealth()];
                case 1:
                    authHealth = _a.sent();
                    (0, vitest_1.expect)(authHealth).toBeDefined();
                    (0, vitest_1.expect)(authHealth.status).toBe('warning');
                    (0, vitest_1.expect)(authHealth.message).toBe('无活动用户会话');
                    (0, vitest_1.expect)(authHealth.timestamp).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should check authentication health with valid user', function () { return __awaiter(void 0, void 0, void 0, function () {
        var userData, authHealth;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userData = { id: '1', name: 'Test User', role: 'admin' };
                    localStorage.setItem('currentUser', JSON.stringify(userData));
                    return [4 /*yield*/, healthCheckService.checkAuthenticationHealth()];
                case 1:
                    authHealth = _a.sent();
                    (0, vitest_1.expect)(authHealth).toBeDefined();
                    (0, vitest_1.expect)(authHealth.status).toBe('healthy');
                    (0, vitest_1.expect)(authHealth.message).toBe('认证服务正常');
                    (0, vitest_1.expect)(authHealth.timestamp).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should check authentication health with invalid user data', function () { return __awaiter(void 0, void 0, void 0, function () {
        var authHealth;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // 设置无效的用户数据
                    localStorage.setItem('currentUser', 'invalid json');
                    return [4 /*yield*/, healthCheckService.checkAuthenticationHealth()];
                case 1:
                    authHealth = _a.sent();
                    (0, vitest_1.expect)(authHealth).toBeDefined();
                    (0, vitest_1.expect)(authHealth.status).toBe('warning');
                    (0, vitest_1.expect)(authHealth.message).toBe('用户会话数据格式异常');
                    (0, vitest_1.expect)(authHealth.timestamp).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should calculate overall health as healthy', function () {
        var services = {
            storage: { status: 'healthy' },
            network: { status: 'healthy' },
            database: { status: 'healthy' },
            authentication: { status: 'healthy' },
            stores: { status: 'healthy' }
        };
        var overall = healthCheckService.calculateOverallHealth(services);
        (0, vitest_1.expect)(overall).toBeDefined();
        (0, vitest_1.expect)(overall.status).toBe('healthy');
        (0, vitest_1.expect)(overall.message).toBe('系统运行正常');
        (0, vitest_1.expect)(overall.timestamp).toBeDefined();
    });
    (0, vitest_1.it)('should calculate overall health as error', function () {
        var services = {
            storage: { status: 'healthy' },
            network: { status: 'error' },
            database: { status: 'healthy' },
            authentication: { status: 'healthy' },
            stores: { status: 'healthy' }
        };
        var overall = healthCheckService.calculateOverallHealth(services);
        (0, vitest_1.expect)(overall).toBeDefined();
        (0, vitest_1.expect)(overall.status).toBe('error');
        (0, vitest_1.expect)(overall.message).toBe('系统存在严重问题');
        (0, vitest_1.expect)(overall.timestamp).toBeDefined();
    });
    (0, vitest_1.it)('should calculate overall health as warning', function () {
        var services = {
            storage: { status: 'healthy' },
            network: { status: 'warning' },
            database: { status: 'healthy' },
            authentication: { status: 'healthy' },
            stores: { status: 'healthy' }
        };
        var overall = healthCheckService.calculateOverallHealth(services);
        (0, vitest_1.expect)(overall).toBeDefined();
        (0, vitest_1.expect)(overall.status).toBe('warning');
        (0, vitest_1.expect)(overall.message).toBe('系统存在警告');
        (0, vitest_1.expect)(overall.timestamp).toBeDefined();
    });
    (0, vitest_1.it)('should check system health', function () { return __awaiter(void 0, void 0, void 0, function () {
        var systemHealth;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, healthCheckService.checkSystemHealth()];
                case 1:
                    systemHealth = _a.sent();
                    (0, vitest_1.expect)(systemHealth).toBeDefined();
                    (0, vitest_1.expect)(systemHealth.overall).toBeDefined();
                    (0, vitest_1.expect)(systemHealth.services).toBeDefined();
                    (0, vitest_1.expect)(systemHealth.timestamp).toBeDefined();
                    // 检查各个服务
                    (0, vitest_1.expect)(systemHealth.services.storage).toBeDefined();
                    (0, vitest_1.expect)(systemHealth.services.network).toBeDefined();
                    (0, vitest_1.expect)(systemHealth.services.database).toBeDefined();
                    (0, vitest_1.expect)(systemHealth.services.authentication).toBeDefined();
                    (0, vitest_1.expect)(systemHealth.services.stores).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should get quick health status', function () { return __awaiter(void 0, void 0, void 0, function () {
        var quickHealth;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, healthCheckService.getQuickHealthStatus()];
                case 1:
                    quickHealth = _a.sent();
                    (0, vitest_1.expect)(quickHealth).toBeDefined();
                    (0, vitest_1.expect)(quickHealth.status).toBeDefined();
                    (0, vitest_1.expect)(quickHealth.message).toBeDefined();
                    (0, vitest_1.expect)(quickHealth.timestamp).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
});
