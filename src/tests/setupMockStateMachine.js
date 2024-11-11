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
exports.setupMockStateMachine = void 0;
var setupMockStateMachine = function (_a) {
    var _b = _a.defaultValue, defaultValue = _b === void 0 ? 0 : _b, _c = _a.dispatchImplementation, dispatchImplementation = _c === void 0 ? jest.fn() : _c;
    var mockStateMachine = {
        onChange: jest.fn(function () { return ({ unsubscribe: jest.fn() }); }),
        getLatest: jest.fn(function () { return defaultValue; }),
        dispatch: dispatchImplementation
    };
    jest.mock('simple-state-machine', function () {
        var actual = jest.requireActual('simple-state-machine');
        return __assign(__assign({}, actual), { StateMachine: {
                getInstance: jest.fn(function () { return mockStateMachine; }),
            } });
    });
    return mockStateMachine;
};
exports.setupMockStateMachine = setupMockStateMachine;
