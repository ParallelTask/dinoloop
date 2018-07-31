import { UserException } from '../../exception';
import { DataUtility } from '../../utility';
import { HttpStatusCode } from '../../constants';

/**
 * Passing Invalid values for arguments invokes this exception
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

    constructor(
        route: string | RegExp,
        httpVerb: string,
        action: string,
        controller: string,
        msg?: string) {

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
 * @Parse invokes ParseParamException for invalid values
 */
export class ParseParamException extends UserException {
    value: any;
    key: string;
    action: string;
    controller: string;

    constructor(
        value: any,
        key: string,
        action: string,
        controller: string,
        msg?: string) {

        super(msg);
        this.value = value;
        this.key = key;
        this.action = action;
        this.controller = controller;
        this.type = ParseParamException.name;
        this.message = DataUtility.isEmpty(msg)
            ? ParseParamException.name : msg;
    }
}
/**
 * An Exception that allows to respond to client with HttpStatusCode
 */
export class HttpResponseException<T> extends UserException {
    statusCode: HttpStatusCode;
    content: T;

    constructor(
        { statusCode = HttpStatusCode.internalServerError, content = undefined }:
            { statusCode?: HttpStatusCode, content?: T }
            = { statusCode: HttpStatusCode.internalServerError, content: undefined }) {
        super(HttpResponseException.name);
        this.statusCode = statusCode;
        this.content = content;
        this.type = HttpResponseException.name;
    }
}
