import { Reflector } from '../lib';
import { Attribute } from '../constants';
import { DataUtility, FunctionUtility } from '../utility';
import { InvalidRouteException, InvalidArgumentException } from '../builtin/exceptions';
import {
    IControllerAttribute,
    IControllerAttributeExtended,
    IBindModelAttributeExtended,
    IBindModelAttribute,
    IParseAttribute,
    IParseHandler
} from '../types';

export abstract class AttributeMetadata {

    private static defineHttpVerbMetadata(
        route: string | RegExp,
        verb: string,
        target: any,
        property: string): void {

        if (DataUtility.isUndefinedOrNull(route)) {
            throw new InvalidRouteException(route, verb,
                property, target.constructor.name);
        }
        Reflector.defineMetadata(verb,
            route, target.constructor.prototype, property);
    }

    // we are creating an array of parameter values and saving it to metadata
    static parse = (cb: IParseHandler, data?: any):
        (target: any, propertyKey: string, parameterIndex: number) => void => {

        return (target: any, propertyKey: string, parameterIndex: number): void => {

            let args = FunctionUtility.getParamNames(target[propertyKey]);
            let parameterKey = args[parameterIndex];

            if (!DataUtility.isUndefinedOrNull(parameterKey)) {

                // get already added metadata
                let meta: IParseAttribute[] = Reflector.getMetadata(Attribute.parse,
                    target.constructor.prototype, propertyKey);

                const parseAttribute: IParseAttribute = {
                    handler: cb,
                    key: parameterKey,
                    controller: target,
                    action: propertyKey,
                    data: data
                };

                if (!DataUtility.isUndefinedOrNull(meta)) {
                    meta.push(parseAttribute);

                    // rewrite metadata by adding it to existing array
                    Reflector.defineMetadata(Attribute.parse, meta,
                        target.constructor.prototype, propertyKey);
                } else {
                    // must be set as array for first save
                    Reflector.defineMetadata(Attribute.parse, [parseAttribute],
                        target.constructor.prototype, propertyKey);
                }
            }
        };
    }

    static sendsResponse = (): (target: any, propertyKey: string) => void => {
        return (target: any, propertyKey: string): void => {
            Reflector.defineMetadata(Attribute.sendsResponse,
                'sendsResponse', target.constructor.prototype, propertyKey);
        };
    }

    static asyncAttr = (): (target: any, propertyKey: string) => void => {
        return (target: any, propertyKey: string): void => {
            Reflector.defineMetadata(Attribute.asyncAttr,
                'asyncAttr', target.constructor.prototype, propertyKey);
        };
    }

    static httpGet = (route: string | RegExp): (target: any, propertyKey: string) => void => {
        return (target: any, propertyKey: string): void => {
            AttributeMetadata
                .defineHttpVerbMetadata(route, Attribute.httpGet, target, propertyKey);
        };
    }

    static httpPost = (route: string | RegExp): (target: any, propertyKey: string) => void => {
        return (target: any, propertyKey: string): void => {
            AttributeMetadata
                .defineHttpVerbMetadata(route, Attribute.httpPost, target, propertyKey);
        };
    }

    static httpDelete = (route: string | RegExp): (target: any, propertyKey: string) => void => {
        return (target: any, propertyKey: string): void => {
            AttributeMetadata
                .defineHttpVerbMetadata(route, Attribute.httpDelete, target, propertyKey);
        };
    }

    static httpPatch = (route: string | RegExp): (target: any, propertyKey: string) => void => {
        return (target: any, propertyKey: string): void => {
            AttributeMetadata
                .defineHttpVerbMetadata(route, Attribute.httpPatch, target, propertyKey);
        };
    }

    static httpPut = (route: string | RegExp): (target: any, propertyKey: string) => void => {
        return (target: any, propertyKey: string): void => {
            AttributeMetadata
                .defineHttpVerbMetadata(route, Attribute.httpPut, target, propertyKey);
        };
    }

    static httpHead = (route: string | RegExp): (target: any, propertyKey: string) => void => {
        return (target: any, propertyKey: string): void => {
            AttributeMetadata
                .defineHttpVerbMetadata(route, Attribute.httpHead, target, propertyKey);
        };
    }

    static httpAll = (route: string | RegExp): (target: any, propertyKey: string) => void => {
        return (target: any, propertyKey: string): void => {
            AttributeMetadata
                .defineHttpVerbMetadata(route, Attribute.httpAll, target, propertyKey);
        };
    }

    // handle null/undefined values, cleanse the data and pass onto inner methods
    static controller = (prefix: string, attr?: IControllerAttribute):
        (target: any, propertyKey: string) => void => {
        return (target: any, propertyKey: string): void => {
            let attrs = DataUtility.isUndefinedOrNull(attr) ? {} : attr;

            if (DataUtility.isUndefinedOrNull(prefix)) {
                throw new InvalidRouteException(prefix, undefined,
                    undefined, target.constructor.name);
            }

            let val: IControllerAttributeExtended = {
                prefix: prefix,
                middlewares: DataUtility.isUndefinedOrNull(attrs.middlewares) ? [] : attrs.middlewares,
                filters: DataUtility.isUndefinedOrNull(attrs.filters) ? [] : attrs.filters,
                exceptions: DataUtility.isUndefinedOrNull(attrs.exceptions) ? [] : attrs.exceptions,
                result: DataUtility.isUndefinedOrNull(attrs.result) ? [] : attrs.result,
                use: DataUtility.isUndefinedOrNull(attrs.use) ? [] : attrs.use
            };
            Reflector.defineMetadata(Attribute.controller, val, target.prototype);
        };
    }
}
