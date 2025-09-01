"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("vitest/config");
var plugin_react_1 = __importDefault(require("@vitejs/plugin-react"));
exports.default = (0, config_1.defineConfig)({
    plugins: [(0, plugin_react_1.default)()],
    test: {
        environment: 'jsdom',
        globals: true,
        include: ['src/**/*.test.{ts,tsx}'],
        setupFiles: './src/__tests__/setup.ts',
        clearMocks: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['src/services/**/*.ts']
        }
    }
});
