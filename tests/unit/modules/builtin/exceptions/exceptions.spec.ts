import {
    InvalidRouteException,
    RouteNotFoundException,
    InvalidArgumentException,
    ActionParamException,
    HttpResponseException,
    HttpStatusCode,
    BadRequestException,
    UnauthorizedException,
    ForbiddenException,
    NotFoundException,
    InternalServerErrorException,
    NotImplementedException,
    BadGatewayException,
    ServiceUnavailableException,
    ActionParamExceptionCode
} from '../../../index';

describe('modules.builtin.exceptions.spec', () => {
    it('InvalidArgumentException.verify_properties', () => {
        let o = new InvalidArgumentException(null);
        expect(o.argumentValue).toBe(null);
        expect(o.message).toBe(InvalidArgumentException.name);
    });
    it('InvalidArgumentException.verify_properties_with_msg', () => {
        let o = new InvalidArgumentException(null, 'test');
        expect(o.argumentValue).toBe(null);
        expect(o.message).toBe('test');
    });
    it('InvalidRouteException.verify_properties', () => {
        let o = new InvalidRouteException('a', 'b', 'c', 'd');
        expect(o.route).toBe('a');
        expect(o.httpVerb).toBe('b');
        expect(o.action).toBe('c');
        expect(o.controller).toBe('d');
        expect(o.type).toBe(InvalidRouteException.name);
        expect(o.message).toBe(InvalidRouteException.name);
    });
    it('InvalidRouteException.verify_properties_with_msg', () => {
        let o = new InvalidRouteException('a', 'b', 'c', 'd', 'test');
        expect(o.route).toBe('a');
        expect(o.httpVerb).toBe('b');
        expect(o.action).toBe('c');
        expect(o.controller).toBe('d');
        expect(o.type).toBe(InvalidRouteException.name);
        expect(o.message).toBe('test');
    });
    it('RouteNotFoundException.verify_properties', () => {
        let o = new RouteNotFoundException('a', 'b');
        expect(o.httpVerb).toBe('a');
        expect(o.requestUrl).toBe('b');
        expect(o.type).toBe(RouteNotFoundException.name);
        expect(o.message).toBe(RouteNotFoundException.name);
    });
    it('RouteNotFoundException.verify_properties_with_msg', () => {
        let o = new RouteNotFoundException('a', 'b', 'test');
        expect(o.httpVerb).toBe('a');
        expect(o.requestUrl).toBe('b');
        expect(o.type).toBe(RouteNotFoundException.name);
        expect(o.message).toBe('test');
    });
    it('ActionParamException.verify_properties', () => {
        let o = new ActionParamException('a', 'b', 'c', 'd', ActionParamExceptionCode.boolean);
        expect(o.value).toBe('a');
        expect(o.key).toBe('b');
        expect(o.action).toBe('c');
        expect(o.controller).toBe('d');
        expect(o.exceptionCode).toBe(ActionParamExceptionCode.boolean);
        expect(o.type).toBe(ActionParamException.name);
        expect(o.message).toBe(ActionParamException.name);
    });
    it('ActionParamException.verify_properties_with_msg', () => {
        let o =
            new ActionParamException('a', 'b', 'c', 'd',
                ActionParamExceptionCode.boolean, 'test');
        expect(o.value).toBe('a');
        expect(o.key).toBe('b');
        expect(o.action).toBe('c');
        expect(o.controller).toBe('d');
        expect(o.exceptionCode).toBe(ActionParamExceptionCode.boolean);
        expect(o.type).toBe(ActionParamException.name);
        expect(o.message).toBe('test');
    });
    it('HttpResponseException.verify_properties_when_statusCode_provided', () => {
        let o = new HttpResponseException(HttpStatusCode.internalServerError);
        expect(o.statusCode).toBe(HttpStatusCode.internalServerError);
        expect(o.content).toBeUndefined();
        // common for HttpResponseException test cases
        expect(o.type).toBe(HttpResponseException.name);
        expect(o.message).toBe(HttpResponseException.name);
    });
    it('HttpResponseException.verify_properties_when_statusCode_and_content_provided', () => {
        let o = new HttpResponseException(HttpStatusCode.badRequest, 'test');
        expect(o.statusCode).toBe(HttpStatusCode.badRequest);
        expect(o.content).toBe('test');
        expect(o.type).toBe(HttpResponseException.name);
    });
    it('BadRequestException.verify_properties_when_content_provided', () => {
        let o = new BadRequestException('test');
        expect(o.statusCode).toBe(HttpStatusCode.badRequest);
        expect(o.content).toBe('test');
        expect(o.message).toBe(HttpResponseException.name);
        expect(o.type).toBe(BadRequestException.name);
    });
    it('UnauthorizedException.verify_properties_when_content_provided', () => {
        let o = new UnauthorizedException('test');
        expect(o.statusCode).toBe(HttpStatusCode.unauthorized);
        expect(o.content).toBe('test');
        expect(o.message).toBe(HttpResponseException.name);
        expect(o.type).toBe(UnauthorizedException.name);
    });
    it('ForbiddenException.verify_properties_when_content_provided', () => {
        let o = new ForbiddenException('test');
        expect(o.statusCode).toBe(HttpStatusCode.forbidden);
        expect(o.content).toBe('test');
        expect(o.message).toBe(HttpResponseException.name);
        expect(o.type).toBe(ForbiddenException.name);
    });
    it('NotFoundException.verify_properties_when_content_provided', () => {
        let o = new NotFoundException('test');
        expect(o.statusCode).toBe(HttpStatusCode.notFound);
        expect(o.content).toBe('test');
        expect(o.message).toBe(HttpResponseException.name);
        expect(o.type).toBe(NotFoundException.name);
    });
    it('InternalServerErrorException.verify_properties_when_content_provided', () => {
        let o = new InternalServerErrorException('test');
        expect(o.statusCode).toBe(HttpStatusCode.internalServerError);
        expect(o.content).toBe('test');
        expect(o.message).toBe(HttpResponseException.name);
        expect(o.type).toBe(InternalServerErrorException.name);
    });
    it('NotImplementedException.verify_properties_when_content_provided', () => {
        let o = new NotImplementedException('test');
        expect(o.statusCode).toBe(HttpStatusCode.notImplemented);
        expect(o.content).toBe('test');
        expect(o.message).toBe(HttpResponseException.name);
        expect(o.type).toBe(NotImplementedException.name);
    });
    it('BadGatewayException.verify_properties_when_content_provided', () => {
        let o = new BadGatewayException('test');
        expect(o.statusCode).toBe(HttpStatusCode.badGateway);
        expect(o.content).toBe('test');
        expect(o.message).toBe(HttpResponseException.name);
        expect(o.type).toBe(BadGatewayException.name);
    });
    it('ServiceUnavailableException.verify_properties_when_content_provided', () => {
        let o = new ServiceUnavailableException('test');
        expect(o.statusCode).toBe(HttpStatusCode.serviceUnavailable);
        expect(o.content).toBe('test');
        expect(o.message).toBe(HttpResponseException.name);
        expect(o.type).toBe(ServiceUnavailableException.name);
    });
});
