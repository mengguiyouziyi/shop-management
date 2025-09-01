"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @vitest-environment jsdom
 */
var vitest_1 = require("vitest");
var useAppStore_1 = require("../../store/useAppStore");
var react_1 = require("@testing-library/react");
(0, vitest_1.describe)('完整订单流程集成测试', function () {
    var mockStore = {
        id: 'test-store',
        name: 'Test Store',
        address: 'Test Address'
    };
    (0, vitest_1.beforeEach)(function () {
        // Reset store to initial state
        var result = (0, react_1.renderHook)(function () { return (0, useAppStore_1.useAppStore)(); }).result;
        (0, react_1.act)(function () {
            // 重置所有状态到初始值
            result.current.setCurrentStore(null);
            // 设置mock store
            result.current.setCurrentStore(mockStore);
            // 清空数据
            result.current.products = [];
            result.current.orders = [];
        });
    });
    (0, vitest_1.it)('应完成从创建商品到下单的流程', function () {
        var result = (0, react_1.renderHook)(function () { return (0, useAppStore_1.useAppStore)(); }).result;
        // 1. 创建商品
        (0, react_1.act)(function () {
            result.current.addProduct({
                name: '测试商品',
                category: '测试分类',
                barcode: '123456',
                unit: 'piece',
                price: 100,
                cost: 50,
                stock: 10,
                minStock: 2,
                isActive: true,
            });
        });
        (0, vitest_1.expect)(result.current.products).toHaveLength(1);
        var product = result.current.products[0];
        (0, vitest_1.expect)(product.name).toBe('测试商品');
        (0, vitest_1.expect)(product.stock).toBe(10);
        // 2. 创建订单项目
        var orderItem = {
            id: 'item1',
            productId: product.id,
            quantity: 2,
            unitPrice: product.price,
            totalPrice: product.price * 2,
        };
        // 3. 创建订单
        var mockOrder = {
            items: [orderItem],
            totalAmount: orderItem.totalPrice,
            status: 'completed',
            paymentStatus: 'paid',
        };
        (0, react_1.act)(function () {
            result.current.addOrder(mockOrder);
        });
        (0, vitest_1.expect)(result.current.orders).toHaveLength(1);
        (0, vitest_1.expect)(result.current.orders[0].items).toHaveLength(1);
        (0, vitest_1.expect)(result.current.orders[0].totalAmount).toBe(200);
    });
    (0, vitest_1.it)('应处理商品库存', function () {
        var result = (0, react_1.renderHook)(function () { return (0, useAppStore_1.useAppStore)(); }).result;
        // 清空产品列表确保没有遗留数据
        (0, react_1.act)(function () {
            result.current.products = [];
        });
        // 创建商品，初始库存为10
        (0, react_1.act)(function () {
            result.current.addProduct({
                name: '库存商品',
                category: '测试分类',
                barcode: '654321',
                unit: 'piece',
                price: 50,
                cost: 25,
                stock: 10,
                minStock: 2,
                isActive: true,
            });
        });
        (0, vitest_1.expect)(result.current.products).toHaveLength(1);
        var product = result.current.products[0];
        (0, vitest_1.expect)(product.stock).toBe(10);
        // 模拟销售减少库存
        (0, react_1.act)(function () {
            result.current.updateProduct(product.id, __assign(__assign({}, product), { stock: product.stock - 3 }));
        });
        var updatedProduct = result.current.products[0];
        (0, vitest_1.expect)(updatedProduct.stock).toBe(7);
    });
});
