import { Command } from '@state-management/simple-state-machine';
/**
 * Custom hook for dispatching commands in the state machine.
 * @returns A function to dispatch commands to the state machine.
 */
declare function useDispatcher<T>(): (command: Command<T>) => void;
export default useDispatcher;
