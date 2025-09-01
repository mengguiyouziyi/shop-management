"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var member_1 = require("../../services/member");
(0, vitest_1.describe)('会员积分流程集成测试', function () {
    (0, vitest_1.it)('应正确处理会员购物积分累积流程', function () {
        // 初始会员信息 (青铜会员)
        var member = {
            id: 'm001',
            level: 1,
            points: 150,
            balance: 0
        };
        // 模拟会员购买商品获得积分
        var pointsFromPurchase = 100; // 假设购买商品获得100积分
        // 计算积分后状态
        var updatedMember = (0, member_1.calculatePoints)(member, pointsFromPurchase);
        (0, vitest_1.expect)(updatedMember.points).toBe(250); // 150 + 100
        (0, vitest_1.expect)(updatedMember.level).toBe(2); // 升级到白银会员 (200积分阈值)
    });
    (0, vitest_1.it)('应正确处理会员等级权益', function () {
        // 高级会员 (白银会员)
        var vipMember = {
            id: 'm002',
            level: 2,
            points: 500,
            balance: 1000 // 有储值余额
        };
        // 模拟消费
        var purchasePoints = 200;
        var updatedVipMember = (0, member_1.calculatePoints)(vipMember, purchasePoints);
        (0, vitest_1.expect)(updatedVipMember.points).toBe(700); // 500 + 200
        (0, vitest_1.expect)(updatedVipMember.level).toBe(2); // 保持白银会员
        // 在实际应用中，白银会员可能享有额外积分或其他权益
    });
    (0, vitest_1.it)('应处理积分使用场景', function () {
        // 有足够积分的会员 (白银会员)
        var member = {
            id: 'm003',
            level: 2, // 白银会员
            points: 300,
            balance: 0
        };
        // 模拟使用积分兑换礼品，减少积分
        var pointsUsed = -150;
        var updatedMember = (0, member_1.calculatePoints)(member, pointsUsed);
        (0, vitest_1.expect)(updatedMember.points).toBe(150); // 300 - 150
        (0, vitest_1.expect)(updatedMember.level).toBe(1); // 降级到青铜会员 (低于200积分阈值)
    });
});
