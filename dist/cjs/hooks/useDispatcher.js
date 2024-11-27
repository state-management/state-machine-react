"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const simple_state_machine_1 = require("@state-management/simple-state-machine");
/**
 * Custom hook for dispatching commands in the state machine.
 * @returns A function to dispatch commands to the state machine.
 */
function useDispatcher() {
    const dispatch = (0, react_1.useCallback)((command) => {
        simple_state_machine_1.StateMachine.getInstance().dispatch(command);
    }, []);
    return dispatch;
}
exports.default = useDispatcher;
