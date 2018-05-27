import {
    ExceptionFilter,
    ErrorMiddleware,
    MiddlewareAsync,
    Middleware,
    ResultFilter,
    ResultFilterAsync,
    ActionFilter,
    ActionFilterAsync,
    RequestStartMiddleware,
    RequestEndMiddleware,
    RequestStartMiddlewareAsync,
    RequestEndMiddlewareAsync,
    ExceptionFilterAsync,
    ErrorMiddlewareAsync
} from '../filter/filter';
import { ErrorController } from '../controller/error.controller';
import { IMiddlewareProvider, IMiddlewareClass } from '../types/attribute';
import { ObjectUtility } from './object.utility';
import { ApiController } from '../controller/api.controller';
import { DataUtility } from './data.utility';

/**
 * Wrapper methods to test the datatype of the components registered with Dino instance
 */
export abstract class DinoUtility {

    static isSyncMiddleWare(type: Function): boolean {
        return ObjectUtility.create(type.prototype)
            instanceof Middleware;
    }

    static isAsyncMiddleWare(type: Function): boolean {
        return ObjectUtility.create(type.prototype)
            instanceof MiddlewareAsync;
    }

    static isSyncRequestStartMiddleware(type: Function): boolean {
        return ObjectUtility.create(type.prototype)
            instanceof RequestStartMiddleware;
    }

    static isAsyncRequestStartMiddleware(type: Function): boolean {
        return ObjectUtility.create(type.prototype)
            instanceof RequestStartMiddlewareAsync;
    }

    static isSyncRequestEndMiddleware(type: Function): boolean {
        return Object.create(type.prototype)
            instanceof RequestEndMiddleware;
    }

    static isAsyncRequestEndMiddleware(type: Function): boolean {
        return Object.create(type.prototype)
            instanceof RequestEndMiddlewareAsync;
    }

    static isSyncActionFilter(type: Function): boolean {
        return ObjectUtility.create(type.prototype)
            instanceof ActionFilter;
    }

    static isAsyncActionFilter(type: Function): boolean {
        return ObjectUtility.create(type.prototype)
            instanceof ActionFilterAsync;
    }

    static isSyncResultFilter(type: Function): boolean {
        return ObjectUtility.create(type.prototype)
            instanceof ResultFilter;
    }

    static isAsyncResultFilter(type: Function): boolean {
        return ObjectUtility.create(type.prototype)
            instanceof ResultFilterAsync;
    }

    static isSyncErrorMiddleware(type: Function): boolean {
        return ObjectUtility.create(type.prototype) instanceof ErrorMiddleware;
    }

    static isAsyncErrorMiddleware(type: Function): boolean {
        return ObjectUtility.create(type.prototype) instanceof ErrorMiddlewareAsync;
    }

    static isSyncExceptionFilter(type: Function): boolean {
        return ObjectUtility.create(type.prototype) instanceof ExceptionFilter;
    }

    static isAsyncExceptionFilter(type: Function): boolean {
        return ObjectUtility.create(type.prototype) instanceof ExceptionFilterAsync;
    }

    static isErrorController(type: Function): boolean {
        return ObjectUtility.create(type.prototype) instanceof ErrorController;
    }

    static isApiController(type: Function): boolean {
        return ObjectUtility.create(type.prototype) instanceof ApiController;
    }
}
