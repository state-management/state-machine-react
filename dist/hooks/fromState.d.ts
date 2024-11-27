import { StateKey } from '@state-management/simple-state-machine';
/**
 * Custom hook to subscribe to a specific state in the state machine.
 * @param key The StateKey to subscribe to.
 * @returns The current value of the state associated with the provided key.
 */
declare function fromState<T>(key: StateKey<T>): T | undefined;
export default fromState;
