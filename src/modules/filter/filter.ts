import { Request, Response, NextFunction } from '../types/express';
import { DinoResponse } from '../entities/dino.response';
import {
    IRequestStartMiddleware,
    IErrorMiddleware,
    IRequestEndMiddleware,
    IMiddleware,
    IActionFilter,
    IResultFilter,
    IExceptionFilter
} from '../interfaces/filter';

/**
 * Extend this class to create ErrorMiddleware
 */
export abstract class ErrorMiddleware implements IErrorMiddleware {
    abstract invoke(
        err: Error, request: Request, response: Response, next: NextFunction): void;
}

/**
 * Extend this class to create ErrorMiddlewareAsync
 */
export abstract class ErrorMiddlewareAsync implements IErrorMiddleware {
    abstract async invoke(
        err: Error, request: Request, response: Response, next: NextFunction): Promise<void>;
}

/**
 * Extend this class to create RequestStartMiddleware
 */
export abstract class RequestStartMiddleware implements IRequestStartMiddleware {
    abstract invoke(request: Request, response: Response, next: NextFunction): void;
}

/**
 * Extend this class to create RequestStartMiddlewareAsync
 */
export abstract class RequestStartMiddlewareAsync implements IRequestStartMiddleware {
    abstract async invoke(
        request: Request, response: Response, next: NextFunction): Promise<void>;
}

/**
 * Extend this class to create RequestEndMiddleware
 */
export abstract class RequestEndMiddleware implements IRequestEndMiddleware {
    abstract invoke(
        request: Request, response: Response, next: NextFunction, result: any): void;
}

/**
 * Extend this class to create RequestEndMiddlewareAsync
 */
export abstract class RequestEndMiddlewareAsync implements IRequestEndMiddleware {
    abstract async invoke(
        request: Request, response: Response, next: NextFunction, result: any): Promise<void>;
}

/**
 * Extend this class to create Middleware
 */
export abstract class Middleware implements IMiddleware {
    abstract invoke(
        request: Request, response: Response, next: NextFunction, data?: any): void;
}

/**
 * Extend this class to create MiddlewareAsync
 */
export abstract class MiddlewareAsync implements IMiddleware {
    abstract async invoke(
        request: Request, response: Response, next: NextFunction, data?: any): Promise<void>;
}

/**
 * Extend this class to create ActionFilter
 */
export abstract class ActionFilter implements IActionFilter {
    abstract beforeExecution(
        request: Request, response: Response, next: NextFunction, data?: any): void;
    abstract afterExecution(
        request: Request, response: Response, next: NextFunction, result: any, data?: any): void;
}

/**
 * Extend this class to create ActionFilterAsync
 */
export abstract class ActionFilterAsync implements IActionFilter {
    abstract async beforeExecution(
        request: Request, response: Response, next: NextFunction, data?: any): Promise<void>;
    abstract async afterExecution(
        request: Request, response: Response, next: NextFunction, result: any, data?: any): Promise<void>;
}

/**
 * Extend this class to create ExceptionFilter
 */
export abstract class ExceptionFilter implements IExceptionFilter {
    abstract invoke(
        err: Error, request: Request, response: Response, next: NextFunction): void;
}

/**
 * Extend this class to create ExceptionFilterAsync
 */
export abstract class ExceptionFilterAsync implements IExceptionFilter {
    abstract async invoke(
        err: Error, request: Request, response: Response, next: NextFunction): Promise<void>;
}

/**
 * Extend this class to create ResultFilter
 */
export abstract class ResultFilter implements IResultFilter {
    abstract invoke(
        request: Request, response: Response, next: NextFunction, result: any, data?: any): void;
}

/**
 * Extend this class to create ResultFilterAsync
 */
export abstract class ResultFilterAsync implements IResultFilter {
    abstract async invoke(
        request: Request, response: Response, next: NextFunction, result: any, data?: any): Promise<void>;
}
