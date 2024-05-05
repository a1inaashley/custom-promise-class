# Documentation for CustomPromise
___
## Overview
The `CustomPromise` class is a custom implementation of promises in TypeScript, providing functionality similar to native JavaScript promises. It allows chaining asynchronous operations and managing them through resolution or rejection. The custom promise supports standard operations like `then`, `catch`, and `finally`, and includes static methods for immediate resolution, rejection, and delays.
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
 Methods
    ## Private Methods
+ `_resolve(value: T | PromiseLike<T>): void`
Resolves the promise with the given value or another promise. If the promise is already settled, it does nothing.
+ `_reject(reason: any): void`
Rejects the promise with a provided reason. If the promise is already settled, it does nothing.
## Public Methods
+ `then<TResult1 = T, TResult2 = never>(onFulfilled?: OnFulfilledFunction<T, TResult1>, onRejected?: OnRejectedFunction<TResult2>): CustomPromise<TResult1 | TResult2>`
Attaches callbacks for the resolution and/or rejection of the CustomPromise. Returns a new promise resolved with the return value of the callback executed.
+ `catch<TResult = never>(onRejected?: OnRejectedFunction<TResult>): CustomPromise<T | TResult>`
Attaches a rejection handler callback and returns a new promise, providing a way to handle rejection cases specifically.
## Static Methods
+ `resolve<U>(value: U | PromiseLike<U>): CustomPromise<U>`
Returns a promise that is immediately resolved with the given value.
+ `reject<U>(reason?: any): CustomPromise<U>`
Returns a promise that is immediately rejected with the provided reason.
+ `delay(ms: number): CustomPromise<void>`
Creates a promise that resolves after a specified number of milliseconds, simulating a delay.