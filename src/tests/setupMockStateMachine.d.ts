/// <reference types="jest" />
type MockStateMachineConfig = {
    defaultValue?: any;
    dispatchImplementation?: jest.Mock;
};
export declare const setupMockStateMachine: ({ defaultValue, dispatchImplementation }: MockStateMachineConfig) => {
    onChange: jest.Mock<{
        unsubscribe: jest.Mock<any, any>;
    }, []>;
    getLatest: jest.Mock<any, []>;
    dispatch: jest.Mock<any, any>;
};
export {};
