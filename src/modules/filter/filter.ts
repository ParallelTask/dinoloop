import { Request, Response, NextFunction } from '../types';

/**
 * Extend this class to create ServerErrorMiddleware
 */
export abstract class ErrorMiddleware {
    abstract invoke(
        err: Error, request: Request, response: Response, next: NextFunction): void;
}

/**
 * Extend this class to create ServerErrorMiddlewareAsync
 */
export abstract class ErrorMiddlewareAsync {
    abstract async invoke(
        err: Error, request: Request, response: Response, next: NextFunction): Promise<void>;
}

/**
 * Extend this class to create ApplicationStartMiddleware
 */
export abstract class AppStartMiddleware {
    abstract invoke(): void;
}

/**
 * Extend this class to create RequestStartMiddleware
 */
export abstract class RequestStartMiddleware {
    abstract invoke(
        request: Request, response: Response, next: NextFunction): void;
}

/**
 * Extend this class to create RequestStartMiddlewareAsync
 */
export abstract class RequestStartMiddlewareAsync {
    abstract async invoke(
        request: Request, response: Response, next: NextFunction): Promise<void>;
}

/**
 * Extend this class to create RequestEndMiddleware
 */
export abstract class RequestEndMiddleware {
    abstract invoke(
        request: Request, response: Response, next: NextFunction, result: any): void;
}

/**
 * Extend this class to create RequestEndMiddlewareAsync
 */
export abstract class RequestEndMiddlewareAsync {
    abstract async invoke(
        request: Request, response: Response, next: NextFunction, result: any): Promise<void>;
}

/**
 * Extend this class to create Middleware
 */
export abstract class Middleware {
    abstract invoke(
        request: Request, response: Response, next: NextFunction, data?: any): void;
}

/**
 * Extend this class to create MiddlewareAsync
 */
export abstract class MiddlewareAsync {
    abstract async invoke(
        request: Request, response: Response, next: NextFunction, data?: any): Promise<void>;
}

/**
 * Extend this class to create ActionFilter
 */
export abstract class ActionFilter {
    abstract beforeExecution(
        request: Request, response: Response, next: NextFunction, data?: any): void;
    abstract afterExecution(
        request: Request, response: Response, next: NextFunction, result: any, data?: any): void;
}

/**
 * Extend this class to create ActionFilterAsync
 */
export abstract class ActionFilterAsync {
    abstract async beforeExecution(
        request: Request, response: Response, next: NextFunction, data?: any): Promise<void>;
    abstract async afterExecution(
        request: Request, response: Response, next: NextFunction, result: any, data?: any): Promise<void>;
}

/**
 * Extend this class to create ExceptionFilter
 */
export abstract class ExceptionFilter {
    abstract invoke(
        err: Error, request: Request, response: Response, next: NextFunction): void;
}

/**
 * Extend this class to create ExceptionFilterAsync
 */
export abstract class ExceptionFilterAsync {
    abstract async invoke(
        err: Error, request: Request, response: Response, next: NextFunction): Promise<void>;
}

/**
 * Extend this class to create ResultFilter
 */
export abstract class ResultFilter {
    abstract invoke(
        request: Request, response: Response, next: NextFunction, result: any, data?: any): void;
}

/**
 * Extend this class to create ResultFilterAsync
 */
export abstract class ResultFilterAsync {
    abstract async invoke(
        request: Request, response: Response, next: NextFunction, result: any, data?: any): Promise<void>;
}
