export const setupMockStateMachine = ({ defaultValue = 0, dispatchImplementation = jest.fn() }) => {
    const mockStateMachine = {
        onChange: jest.fn(() => ({ unsubscribe: jest.fn() })),
        getLatest: jest.fn((key) => defaultValue),
        dispatch: dispatchImplementation
    };
    jest.mock('simple-state-machine', () => {
        const actual = jest.requireActual('simple-state-machine');
        return Object.assign(Object.assign({}, actual), { StateMachine: {
                getInstance: jest.fn(() => {
                    console.log("********* mock get instance called******* ");
                    return mockStateMachine;
                }),
            } });
    });
    return mockStateMachine;
};
