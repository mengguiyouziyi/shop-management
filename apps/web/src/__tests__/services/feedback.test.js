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
var feedback_1 = require("../../services/feedback");
(0, vitest_1.describe)('FeedbackService', function () {
    var feedbackService;
    (0, vitest_1.beforeEach)(function () {
        feedbackService = feedback_1.FeedbackService.getInstance();
        // Clear localStorage before each test
        localStorage.clear();
    });
    (0, vitest_1.it)('should get instance', function () {
        (0, vitest_1.expect)(feedbackService).toBeDefined();
        var anotherInstance = feedback_1.FeedbackService.getInstance();
        (0, vitest_1.expect)(anotherInstance).toBe(feedbackService);
    });
    (0, vitest_1.it)('should submit feedback', function () { return __awaiter(void 0, void 0, void 0, function () {
        var feedbackData, feedback;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    feedbackData = {
                        userId: 'user1',
                        userName: '张三',
                        userEmail: 'zhangsan@example.com',
                        type: 'feature',
                        title: '新功能建议',
                        description: '希望增加库存预警功能',
                        priority: 'medium'
                    };
                    return [4 /*yield*/, feedbackService.submitFeedback(feedbackData)];
                case 1:
                    feedback = _a.sent();
                    (0, vitest_1.expect)(feedback).toBeDefined();
                    (0, vitest_1.expect)(feedback.id).toBeDefined();
                    (0, vitest_1.expect)(feedback.title).toBe(feedbackData.title);
                    (0, vitest_1.expect)(feedback.status).toBe('submitted');
                    (0, vitest_1.expect)(feedback.createdAt).toBeDefined();
                    (0, vitest_1.expect)(feedback.updatedAt).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should get all feedbacks', function () { return __awaiter(void 0, void 0, void 0, function () {
        var feedbacks, firstFeedbackDate, secondFeedbackDate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // 提交几个反馈
                return [4 /*yield*/, feedbackService.submitFeedback({
                        userId: 'user1',
                        userName: '张三',
                        userEmail: 'zhangsan@example.com',
                        type: 'bug',
                        title: 'Bug报告1',
                        description: '描述1',
                        priority: 'high'
                    })];
                case 1:
                    // 提交几个反馈
                    _a.sent();
                    return [4 /*yield*/, feedbackService.submitFeedback({
                            userId: 'user2',
                            userName: '李四',
                            userEmail: 'lisi@example.com',
                            type: 'feature',
                            title: '功能建议1',
                            description: '描述2',
                            priority: 'medium'
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, feedbackService.getAllFeedbacks()];
                case 3:
                    feedbacks = _a.sent();
                    (0, vitest_1.expect)(feedbacks).toBeDefined();
                    (0, vitest_1.expect)(Array.isArray(feedbacks)).toBe(true);
                    (0, vitest_1.expect)(feedbacks.length).toBeGreaterThanOrEqual(2);
                    firstFeedbackDate = new Date(feedbacks[0].createdAt).getTime();
                    secondFeedbackDate = new Date(feedbacks[1].createdAt).getTime();
                    (0, vitest_1.expect)(firstFeedbackDate).toBeGreaterThanOrEqual(secondFeedbackDate);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should get feedbacks by user', function () { return __awaiter(void 0, void 0, void 0, function () {
        var userFeedbacks;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // 提交几个反馈
                return [4 /*yield*/, feedbackService.submitFeedback({
                        userId: 'user1',
                        userName: '张三',
                        userEmail: 'zhangsan@example.com',
                        type: 'bug',
                        title: 'Bug报告1',
                        description: '描述1',
                        priority: 'high'
                    })];
                case 1:
                    // 提交几个反馈
                    _a.sent();
                    return [4 /*yield*/, feedbackService.submitFeedback({
                            userId: 'user2',
                            userName: '李四',
                            userEmail: 'lisi@example.com',
                            type: 'feature',
                            title: '功能建议1',
                            description: '描述2',
                            priority: 'medium'
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, feedbackService.getFeedbacksByUser('user1')];
                case 3:
                    userFeedbacks = _a.sent();
                    (0, vitest_1.expect)(userFeedbacks).toBeDefined();
                    (0, vitest_1.expect)(Array.isArray(userFeedbacks)).toBe(true);
                    (0, vitest_1.expect)(userFeedbacks.length).toBe(1);
                    (0, vitest_1.expect)(userFeedbacks[0].userId).toBe('user1');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should get feedbacks by status', function () { return __awaiter(void 0, void 0, void 0, function () {
        var feedback, statusFeedbacks;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, feedbackService.submitFeedback({
                        userId: 'user1',
                        userName: '张三',
                        userEmail: 'zhangsan@example.com',
                        type: 'bug',
                        title: 'Bug报告1',
                        description: '描述1',
                        priority: 'high'
                    })];
                case 1:
                    feedback = _a.sent();
                    return [4 /*yield*/, feedbackService.getFeedbacksByStatus('submitted')];
                case 2:
                    statusFeedbacks = _a.sent();
                    (0, vitest_1.expect)(statusFeedbacks).toBeDefined();
                    (0, vitest_1.expect)(Array.isArray(statusFeedbacks)).toBe(true);
                    (0, vitest_1.expect)(statusFeedbacks.length).toBeGreaterThanOrEqual(1);
                    (0, vitest_1.expect)(statusFeedbacks[0].status).toBe('submitted');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should get feedbacks by type', function () { return __awaiter(void 0, void 0, void 0, function () {
        var typeFeedbacks;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // 提交反馈
                return [4 /*yield*/, feedbackService.submitFeedback({
                        userId: 'user1',
                        userName: '张三',
                        userEmail: 'zhangsan@example.com',
                        type: 'bug',
                        title: 'Bug报告1',
                        description: '描述1',
                        priority: 'high'
                    })];
                case 1:
                    // 提交反馈
                    _a.sent();
                    return [4 /*yield*/, feedbackService.getFeedbacksByType('bug')];
                case 2:
                    typeFeedbacks = _a.sent();
                    (0, vitest_1.expect)(typeFeedbacks).toBeDefined();
                    (0, vitest_1.expect)(Array.isArray(typeFeedbacks)).toBe(true);
                    (0, vitest_1.expect)(typeFeedbacks.length).toBeGreaterThanOrEqual(1);
                    (0, vitest_1.expect)(typeFeedbacks[0].type).toBe('bug');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should update feedback status', function () { return __awaiter(void 0, void 0, void 0, function () {
        var feedback, updatedFeedback;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, feedbackService.submitFeedback({
                        userId: 'user1',
                        userName: '张三',
                        userEmail: 'zhangsan@example.com',
                        type: 'bug',
                        title: 'Bug报告1',
                        description: '描述1',
                        priority: 'high'
                    })];
                case 1:
                    feedback = _a.sent();
                    // 等待一点时间确保时间戳不同
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 10); })];
                case 2:
                    // 等待一点时间确保时间戳不同
                    _a.sent();
                    return [4 /*yield*/, feedbackService.updateFeedbackStatus(feedback.id, 'reviewed')];
                case 3:
                    updatedFeedback = _a.sent();
                    (0, vitest_1.expect)(updatedFeedback).toBeDefined();
                    (0, vitest_1.expect)(updatedFeedback === null || updatedFeedback === void 0 ? void 0 : updatedFeedback.status).toBe('reviewed');
                    (0, vitest_1.expect)(updatedFeedback === null || updatedFeedback === void 0 ? void 0 : updatedFeedback.updatedAt).not.toBe(feedback.updatedAt);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should delete feedback', function () { return __awaiter(void 0, void 0, void 0, function () {
        var feedback, result, feedbacks, deletedFeedback;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, feedbackService.submitFeedback({
                        userId: 'user1',
                        userName: '张三',
                        userEmail: 'zhangsan@example.com',
                        type: 'bug',
                        title: 'Bug报告1',
                        description: '描述1',
                        priority: 'high'
                    })];
                case 1:
                    feedback = _a.sent();
                    return [4 /*yield*/, feedbackService.deleteFeedback(feedback.id)];
                case 2:
                    result = _a.sent();
                    (0, vitest_1.expect)(result).toBe(true);
                    return [4 /*yield*/, feedbackService.getAllFeedbacks()];
                case 3:
                    feedbacks = _a.sent();
                    deletedFeedback = feedbacks.find(function (f) { return f.id === feedback.id; });
                    (0, vitest_1.expect)(deletedFeedback).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should get feedback stats', function () { return __awaiter(void 0, void 0, void 0, function () {
        var stats;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // 提交不同类型和状态的反馈
                return [4 /*yield*/, feedbackService.submitFeedback({
                        userId: 'user1',
                        userName: '张三',
                        userEmail: 'zhangsan@example.com',
                        type: 'bug',
                        title: 'Bug报告1',
                        description: '描述1',
                        priority: 'high'
                    })];
                case 1:
                    // 提交不同类型和状态的反馈
                    _a.sent();
                    return [4 /*yield*/, feedbackService.submitFeedback({
                            userId: 'user2',
                            userName: '李四',
                            userEmail: 'lisi@example.com',
                            type: 'feature',
                            title: '功能建议1',
                            description: '描述2',
                            priority: 'medium'
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, feedbackService.getFeedbackStats()];
                case 3:
                    stats = _a.sent();
                    (0, vitest_1.expect)(stats).toBeDefined();
                    (0, vitest_1.expect)(stats.total).toBeGreaterThanOrEqual(2);
                    (0, vitest_1.expect)(stats.bug).toBeGreaterThanOrEqual(1);
                    (0, vitest_1.expect)(stats.feature).toBeGreaterThanOrEqual(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
