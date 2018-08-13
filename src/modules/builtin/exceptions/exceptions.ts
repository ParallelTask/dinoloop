import { CustomException } from '../../exception';
import { DataUtility } from '../../utility';
import { HttpStatusCode } from '../../constants';

/**
 * Passing Invalid values for arguments invokes this exception
 */
export class InvalidArgumentException extends CustomException {
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
export class InvalidRouteException extends CustomException {
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
export class RouteNotFoundException extends CustomException {
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
 * Passing Invalid values for action parameter invokes this exception
 */
export class ActionParamException extends CustomException {
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
        this.type = ActionParamException.name;
        this.message = DataUtility.isEmpty(msg)
            ? ActionParamException.name : msg;
    }
}

/**
 * Creates HttpResponseException with the specified status code and value
 */
export class HttpResponseException<T> extends CustomException {
    statusCode: HttpStatusCode;
    content: T;

    constructor(statusCode: HttpStatusCode, content?: T) {
        super(HttpResponseException.name);
        this.statusCode = statusCode;
        this.content = content;
        this.type = HttpResponseException.name;
    }
}

/**
 * Creates HttpResponseException with HttpStatusCode.badRequest (400)
 */
export class BadRequestException<T> extends HttpResponseException<T> {
    constructor(content?: T) {
        super(HttpStatusCode.badRequest, content);
        this.type = BadRequestException.name;
    }
}

/**
 * Creates HttpResponseException with HttpStatusCode.unauthorized (401)
 */
export class UnauthorizedException<T> extends HttpResponseException<T> {
    constructor(content?: T) {
        super(HttpStatusCode.unauthorized, content);
        this.type = UnauthorizedException.name;
    }
}

/**
 * Creates HttpResponseException with HttpStatusCode.forbidden (403)
 */
export class ForbiddenException<T> extends HttpResponseException<T> {
    constructor(content?: T) {
        super(HttpStatusCode.forbidden, content);
        this.type = ForbiddenException.name;
    }
}

/**
 * Creates HttpResponseException with HttpStatusCode.notFound (404)
 */
export class NotFoundException<T> extends HttpResponseException<T> {
    constructor(content?: T) {
        super(HttpStatusCode.notFound, content);
        this.type = NotFoundException.name;
    }
}

/**
 * Creates HttpResponseException with HttpStatusCode.internalServerError (500)
 */
export class InternalServerErrorException<T> extends HttpResponseException<T> {
    constructor(content?: T) {
        super(HttpStatusCode.internalServerError, content);
        this.type = InternalServerErrorException.name;
    }
}

/**
 * Creates HttpResponseException with HttpStatusCode.notImplemented (501)
 */
export class NotImplementedException<T> extends HttpResponseException<T> {
    constructor(content?: T) {
        super(HttpStatusCode.notImplemented, content);
        this.type = NotImplementedException.name;
    }
}

/**
 * Creates HttpResponseException with HttpStatusCode.badGateway (502)
 */
export class BadGatewayException<T> extends HttpResponseException<T> {
    constructor(content?: T) {
        super(HttpStatusCode.badGateway, content);
        this.type = BadGatewayException.name;
    }
}

/**
 * Creates HttpResponseException with HttpStatusCode.serviceUnavailable (503)
 */
export class ServiceUnavailableException<T> extends HttpResponseException<T> {
    constructor(content?: T) {
        super(HttpStatusCode.serviceUnavailable, content);
        this.type = ServiceUnavailableException.name;
    }
}
