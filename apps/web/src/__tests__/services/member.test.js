"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var member_1 = require("../../services/member");
(0, vitest_1.describe)('会员服务', function () {
    var testMember = {
        id: 'm001',
        level: 1,
        points: 100,
        balance: 0
    };
    (0, vitest_1.it)('应正确计算积分', function () {
        var result = (0, member_1.calculatePoints)(testMember, 50);
        (0, vitest_1.expect)(result.points).toBe(150);
        (0, vitest_1.expect)(result.level).toBe(1); // 仍低于升级阈值(200)
    });
    (0, vitest_1.it)('应正确升级会员等级', function () {
        var result = (0, member_1.calculatePoints)(testMember, 150);
        (0, vitest_1.expect)(result.points).toBe(250);
        (0, vitest_1.expect)(result.level).toBe(2); // 达到升级阈值(200)
    });
    (0, vitest_1.it)('应保持现有等级当积分不足时', function () {
        var lowPointsMember = {
            id: 'm002',
            level: 1,
            points: 10,
            balance: 0
        };
        var result = (0, member_1.calculatePoints)(lowPointsMember, 50);
        (0, vitest_1.expect)(result.points).toBe(60);
        (0, vitest_1.expect)(result.level).toBe(1); // 仍低于升级阈值(200)
    });
    (0, vitest_1.it)('应正确处理高级会员', function () {
        var highLevelMember = {
            id: 'm003',
            level: 2, // 白银会员
            points: 500,
            balance: 0
        };
        var result = (0, member_1.calculatePoints)(highLevelMember, 100);
        (0, vitest_1.expect)(result.points).toBe(600);
        (0, vitest_1.expect)(result.level).toBe(2); // 保持白银会员等级
    });
});
