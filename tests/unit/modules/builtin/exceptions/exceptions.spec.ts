import {
    InvalidRouteException,
    RouteNotFoundException,
    InvalidArgumentException,
    ParseParamException,
    HttpResponseException,
    HttpStatusCode
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
    it('ParseParamException.verify_properties', () => {
        let o = new ParseParamException('a', 'b', 'c', 'd');
        expect(o.value).toBe('a');
        expect(o.key).toBe('b');
        expect(o.action).toBe('c');
        expect(o.controller).toBe('d');
        expect(o.type).toBe(ParseParamException.name);
        expect(o.message).toBe(ParseParamException.name);
    });
    it('ParseParamException.verify_properties_with_msg', () => {
        let o = new ParseParamException('a', 'b', 'c', 'd', 'test');
        expect(o.value).toBe('a');
        expect(o.key).toBe('b');
        expect(o.action).toBe('c');
        expect(o.controller).toBe('d');
        expect(o.type).toBe(ParseParamException.name);
        expect(o.message).toBe('test');
    });
    it('HttpResponseException.verify_properties', () => {
        let o = new HttpResponseException({});
        expect(o.statusCode).toBe(HttpStatusCode.internalServerError);
        expect(o.content).toBeUndefined();
        // common for HttpResponseException test cases
        expect(o.type).toBe(HttpResponseException.name);
        expect(o.message).toBe(HttpResponseException.name);
    });
    it('HttpResponseException.verify_properties_when_statusCode_and_Content_provided', () => {
        let o = new HttpResponseException({
            statusCode: HttpStatusCode.badRequest,
            content: 'test'
        });
        expect(o.statusCode).toBe(HttpStatusCode.badRequest);
        expect(o.content).toBe('test');
    });
});
