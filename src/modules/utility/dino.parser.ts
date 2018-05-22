import { IMiddlewareProvider, IMiddlewareClass } from '../types/attribute';
import { DataUtility } from './data.utility';

/**
 * ParserUtility functions to parse dino objects
 */
export abstract class DinoParser {

    /**
     * Parses the MiddlewareProvider to MiddlewareClass
     */
    static parseMiddlewareProvider(middleware: IMiddlewareProvider): IMiddlewareClass {
        let middlewareFunction: Function = middleware as any;
        let data = undefined;
        let middlewareClass: IMiddlewareClass = middleware as any;

        // if provider is non-function and has custom data, it should be using .useClass
        if (!DataUtility.isFunction(middleware) && !DataUtility.isUndefinedOrNull(middlewareClass)) {
            // data must be available only if .useClass is valid func
            if (DataUtility.isFunction(middlewareClass.useClass)) {
                middlewareFunction = middlewareClass.useClass;
                data = middlewareClass.data;
            } else {
                middlewareFunction = middlewareClass.useClass;
            }
        }

        return {
            data: data,
            useClass: middlewareFunction
        };
    }
}
