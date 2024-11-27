# state-machine-react

[![npm version](https://badge.fury.io/js/@state-management%2Fstate-machine-react.svg?cacheSeconds=0)](https://www.npmjs.com/package/@state-management/state-machine-react)
[![Build Status](https://github.com/state-management/state-machine-react/actions/workflows/build.yml/badge.svg)](https://github.com/state-management/state-machine-react/actions)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**state-machine-react** is a React-specific wrapper for the core library, [simple-state-machine](https://github.com/state-management/simple-state-machine). 
It provides React hooks for integrating the `simple-state-machine` into React applications. And a utility for simplifying unit testing of components using the state machine.
You can find the complete documentation of the core library, here:
[Simple State Machine Documentation](https://github.com/state-management/simple-state-machine?tab=readme-ov-file#simple-state-machine)

## About This Project

Managing state in React applications can often be complex and cumbersome, especially when dealing with global or shared state. 
**state-machine-react** simplifies this by combining the power of a state machine with React's modern hooks API. This library:
- Provides the `fromState` hook to observe and react to state changes.
- Offers the `useDispatcher` hook to dispatch state-changing commands which encapsulate business logic .
- Includes `setupMockStateMachine` to make unit testing with the state machine easier.

This project is part of the **state-management** suite, which includes:
- [simple-state-machine](https://github.com/state-management/simple-state-machine): The core state management library.
- [state-machine-react](https://github.com/state-management/state-machine-react): The React wrapper for `simple-state-machine`.
- [ngx-state-machine](https://github.com/state-management/ngx-state-machine): The Angular wrapper for `simple-state-machine`.

By decoupling state management logic from UI components, **state-machine-react** promotes cleaner, more maintainable, and testable React code.
Since the state can be modified from within a Command only, this will result in business logic moving out of UI components into command classes.

### Implementations Example
- [Sample React project](https://github.com/state-management/react-example) that you can clone. It is a fully working example with unit tests, showcasing the use of `state-machine-react` wrapper.

---

## Features
###### *State management code, that is lot less scary, easy to read, easy to trace, and very easy to change and unit test.*

### **Traceability**:
This **single most important feature** that we wanted to design correctly is traceability of code.
When trying to identify an issue, we should be able to go through the code, and identify the block causing the issue, without having to open ten different files.
We should be able to use the  IDE's "find references" or even the simple Find(Ctrl + F) feature to quickly identify what `StateKeys` are changed by which `Commands`.

This is invaluable while identifying issues in code.  This also reduces the dependency on debugging tools and time spent in debugging.

***Most importantly*** the state management code looks a lot less scary, it is easy to read, and it is very easy to change and unit test.

### Important Technical Features:
- **React Hooks**:
    - `fromState`: Subscribe to and observe changes in the global state.
    - `useDispatcher`: Dispatch commands to modify global state.  Commands contain the business logic.  And modify state as part of execution of business logic.

- **Unit Testing Utilities**:
    - `setupMockStateMachine`: Simplify mocking the state machine during component tests.

- **Integration with simple-state-machine**:
    - Leverage the powerful state management capabilities of `simple-state-machine` and its Command class which encapsulates the business logic, keeping the UI code clean.


## Installation

To install this package, run:
```bash
npm install @state-management/state-machine-react
```
OR
```bash
yarn add @state-management/state-machine-react
```

## Usage

### StateKeys.constants.ts
Create a constants file to store all state keys, for easy tracing of state changes in application
```bash
import { StateKey } from '@state-management/simple-state-machine';

# NOTE: the generics in the StateKey defines the data type of the value stored against this key.
export const CounterKey = new StateKey<number>('Counter');
```


### `useDispatcher`
The `useDispatcher` hook provides a simple way to dispatch commands to the state machine. The commands contain the business logic.  This allows you to `separate business logic` from UI code.  The commands update the state as part of their execution.
###### Note: Only Commands can update the global state.

#### Create a command to dispatch
```typescript
import React from 'react';
import { Command } from '@state-management/simple-state-machine';
import { CounterKey } from 'constants/StateKeysConstants';

// NOTE: The generics "<number>" below, defines the data type of the parameter passed to the "execute" method.
class IncrementCounterCommand extends Command<number> {
    execute(incrementBy: number): void {
        const current = this.getLatest(CounterKey) || 0;
        
        // NOTE: only commands can call putState and update the state.
        this.putState(current + incrementBy);
    }
}
```


#### Dispatch the command
The application code dispatches commands to execute the business logic and update state.
```typescript
import React from 'react';
import { IncrementCounterCommand } from 'IncrementCounterCommand';
import useDispatcher from '@state-management/state-machine-react';

export const CounterControls: React.FC = () => {
    const dispatch = useDispatcher();

    const handleIncrement = () => {
        // NOTE:  the constructor argument of IncrememntCounterCommand is type checked using generics in Command class.
        // This constructor argument will be passed to the "execute" method of the command.
        dispatch(new IncrementCounterCommand(1));
    };

    return <button onClick={handleIncrement}>Increment</button>;
};
```

#### `UpdateStateCommand` for Quick, one-off state change, without creating a new Command
```typescript
import React from 'react';
import { UpdateStateCommand, useDispatcher }  from '@state-management/state-machine-react';
import { CounterKey } from 'constants/StateKeysConstants';

export const CounterControls: React.FC = () => {
    const dispatch = useDispatcher();

    const handleIncrement = () => {
        // NOTE:  the generics used in StateKey provides type safety check for the value.
        dispatch(new UpdateStateCommand({stateKey: CounterKey, value: 42}));
    };

    return <button onClick={handleIncrement}>Increment</button>;
};
```

###### Note: For easy tracing and debugging, do not re-use the command class to make state changes from different parts of the application.
In this example the initial value of the "CounterKey" in this example can be set from, say
- Application load
- Click of a reset button.

It is recommended that, for both scenarios, use a different command object, which can call
the same "service" class containing the logic to set the initial value.

---

### `fromState`
The `fromState` hook allows you to subscribe to a specific key in the state machine and update the component when the state changes.

#### Example
```typescript
import React from 'react';
import fromState from '@state-management/state-machine-react';
import { CounterKey } from 'constants/StateKeysConstants';

export const CounterDisplay: React.FC = () => {
    // NOTE:  the generics used in StateKey defines the data type of counter as "number"
    const counter = fromState(CounterKey);

    return <h1>Counter: {counter}</h1>;
};
```

## Unit Testing

state-machine-react includes a utility, `setupMockStateMachine`, to simplify testing React components that use the state machine.  It  allows you to specify default values and mock implementations for testing purposes.
#### Example
```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { setupMockStateMachine } from '@state-management/state-machine-react/testing';
import { CounterDisplay } from './CounterDisplay';

describe('CounterDisplay', () => {
    let mockStateMachine: any;

    beforeEach(() => {
        mockStateMachine = setupMockStateMachine({
            defaultValue: 42,
        });
    });

    it('renders the counter with the default value', () => {
        render(<CounterDisplay />);
        expect(screen.getByText(/Counter: 42/i)).toBeInTheDocument();
    });

    it('subscribes to state changes', () => {
        expect(mockStateMachine.onChange).toHaveBeenCalled();
    });
});
```

## API Documentation

The **state-machine-react** is a React-specific wrapper for the core library, **simple-state-machine**.
You can find the API documentation of the core library, here:
[Simple State Machine Documentation](https://github.com/state-management/simple-state-machine?tab=readme-ov-file#api-documentation)


### `fromState<T>(key: StateKey<T>): T | undefined`
The `fromState` hook subscribes to the state associated with the provided `StateKey` and returns the current value. The hook automatically updates the value when the state changes.

| Parameter | Type           | Description                                  |
|-----------|----------------|----------------------------------------------|
| `key`     | `StateKey<T>`  | The key for the state to subscribe to.       |

| Returns | Type            | Description                                   |
|---------|-----------------|-----------------------------------------------|
| T       | T or undeifined | The current value for the key or `undefined`. |

**Example**:
```typescript
import { StateKey } from '@state-management/simple-state-machine';
import fromState from '@state-management/state-machine-react';

const CounterKey = new StateKey<number>('counter');

const counter = fromState(CounterKey);
console.log(counter); // Logs the current value of 'counter' state
```

### `useDispatcher<T>(): (command: Command<T>) => void`

The `useDispatcher` hook returns a function to dispatch commands to the state machine. Commands encapsulate logic and allow you to separate the business logic from UI code.

| Returns        | Type                            | Description                        |
|----------------|---------------------------------|------------------------------------|
| `dispatch`     | `(command: Command<T>) => void` | Dispatches the given command.      |

#### Example
```typescript
import React from 'react';
import useDispatcher from '@state-management/state-machine-react';

const ResetCounterButton: React.FC = () => {
    const dispatch = useDispatcher();

    const handleReset = () => {
        dispatch(new IncrementCounterCommand(1));
    };

    return <button onClick={handleReset}>Reset Counter</button>;
};
```

### `setupMockStateMachine`

The `setupMockStateMachine` utility simplifies unit testing by providing a mocked implementation of the state machine. This allows you to simulate state changes and command dispatching in tests.

| Parameter                | Type                     | Default     | Description                                 |
|--------------------------|--------------------------|-------------|---------------------------------------------|
| `defaultValue`           | `any`                   | `0`         | The default value returned by `getLatest`.  |
| `dispatchImplementation` | `jest.Mock`          | `jest.fn()` | Custom mock implementation for `dispatch`.  |

| Returns              | Type             | Description                          |
|----------------------|------------------|--------------------------------------|
| `mockStateMachine`   | `any`           | The mocked state machine instance.   |

#### Example
```typescript
import { setupMockStateMachine } from '@state-management/state-machine-react/testing';

// Set up a mocked state machine
const mockStateMachine = setupMockStateMachine({
    defaultValue: 42,
    dispatchImplementation: jest.fn((command) => console.log('Dispatched:', command)),
});

// Mock getLatest method to return specific values
mockStateMachine.getLatest.mockImplementation((key) => {
    if (key.name === 'counter') return 42;
    return undefined;
});

// Mock onChange method to simulate subscription
mockStateMachine.onChange.mockImplementation((key, callback) => {
    callback(42); 
    return { unsubscribe: jest.fn() }; 
});

// Use mockStateMachine in your tests
expect(mockStateMachine.getLatest).toHaveBeenCalled();
expect(mockStateMachine.dispatch).toHaveBeenCalledWith(expect.any(Object));
```

## Contributing

We welcome contributions! Please open an issue or submit a pull request if you’d like to improve the library.

### How to Contribute
#### 1. Fork the Repository:
Visit the [state-machine-react GitHub repository](https://github.com/state-management/state-machine-react).
Click the "Fork" button to create a copy of the repository under your GitHub account.

#### 2. Clone the Fork:
```bash
git clone https://github.com/state-management/state-machine-react.git
cd state-machine-react
```

#### 3. Create a Feature Branch:
```bash
git checkout -b feature/add-react-wrapper-feature
```   

#### 4. Make Your Changes:
Add or update code, write tests, and ensure the changes are well-documented. 
Run Tests Locally, Ensure all existing and new tests pass e:
```bash
npm install
npm test
```

#### 5. Commit and Push Your Changes:
Write a clear and concise commit message:
```bash
git add .
git commit -m "Add new wrapper feature to state-machine-react"
git push origin feature/add-react-wrapper-feature
```

#### 6. Create a Pull Request:
Go to your fork on GitHub and click the “New Pull Request” button. 
Provide a description of your changes and any additional context.
