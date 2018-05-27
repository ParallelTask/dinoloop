import {
    Middleware, MiddlewareAsync,
    RequestEndMiddleware,
    RequestStartMiddleware,
    RequestStartMiddlewareAsync,
    RequestEndMiddlewareAsync,
    ActionFilter,
    ActionFilterAsync,
    ResultFilter,
    ResultFilterAsync,
    ErrorController,
    ErrorMiddleware,
    ErrorMiddlewareAsync,
    ExceptionFilter,
    ExceptionFilterAsync,
    ApiController
} from '../index';

export class MiddlewareFake extends Middleware {
    invoke(request: any, response: any, next: any, data?: any): void { }
}
export class MiddlewareAsyncFake extends MiddlewareAsync {
    async invoke(request: any, response: any, next: any, data?: any): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
export class RequestStartMiddlewareFake extends RequestStartMiddleware {
    invoke(request: any, response: any, next: any): void { }
}
export class RequestStartMiddlewareAsyncFake extends RequestStartMiddlewareAsync {
    async invoke(request: any, response: any, next: any): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
export class RequestEndMiddlewareFake extends RequestEndMiddleware {
    invoke(request: any, response: any, next: any, result: any): void { }
}
export class RequestEndMiddlewareAsyncFake extends RequestEndMiddlewareAsync {
    invoke(request: any, response: any, next: any, result: any): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
export class ActionFilterFake extends ActionFilter {
    beforeExecution(request: any, response: any, next: any, data?: any): void { }
    afterExecution(request: any,
        response: any, next: any, result: any, data?: any): void { }
}
export class ActionFilterAsyncFake extends ActionFilterAsync {
    async beforeExecution(request: any,
        response: any, next: any, data?: any): Promise<void> {
        throw new Error('Method not implemented.');
    }
    async afterExecution(request: any, response: any,
        next: any, result: any, data?: any): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
export class ResultFilterFake extends ResultFilter {
    invoke(request: any, response: any, next: any, result: any, data?: any): void { }
}
export class ResultFilterAsyncFake extends ResultFilterAsync {
    async invoke(request: any, response: any,
        next: any, result: any, data?: any): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
export class ErrorControllerFake extends ErrorController {
    write(): void { }
}
export class ErrorMiddlewareFake extends ErrorMiddleware {
    invoke(err: Error, request: any, response: any, next: any): void { }
}
export class ErrorMiddlewareAsyncFake extends ErrorMiddlewareAsync {
    async invoke(err: Error, request: any, response: any, next: any): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
export class ExceptionFilterFake extends ExceptionFilter {
    invoke(err: Error, request: any, response: any, next: any): void { }
}
export class ExceptionFilterAsyncFake extends ExceptionFilterAsync {
    invoke(err: Error, request: any, response: any, next: any): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
export class ApiControllerFake extends ApiController { }
