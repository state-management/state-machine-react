export const setupMockStateMachine = ({ defaultValue = 0, dispatchImplementation = jest.fn() }) => {
    const mockStateMachine = {
        onChange: jest.fn(() => ({ unsubscribe: jest.fn() })),
        getLatest: jest.fn((key) => defaultValue),
        dispatch: dispatchImplementation
    };
    jest.mock('@state-management/simple-state-machine', () => {
        const actual = jest.requireActual('@state-management/simple-state-machine');
        return Object.assign(Object.assign({}, actual), { StateMachine: {
                getInstance: jest.fn(() => {
                    return mockStateMachine;
                }),
            } });
    });
    return mockStateMachine;
};
