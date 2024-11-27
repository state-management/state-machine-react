import { StateMachine } from '@state-management/simple-state-machine';

type MockStateMachineConfig = {
    defaultValue?: any;
    dispatchImplementation?: jest.Mock;
};

export const setupMockStateMachine = ({
                                          defaultValue = 0,
                                          dispatchImplementation = jest.fn()
                                      }: MockStateMachineConfig) => {
    const mockStateMachine = {
        onChange: jest.fn(() => ({ unsubscribe: jest.fn() })),
        getLatest: jest.fn((key) => defaultValue),
        dispatch: dispatchImplementation
    };

    jest.mock('@state-management/simple-state-machine', () => {
        const actual = jest.requireActual('@state-management/simple-state-machine');
        return {
            ...actual,
            StateMachine: {
                getInstance: jest.fn(() => {
                    return mockStateMachine;
                }),
            },
        };
    });

    return mockStateMachine;
};
