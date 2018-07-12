import { Request, Response, NextFunction } from '../types';

// This is the controller to be extended to respond internal server error globally.
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
     * Invoked on application error
     */
    abstract internalServerError(): void;
}
