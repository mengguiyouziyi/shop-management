"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("@testing-library/react");
var NumPad_1 = __importDefault(require("../../components/POS/NumPad"));
var vitest_1 = require("vitest");
(0, vitest_1.describe)('Numpad', function () {
    (0, vitest_1.it)('should render all keys', function () {
        var mockFn = vitest_1.vi.fn();
        (0, react_1.render)((0, jsx_runtime_1.jsx)(NumPad_1.default, { onPress: mockFn }));
        (0, vitest_1.expect)(react_1.screen.getByText('7')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('8')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('9')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('4')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('5')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('6')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('1')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('2')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('3')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('0')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('.')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('清除')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should trigger onPress', function () {
        var mockFn = vitest_1.vi.fn();
        (0, react_1.render)((0, jsx_runtime_1.jsx)("div", { "data-testid": "numpad-container", children: (0, jsx_runtime_1.jsx)(NumPad_1.default, { onPress: mockFn }) }));
        var container = react_1.screen.getByTestId('numpad-container');
        var buttons = container.querySelectorAll('button');
        // 找到包含'5'的按钮
        var button5 = Array.from(buttons).find(function (button) { return button.textContent === '5'; });
        if (button5) {
            react_1.fireEvent.click(button5);
            (0, vitest_1.expect)(mockFn).toHaveBeenCalledWith('5');
        }
        else {
            throw new Error('Button with text "5" not found');
        }
    });
});
