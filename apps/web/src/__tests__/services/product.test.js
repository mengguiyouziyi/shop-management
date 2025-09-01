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
var vitest_1 = require("vitest");
var product_1 = require("../../services/product");
(0, vitest_1.describe)('商品服务', function () {
    var testProduct = {
        id: 'p001',
        name: '测试商品',
        price: 100,
        stock: 10
    };
    (0, vitest_1.beforeEach)(function () {
        // Clear products
        Object.keys(product_1.products).forEach(function (key) {
            delete product_1.products[key];
        });
        product_1.products[testProduct.id] = __assign({}, testProduct);
    });
    (0, vitest_1.it)('应正确存储商品', function () {
        (0, vitest_1.expect)(product_1.products[testProduct.id]).toEqual(testProduct);
    });
    (0, vitest_1.it)('应能通过ID访问商品', function () {
        var product = product_1.products[testProduct.id];
        (0, vitest_1.expect)(product).toBeDefined();
        (0, vitest_1.expect)(product === null || product === void 0 ? void 0 : product.id).toBe(testProduct.id);
    });
});
