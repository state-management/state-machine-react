import { useCallback } from 'react';
import { StateMachine } from '@state-management/simple-state-machine';
/**
 * Custom hook for dispatching commands in the state machine.
 * @returns A function to dispatch commands to the state machine.
 */
function useDispatcher() {
    const dispatch = useCallback((command) => {
        StateMachine.getInstance().dispatch(command);
    }, []);
    return dispatch;
}
export default useDispatcher;
