"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("@testing-library/react");
var vitest_1 = require("vitest");
var PosPage_1 = __importDefault(require("../../components/POS/PosPage"));
(0, vitest_1.describe)('PosPage', function () {
    (0, vitest_1.it)('should update amount when keys are pressed', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(PosPage_1.default, {}));
        // 点击数字键
        var button1 = react_1.screen.getAllByText('1')[0];
        var button2 = react_1.screen.getAllByText('2')[0];
        var button3 = react_1.screen.getAllByText('3')[0];
        react_1.fireEvent.click(button1);
        react_1.fireEvent.click(button2);
        react_1.fireEvent.click(button3);
        // 检查金额显示
        (0, vitest_1.expect)(react_1.screen.getByText('¥ 123.00')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should clear amount when clear button is pressed', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(PosPage_1.default, {}));
        // 输入一些数字
        var button1 = react_1.screen.getAllByText('1')[0];
        var button2 = react_1.screen.getAllByText('2')[0];
        react_1.fireEvent.click(button1);
        react_1.fireEvent.click(button2);
        // 点击清除按钮
        var clearButtons = react_1.screen.getAllByText('清除');
        react_1.fireEvent.click(clearButtons[0]);
        // 检查金额是否被清除
        var amountDisplays = react_1.screen.getAllByText('¥ 0.00');
        (0, vitest_1.expect)(amountDisplays[0]).toBeInTheDocument();
    });
});
