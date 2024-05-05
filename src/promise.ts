//------------------------------------------------------------//

type ResolveFunction<T> = (value?: T | PromiseLike<T>) => void;
type RejectFunction = (reason?: any) => void;
type ExecutorFunction<T> = (resolve: ResolveFunction<T>, reject: RejectFunction) => void;
type OnFulfilledFunction<T, TResult> = (value: T) => TResult | PromiseLike<TResult>;
type OnRejectedFunction<TResult> = (reason: any) => TResult | PromiseLike<TResult>;

//------------------------------------------------------------//

export enum PromiseStatus {
    Pending = 'PENDING',
    Fulfilled = 'FULFILLED',
    Rejected = 'REJECTED',
}

//------------------------------------------------------------//

/**
 * Implements a simple custom promise mechanism similar to native ES6 Promises.
 * This class handles asynchronous operations by allowing them to be chained and managed through `then`, `catch`, and `resolve/reject` methods.
 */
export class CustomPromise<T> {
    private _status: PromiseStatus = PromiseStatus.Pending;
    private _result: T | PromiseLike<T> | null = null;  // Stores the result of the fulfilled promise or a promise-like object.
    private _reason: any = null;  // Stores the reason for the promise's rejection.
    private _onFulfilledCallbacks: Function[] = [];  // Queue of callbacks to execute on promise fulfillment.
    private _onRejectedCallbacks: Function[] = [];  // Queue of callbacks to execute on promise rejection.

    /**
     * The constructor of the CustomPromise class takes an executor function which it immediately executes.
     * @param executor A function that is passed two arguments: 
     *                 1. `resolve` - a function that, when called, changes the promise's status from "Pending" to "Fulfilled" and stores the fulfillment value.
     *                 2. `reject` - a function that, when called, changes the promise's status from "Pending" to "Rejected" and stores the rejection reason.
     * The executor function allows for the asynchronous operation and subsequent resolution or rejection.
     */
    constructor(executor: ExecutorFunction<T>) {
        try {
            executor(this._resolve.bind(this), this._reject.bind(this));
        } catch (error) {
            this._reject(error);
        }
    }

    /**
     * Internal method to resolve the promise with a value or another promise.
     * @param value The value or promise-like object with which to resolve the promise.
     */
    private _resolve(value: T | PromiseLike<T>): void {
        if (this._status !== PromiseStatus.Pending) return;

        if (value instanceof CustomPromise) {
            value.then(this._resolve.bind(this), this._reject.bind(this));
            return;
        }

        this._status = PromiseStatus.Fulfilled;
        this._result = value;
        this._onFulfilledCallbacks.forEach(callback => callback(value));
    }

    /**
     * Internal method to reject the promise with a reason.
     * @param reason The reason for the promise's rejection, typically an Error object or a descriptive string.
     */
    private _reject(reason: any): void {
        if (this._status !== PromiseStatus.Pending) return;

        this._status = PromiseStatus.Rejected;
        this._reason = reason;
        this._onRejectedCallbacks.forEach(callback => callback(reason));
    }

    /**
     * Adds fulfillment and rejection handlers to the promise, and returns a new promise resolving to the return value of the called handler.
     * @param onFulfilled Function to execute if the promise is fulfilled.
     * @param onRejected Function to execute if the promise is rejected.
     * @returns A new CustomPromise that will ultimately resolve with the return value of either `onFulfilled` or `onRejected`.
     */
    public then<TResult1 = T, TResult2 = never>(
        onFulfilled?: OnFulfilledFunction<T, TResult1> | null,
        onRejected?: OnRejectedFunction<TResult2> | null
    ): CustomPromise<TResult1 | TResult2> {
        return new CustomPromise<TResult1 | TResult2>((resolve, reject) => {
            const handleFulfilled = (value: T) => {
                try {
                    if (onFulfilled) {
                        resolve(onFulfilled(value));
                    } else {
                        resolve(value as unknown as TResult1);
                    }
                } catch (error) {
                    reject(error);
                }
            };

            const handleRejected = (reason: any) => {
                try {
                    if (onRejected) {
                        resolve(onRejected(reason));
                    } else {
                        reject(reason);
                    }
                } catch (error) {
                    reject(error);
                }
            };

            if (this._status === PromiseStatus.Fulfilled) {
                handleFulfilled(this._result as T);
            } else if (this._status === PromiseStatus.Rejected) {
                handleRejected(this._reason);
            } else {
                this._onFulfilledCallbacks.push(handleFulfilled);
                this._onRejectedCallbacks.push(handleRejected);
            }
        });
    }

    /**
     * Adds a rejection handler callback to the promise and returns a new promise resolving to the return value of the callback if it is called.
     * @param onRejected Function to execute if the promise is rejected.
     * @returns A new CustomPromise that will resolve with the return value of `onRejected` or will continue to reject.
     */
    public catch<TResult = never>(
        onRejected?: OnRejectedFunction<TResult> | null
    ): CustomPromise<T | TResult> {
        return this.then(null, onRejected);
    }

    /**
     * Returns a CustomPromise object that is resolved with the given value. This function can be used when immediate resolution of a promise is needed.
     * @param value The value to resolve the promise with.
     * @returns A promise that is resolved with `value`.
     */
    public static resolve<U>(value: U | PromiseLike<U>): CustomPromise<U> {
        return new CustomPromise<U>((resolve, reject) => {
            resolve(value);
        });
    }

    /**
     * Returns a CustomPromise object that is rejected with the given reason.
     * @param reason The reason for the promise's rejection.
     * @returns A promise that is rejected with `reason`.
     */
    public static reject<U>(reason?: any): CustomPromise<U> {
        return new CustomPromise<U>((resolve, reject) => {
            reject(reason);
        });
    }

    /**
     * Creates a promise that resolves after a specified number of milliseconds, simulating a delay.
     * @param ms The number of milliseconds to delay before resolving the promise.
     * @returns A promise that resolves after `ms` milliseconds.
     */
    public static delay(ms: number): CustomPromise<void> {
        return new CustomPromise<void>((resolve) => {
            setTimeout(resolve, ms);
        });
    }
}

//------------------------------------------------------------//
