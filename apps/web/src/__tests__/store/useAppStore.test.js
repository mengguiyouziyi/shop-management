"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @vitest-environment jsdom
 */
var react_1 = require("@testing-library/react");
var useAppStore_1 = require("../../store/useAppStore");
var vitest_1 = require("vitest");
(0, vitest_1.describe)('useAppStore', function () {
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
            result.current.members = [];
            result.current.orders = [];
        });
    });
    (0, vitest_1.it)('should initialize with empty arrays and null values', function () {
        var result = (0, react_1.renderHook)(function () { return (0, useAppStore_1.useAppStore)(); }).result;
        (0, vitest_1.expect)(result.current.products).toEqual([]);
        (0, vitest_1.expect)(result.current.members).toEqual([]);
        (0, vitest_1.expect)(result.current.orders).toEqual([]);
    });
    (0, vitest_1.it)('should add a product', function () {
        var result = (0, react_1.renderHook)(function () { return (0, useAppStore_1.useAppStore)(); }).result;
        var newProduct = {
            name: 'Test Product',
            category: 'Test Category',
            barcode: '123456789',
            unit: 'piece',
            price: 100,
            cost: 50,
            stock: 10,
            minStock: 2,
            isActive: true,
        };
        (0, react_1.act)(function () {
            result.current.addProduct(newProduct);
        });
        (0, vitest_1.expect)(result.current.products).toHaveLength(1);
        var product = result.current.products[0];
        (0, vitest_1.expect)(product.name).toBe('Test Product');
        (0, vitest_1.expect)(product.id).toBeDefined();
        (0, vitest_1.expect)(product.storeId).toBe(mockStore.id);
    });
    (0, vitest_1.it)('should update a product', function () {
        var result = (0, react_1.renderHook)(function () { return (0, useAppStore_1.useAppStore)(); }).result;
        // First add a product
        (0, react_1.act)(function () {
            result.current.addProduct({
                name: 'Test Product',
                category: 'Test Category',
                barcode: '123456789',
                unit: 'piece',
                price: 100,
                cost: 50,
                stock: 10,
                minStock: 2,
                isActive: true,
            });
        });
        var productId = result.current.products[0].id;
        var updatedProduct = {
            name: 'Updated Product',
            price: 150,
        };
        (0, react_1.act)(function () {
            result.current.updateProduct(productId, updatedProduct);
        });
        (0, vitest_1.expect)(result.current.products[0].name).toBe('Updated Product');
        (0, vitest_1.expect)(result.current.products[0].price).toBe(150);
    });
    (0, vitest_1.it)('should delete a product', function () {
        var result = (0, react_1.renderHook)(function () { return (0, useAppStore_1.useAppStore)(); }).result;
        // Clear products first to ensure clean state
        (0, react_1.act)(function () {
            result.current.products = [];
        });
        // Add a product
        (0, react_1.act)(function () {
            result.current.addProduct({
                name: 'Test Product',
                category: 'Test Category',
                barcode: '123456789',
                unit: 'piece',
                price: 100,
                cost: 50,
                stock: 10,
                minStock: 2,
                isActive: true,
            });
        });
        (0, vitest_1.expect)(result.current.products).toHaveLength(1);
        var productId = result.current.products[0].id;
        (0, react_1.act)(function () {
            result.current.deleteProduct(productId);
        });
        (0, vitest_1.expect)(result.current.products).toHaveLength(0);
    });
    (0, vitest_1.it)('should add a member', function () {
        var result = (0, react_1.renderHook)(function () { return (0, useAppStore_1.useAppStore)(); }).result;
        var newMember = {
            name: 'Test Member',
            phone: '13800138000',
            email: 'member@test.com',
            points: 0,
            level: 'normal',
            totalSpent: 0,
        };
        (0, react_1.act)(function () {
            result.current.addMember(newMember);
        });
        (0, vitest_1.expect)(result.current.members).toHaveLength(1);
        var member = result.current.members[0];
        (0, vitest_1.expect)(member.name).toBe('Test Member');
        (0, vitest_1.expect)(member.id).toBeDefined();
        (0, vitest_1.expect)(member.storeId).toBe(mockStore.id);
    });
    (0, vitest_1.it)('should add an order', function () {
        var result = (0, react_1.renderHook)(function () { return (0, useAppStore_1.useAppStore)(); }).result;
        var newOrder = {
            items: [],
            totalAmount: 100,
            status: 'completed',
            paymentStatus: 'paid',
        };
        (0, react_1.act)(function () {
            result.current.addOrder(newOrder);
        });
        (0, vitest_1.expect)(result.current.orders).toHaveLength(1);
        var order = result.current.orders[0];
        (0, vitest_1.expect)(order.id).toBeDefined();
        (0, vitest_1.expect)(order.storeId).toBe(mockStore.id);
        (0, vitest_1.expect)(order.createdAt).toBeDefined();
        (0, vitest_1.expect)(order.totalAmount).toBe(100);
    });
});
