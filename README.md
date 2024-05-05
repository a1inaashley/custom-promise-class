# Documentation for CustomPromise
___
## Overview
The `CustomPromise` class is a custom implementation of promises in TypeScript, providing functionality similar to native JavaScript promises. It allows chaining asynchronous operations and managing them through resolution or rejection. The custom promise supports standard operations like `then`, `catch`, and `finally`, and includes static methods for immediate resolution, rejection, and delays.
___
## Important Notes and Warnings
`Compatibility Note`: This implementation aims to mimic native JavaScript promises but may not cover all edge cases or behaviors. Ensure thorough testing when replacing native promises with CustomPromise<T> in critical applications.
`Error Handling`: Exceptions thrown in the executor function are automatically caught and will cause the promise to be rejected. Ensure proper error handling is in place to avoid unhandled promise rejections.
`Performance Considerations`: While `CustomPromise<T>` provides key functionalities of standard promises, it might not be optimized for performance at the same level as native implementations in JavaScript engines.
`Concurrency and Timing`: Due to JavaScript's single-threaded nature, promise resolution and rejection are asynchronous actions. Code execution may continue before these actions complete, leading to `potential` timing issues in concurrent scenarios.
`Debugging`: Debugging custom promise implementations can be more challenging than with native promises. Use appropriate logging or debugging tools to trace promise states and values.
___
## Types
+ `ResolveFunction`: Function type for resolving a promise with a value or another promise-like object.
+ `RejectFunction`: Function type for rejecting a promise with a reason.
+ `ExecutorFunction`: Function type that takes a resolve and reject function, used to initialize promise behavior.
+ `OnFulfilledFunction<T, TResult>`: Function type that defines the callback to execute when a promise is fulfilled.
+ `OnRejectedFunction<TResult>`: Function type that defines the callback to execute when a promise is rejected.
___
## Enum: PromiseStatus
+ `Pending`: Initial state, neither fulfilled nor rejected.
+ `Fulfilled`: Indicates that the promise has been resolved successfully.
+ `Rejected`: Indicates that the promise has been rejected with an error or a custom reason.
___
## Class: CustomPromise<T>
### Constructor
```ts
constructor(executor: ExecutorFunction<T>)
```
### Initializes a new instance of CustomPromise<T> with an executor function which immediately executes with two arguments:
+ `resolve`: A function to resolve the promise.
+ `reject`: A function to reject the promise.
___
## Methods
### Private Methods
+ `_resolve(value: T | PromiseLike<T>): void`
Resolves the promise with the given value or another promise. If the promise is already settled, it does nothing.
+ `_reject(reason: any): void`
Rejects the promise with a provided reason. If the promise is already settled, it does nothing.
### Public Methods
+ `then<TResult1 = T, TResult2 = never>(onFulfilled?: OnFulfilledFunction<T, TResult1>, onRejected?: OnRejectedFunction<TResult2>): CustomPromise<TResult1 | TResult2>`
Attaches callbacks for the resolution and/or rejection of the CustomPromise. Returns a new promise resolved with the return value of the callback executed.
+ `catch<TResult = never>(onRejected?: OnRejectedFunction<TResult>): CustomPromise<T | TResult>`
Attaches a rejection handler callback and returns a new promise, providing a way to handle rejection cases specifically.
### Static Methods
+ `resolve<U>(value: U | PromiseLike<U>): CustomPromise<U>`
Returns a promise that is immediately resolved with the given value.
+ `reject<U>(reason?: any): CustomPromise<U>`
Returns a promise that is immediately rejected with the provided reason.
+ `delay(ms: number): CustomPromise<void>`
Creates a promise that resolves after a specified number of milliseconds, simulating a delay.
___
## Usage Examples
### Creating a New Promise
```ts
const myPromise = new CustomPromise<number>((resolve, reject) => {
  setTimeout(() => resolve(42), 1000);
});
```
> [!WARNING]
> Be careful with asynchronous operations inside the executor. Always handle potential errors and consider scenarios where operations might fail or take longer than expected.
### Handling Promises
`Note` Always include a `catch` clause or handle rejections in `then` to prevent potential uncaught promise rejections.
```ts
myPromise.then(value => console.log(value)).catch(error => console.error(error));
```
> [!IMPORTANT]
Always handle both fulfillment and rejection to ensure that errors do not go unnoticed.
### Chaining Promises
`Tip`: Chain multiple then calls to transform values or perform additional asynchronous operations sequentially.
```ts
myPromise.then(value => value * 2).then(result => console.log(result));
```
+ The order of chained operations is guaranteed, but each operation's timing can vary depending on how each promise resolves.
### Static Utilities
```ts
CustomPromise.resolve(10).then(console.log); // Prints 10
CustomPromise.reject('Error').catch(console.error); // Prints 'Error'
CustomPromise.delay(500).then(() => console.log('Delayed by 500 ms'));
```
> [!CAUTION]
> Overuse of `CustomPromise.delay` in loops or tight cycles can overwhelm JavaScript's event loop, leading to sluggish performance.