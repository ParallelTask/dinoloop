import { Request, Response, NextFunction } from '../types/express';

export interface IErrorMiddleware {
    invoke(err: Error, request: Request, response: Response, next: NextFunction): void;
}

export interface IRequestStartMiddleware {
    invoke(request: Request, response: Response, next: NextFunction): void;
}

export interface IRequestEndMiddleware {
    invoke(request: Request, response: Response, next: NextFunction, result: any): void;
}

export interface IMiddleware {
    invoke(request: Request, response: Response, next: NextFunction, data?: any): void;
}

export interface IActionFilter {
    beforeExecution(request: Request, response: Response, next: NextFunction, data?: any): void;
    afterExecution(request: Request, response: Response, next: NextFunction, result: any, data?: any): void;
}

export interface IResultFilter {
    invoke(request: Request, response: Response, next: NextFunction, result: any, data?: any): void;
}

export interface IExceptionFilter {
    invoke(err: Error, request: Request, response: Response, next: NextFunction): void;
}