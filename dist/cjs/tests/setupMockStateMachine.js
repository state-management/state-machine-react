"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupMockStateMachine = void 0;
const setupMockStateMachine = ({ defaultValue = 0, dispatchImplementation = jest.fn() }) => {
    const mockStateMachine = {
        onChange: jest.fn(() => ({ unsubscribe: jest.fn() })),
        getLatest: jest.fn((key) => defaultValue),
        dispatch: dispatchImplementation
    };
    jest.mock('simple-state-machine', () => {
        const actual = jest.requireActual('simple-state-machine');
        return Object.assign(Object.assign({}, actual), { StateMachine: {
                getInstance: jest.fn(() => {
                    return mockStateMachine;
                }),
            } });
    });
    return mockStateMachine;
};
exports.setupMockStateMachine = setupMockStateMachine;
