import { useEffect, useState } from 'react';
import { StateMachine } from '@state-management/simple-state-machine';
/**
 * Custom hook to subscribe to a specific state in the state machine.
 * @param key The StateKey to subscribe to.
 * @returns The current value of the state associated with the provided key.
 */
function fromState(key) {
    const [state, setState] = useState(() => StateMachine.getInstance().getLatest(key));
    useEffect(() => {
        const subscription = StateMachine.getInstance().onChange(key, setState);
        return () => subscription.unsubscribe();
    }, [key]);
    return state;
}
export default fromState;
