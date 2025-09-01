"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var finance_1 = require("../../services/finance");
(0, vitest_1.describe)('财务服务', function () {
    (0, vitest_1.it)('应正确计算日报表', function () {
        var transactions = [
            { amount: 100, type: 'income' },
            { amount: 50, type: 'income' },
            { amount: 30, type: 'expense' },
            { amount: 20, type: 'expense' }
        ];
        var report = (0, finance_1.calculateDailyReport)(transactions);
        (0, vitest_1.expect)(report.totalIncome).toBe(150);
        (0, vitest_1.expect)(report.totalExpense).toBe(50);
        (0, vitest_1.expect)(report.balance).toBe(100);
    });
    (0, vitest_1.it)('应正确处理只有收入的情况', function () {
        var transactions = [
            { amount: 100, type: 'income' },
            { amount: 50, type: 'income' }
        ];
        var report = (0, finance_1.calculateDailyReport)(transactions);
        (0, vitest_1.expect)(report.totalIncome).toBe(150);
        (0, vitest_1.expect)(report.totalExpense).toBe(0);
        (0, vitest_1.expect)(report.balance).toBe(150);
    });
    (0, vitest_1.it)('应正确处理只有支出的情况', function () {
        var transactions = [
            { amount: 30, type: 'expense' },
            { amount: 20, type: 'expense' }
        ];
        var report = (0, finance_1.calculateDailyReport)(transactions);
        (0, vitest_1.expect)(report.totalIncome).toBe(0);
        (0, vitest_1.expect)(report.totalExpense).toBe(50);
        (0, vitest_1.expect)(report.balance).toBe(-50);
    });
    (0, vitest_1.it)('应正确处理空交易列表', function () {
        var transactions = [];
        var report = (0, finance_1.calculateDailyReport)(transactions);
        (0, vitest_1.expect)(report.totalIncome).toBe(0);
        (0, vitest_1.expect)(report.totalExpense).toBe(0);
        (0, vitest_1.expect)(report.balance).toBe(0);
    });
});
