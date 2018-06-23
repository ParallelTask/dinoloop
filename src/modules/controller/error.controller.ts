import { Request, Response, NextFunction } from '../types';

// This is the controller to be extended to respond to errors i.e 500 internal server error
/**
 * ApplicationError controller must extend this class
 */
export abstract class ErrorController {
    /**
     * Express.Request
     */
    request: Request;
    /**
     * Express.Response
     */
    response: Response;
    /**
     * Express.NextFunction
     */
    next: NextFunction;
    error: Error;
    /**
     * Default method that will be invoked on application error
     */
    abstract internalServerError(): void;
}
