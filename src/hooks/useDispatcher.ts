import { useCallback } from 'react';
import { Command, StateMachine } from '@state-management/simple-state-machine';

/**
 * Custom hook for dispatching commands in the state machine.
 * @returns A function to dispatch commands to the state machine.
 */
function useDispatcher<T>() {
    const dispatch = useCallback((command: Command<T>) => {
        StateMachine.getInstance().dispatch(command);
    }, []);

    return dispatch;
}

export default useDispatcher;
