"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @vitest-environment jsdom
 */
var react_1 = require("@testing-library/react");
var useAuth_1 = require("../../hooks/useAuth");
var vitest_1 = require("vitest");
(0, vitest_1.describe)('useAuth', function () {
    (0, vitest_1.beforeEach)(function () {
        localStorage.clear();
    });
    (0, vitest_1.it)('should return mock user when no user in localStorage', function () {
        var result = (0, react_1.renderHook)(function () { return (0, useAuth_1.useAuth)(); }).result;
        (0, vitest_1.expect)(result.current.user).toEqual({
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
        });
    });
    (0, vitest_1.it)('should return user from localStorage when available', function () {
        var storedUser = {
            id: '2',
            name: 'Stored User',
            email: 'stored@example.com',
        };
        localStorage.setItem('user', JSON.stringify(storedUser));
        var result = (0, react_1.renderHook)(function () { return (0, useAuth_1.useAuth)(); }).result;
        (0, vitest_1.expect)(result.current.user).toEqual(storedUser);
    });
    (0, vitest_1.it)('should handle invalid user data in localStorage', function () {
        localStorage.setItem('user', 'invalid json');
        var result = (0, react_1.renderHook)(function () { return (0, useAuth_1.useAuth)(); }).result;
        (0, vitest_1.expect)(result.current.user).toEqual({
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
        });
    });
    (0, vitest_1.it)('should handle empty user object in localStorage', function () {
        localStorage.setItem('user', JSON.stringify({}));
        var result = (0, react_1.renderHook)(function () { return (0, useAuth_1.useAuth)(); }).result;
        // When localStorage has an empty object, it should still use the mock user
        (0, vitest_1.expect)(result.current.user).toEqual({
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
        });
    });
});
