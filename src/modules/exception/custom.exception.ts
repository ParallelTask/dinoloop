// All custom exceptions must extend CustomException
// It supports inner-exception where as native js error object does not support inner exceptions
/**
 * CustomExceptions must extend this Exception
 */
export abstract class CustomException extends Error {
    innerException: Error;
    type: string;
    constructor(message: string, ex?: Error) {
        super(message);
        this.innerException = ex;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
