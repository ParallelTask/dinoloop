import { UserException } from '../../exception/user.exception';
import { DataUtility } from '../../utility/data.utility';

/**
 * Typically passing null/undefined as arguments invokes this exception
 */
export class InvalidArgumentException extends UserException {
    argumentValue: any;
    constructor(argumentValue: any, msg?: string) {
        super(msg);
        this.argumentValue = argumentValue;
        this.type = InvalidArgumentException.name;
        this.message = DataUtility.isEmpty(msg)
            ? InvalidArgumentException.name : msg;
    }
}

/**
 * Registering null/undefined as routing values invokes this exception
 */
export class InvalidRouteException extends UserException {
    httpVerb: string;
    action: string;
    controller: string;
    route: string | RegExp;
    constructor(route: string | RegExp, httpVerb: string, action: string, controller: string, msg?: string) {
        super(msg);
        this.route = route;
        this.httpVerb = httpVerb;
        this.action = action;
        this.controller = controller;
        this.type = InvalidRouteException.name;
        this.message = DataUtility.isEmpty(msg)
            ? InvalidRouteException.name : msg;
    }
}

/**
 * When the requested route is not found in the route-table invokes this exception
 */
export class RouteNotFoundException extends UserException {
    httpVerb: string;
    requestUrl: string;
    constructor(httpVerb: string, requestUrl: string, msg?: string) {
        super(msg);
        this.httpVerb = httpVerb;
        this.requestUrl = requestUrl;
        this.type = RouteNotFoundException.name;
        this.message = DataUtility.isEmpty(msg)
            ? RouteNotFoundException.name : msg;
    }
}

/**
 * When HttpRequest body is not a valid instance to the binded model invokes this exception
 */
export class InvalidModelException extends UserException {
    value: any;
    errors: string[];
    model: any;
    constructor(value: any, errors: string[], model: any, msg?: any) {
        super(msg);
        this.value = value;
        this.errors = errors;
        this.model = model;
        this.type = InvalidModelException.name;
        this.message = DataUtility.isEmpty(msg)
            ? InvalidModelException.name : msg;
    }
}