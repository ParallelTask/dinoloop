
// Provides a wrapper over native Promise object.
// use Deferrer to execute callback pattern inside promise.
// Deferrer makes it easier to achieve async-await pattern using Promises
/**
 * Deferrer provides asynchronous operation in async-await pattern
 */
export abstract class Deferrer {
    /**
     * Register the callback either the eventual value is resolved or rejected
     */
    static run<T>(cb: (resolve: (value?: T | PromiseLike<T>) => void,
        reject: (reason?: any) => void) => void): Promise<T> {
        return new Promise((resolve, reject) => {
            cb(resolve, reject);
        });
    }
}