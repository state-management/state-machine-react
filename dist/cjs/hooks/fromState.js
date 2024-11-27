"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const simple_state_machine_1 = require("@state-management/simple-state-machine");
/**
 * Custom hook to subscribe to a specific state in the state machine.
 * @param key The StateKey to subscribe to.
 * @returns The current value of the state associated with the provided key.
 */
function fromState(key) {
    const [state, setState] = (0, react_1.useState)(() => simple_state_machine_1.StateMachine.getInstance().getLatest(key));
    (0, react_1.useEffect)(() => {
        const subscription = simple_state_machine_1.StateMachine.getInstance().onChange(key, setState);
        return () => subscription.unsubscribe();
    }, [key]);
    return state;
}
exports.default = fromState;
