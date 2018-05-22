import { Reflector } from '../lib/reflector';
import { Attribute } from '../constants/constants';
import { DataUtility } from '../utility/data.utility';
import { InvalidRouteException, InvalidArgumentException } from '../builtin/exceptions/exceptions';
import {
    IControllerAttribute,
    IControllerAttributeExtended,
    IBindModelAttributeExtended,
    IBindModelAttribute
} from '../types/attribute';

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
        Reflector.defineMetadata(Attribute.httpGet,
            route, target.constructor.prototype, property);
    }

    static sendsResponse = (): (target: any, propertyKey: string) => void => {
        return (target: any, propertyKey: string): void => {
            Reflector.defineMetadata(Attribute.sendsResponse,
                'sendsResponse', target.constructor.prototype, propertyKey);
        };
    }

    static observable = (): (target: any, propertyKey: string) => void => {
        return (target: any, propertyKey: string): void => {
            Reflector.defineMetadata(Attribute.observable,
                'observable', target.constructor.prototype, propertyKey);
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
            AttributeMetadata.defineHttpVerbMetadata(route, Attribute.httpGet, target, propertyKey);
        };
    }

    static httpPost = (route: string | RegExp): (target: any, propertyKey: string) => void => {
        return (target: any, propertyKey: string): void => {
            AttributeMetadata.defineHttpVerbMetadata(route, Attribute.httpPost, target, propertyKey);
        };
    }

    static httpDelete = (route: string | RegExp): (target: any, propertyKey: string) => void => {
        return (target: any, propertyKey: string): void => {
            AttributeMetadata.defineHttpVerbMetadata(route, Attribute.httpDelete, target, propertyKey);
        };
    }

    static httpPatch = (route: string | RegExp): (target: any, propertyKey: string) => void => {
        return (target: any, propertyKey: string): void => {
            AttributeMetadata.defineHttpVerbMetadata(route, Attribute.httpPatch, target, propertyKey);
        };
    }

    static httpPut = (route: string | RegExp): (target: any, propertyKey: string) => void => {
        return (target: any, propertyKey: string): void => {
            AttributeMetadata.defineHttpVerbMetadata(route, Attribute.httpPut, target, propertyKey);
        };
    }

    static httpHead = (route: string | RegExp): (target: any, propertyKey: string) => void => {
        return (target: any, propertyKey: string): void => {
            AttributeMetadata.defineHttpVerbMetadata(route, Attribute.httpHead, target, propertyKey);
        };
    }

    static httpAll = (route: string | RegExp): (target: any, propertyKey: string) => void => {
        return (target: any, propertyKey: string): void => {
            AttributeMetadata.defineHttpVerbMetadata(route, Attribute.httpAll, target, propertyKey);
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

    static bindModel = (type: Function, options?: IBindModelAttribute):
        (target: any, propertyKey: string) => void => {

        return (target: any, propertyKey: string): void => {

            if (DataUtility.isUndefinedOrNull(type)) {
                throw new InvalidArgumentException(type, `bindModel(${type}) is not valid`);
            }

            // Note: we are deliberately not initializing raiseModelError default value
            // because these may override global raiseModelError property always,
            // assuming user has provided value, hence it is recommended the value to be undefined
            // However we are initializing stopOnError to false because we dont have global flag for this.
            let opts = DataUtility.isUndefinedOrNull(options) ? {} : options;
            let stop = DataUtility.isUndefinedOrNull(opts.stopOnError) ? false : opts.stopOnError;
            let val: IBindModelAttributeExtended = {
                model: type,
                options: {
                    stopOnError: stop,
                    raiseModelError: opts.raiseModelError
                }
            };
            Reflector.defineMetadata(Attribute.bindModel,
                val, target.constructor.prototype, propertyKey);
        };
    }
}
