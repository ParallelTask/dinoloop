import {
    Reflector,
    Attribute,
    AttributeMetadata,
    InvalidRouteException,
    IControllerAttributeExtended,
    FunctionUtility,
    InvalidArgumentException,
    IParseAttribute,
    DataUtility
} from '../../index';

describe('modules.metadata.attributes.spec', () => {
    it('sendsResponse.verify_metadata', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value, target, property) => {
                expect(key).toBe(Attribute.sendsResponse);
                expect(value).toBe('sendsResponse');
                expect(target).toBe(Function.constructor.prototype);
                expect(property).toBe('test');
            });
        AttributeMetadata.sendsResponse()(Function, 'test');
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
    });
    it('asyncAttr.verify_metadata', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value, target, property) => {
                expect(key).toBe(Attribute.asyncAttr);
                expect(value).toBe('asyncAttr');
                expect(target).toBe(Function.constructor.prototype);
                expect(property).toBe('test');
            });
        AttributeMetadata.asyncAttr()(Function, 'test');
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
    });
    it('httpGet.verify_metadata', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value, target, property) => {
                expect(key).toBe(Attribute.httpGet);
                expect(value).toBe('route');
                expect(target).toBe(Function.constructor.prototype);
                expect(property).toBe('test');
            });
        AttributeMetadata.httpGet('route')(Function, 'test');
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
    });
    it('httpGet.throws_InvalidRouteException_when_route_null', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(() => null);
        expect(() => AttributeMetadata.httpGet(null)(Function, 'test'))
            .toThrowError(InvalidRouteException);
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(0);
    });
    it('httpGet.throws_InvalidRouteException_when_route_undefined', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(() => null);
        expect(() => AttributeMetadata.httpGet(undefined)(Function, 'test'))
            .toThrowError(InvalidRouteException);
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(0);
    });
    it('parse.throws_InvalidArgumentException_when_cb_not_function', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(() => []);
        spyOn(DataUtility, 'isFunction').and.callFake(() => false);
        spyOn(FunctionUtility, 'getParamNames').and.callFake(() => []);
        expect(() => AttributeMetadata.parse(undefined, {}, true)(Function, 'test', 2))
            .toThrowError(InvalidArgumentException);
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(0);
        expect(DataUtility.isFunction).toHaveBeenCalledTimes(1);
    });
    it('parse.when_cb_is_function_metadata_defined_first_time', () => {
        let handler = () => null;
        spyOn(Reflector, 'defineMetadata').and
            .callFake((key, data, target, paramKey) => {
                let attr: IParseAttribute = data[0];
                expect(attr.handler).toBe(handler);
                expect(attr.isQueryParam).toBe(true);
                expect(attr.data).toEqual({ id: 45 });
            });
        spyOn(Reflector, 'getMetadata').and.callFake(() => undefined);
        spyOn(DataUtility, 'isFunction').and.callFake(() => true);
        spyOn(FunctionUtility, 'getParamNames').and.callFake(() => []);
        AttributeMetadata.parse(handler, { id: 45 }, true)(Function, 'test', 2);
        expect(Reflector.getMetadata).toHaveBeenCalledTimes(1);
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
        expect(DataUtility.isFunction).toHaveBeenCalledTimes(1);
    });

    it('parse.when_cb_is_function_metadata_defined_second_time', () => {
        let handler = () => null;
        let att: IParseAttribute[] = [{

        }];
        spyOn(Reflector, 'defineMetadata').and
            .callFake((key, data, target, paramKey) => {
                let attr: IParseAttribute = data[1];
                expect(attr.handler).toBe(handler);
                expect(attr.isQueryParam).toBe(false);
                expect(attr.data).toEqual({ id: 45 });
            });
        spyOn(Reflector, 'getMetadata').and.callFake(() => att);
        spyOn(DataUtility, 'isFunction').and.callFake(() => true);
        spyOn(FunctionUtility, 'getParamNames').and.callFake(() => []);
        AttributeMetadata.parse(handler, { id: 45 }, false)(Function, 'test', 2);
        expect(Reflector.getMetadata).toHaveBeenCalledTimes(1);
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
        expect(DataUtility.isFunction).toHaveBeenCalledTimes(1);
    });

    it('httpPost.verify_metadata', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value, target, property) => {
                expect(key).toBe(Attribute.httpPost);
                expect(value).toBe('route');
                expect(target).toBe(Function.constructor.prototype);
                expect(property).toBe('test');
            });
        AttributeMetadata.httpPost('route')(Function, 'test');
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
    });
    it('httpPost.throws_InvalidRouteException_when_route_null', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(() => null);
        expect(() => AttributeMetadata.httpPost(null)(Function, 'test'))
            .toThrowError(InvalidRouteException);
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(0);
    });
    it('httpPost.throws_InvalidRouteException_when_route_undefined', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(() => null);
        expect(() => AttributeMetadata.httpPost(undefined)(Function, 'test'))
            .toThrowError(InvalidRouteException);
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(0);
    });
    it('httpPut.verify_metadata', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value, target, property) => {
                expect(key).toBe(Attribute.httpPut);
                expect(value).toBe('route');
                expect(target).toBe(Function.constructor.prototype);
                expect(property).toBe('test');
            });
        AttributeMetadata.httpPut('route')(Function, 'test');
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
    });
    it('httpPut.throws_InvalidRouteException_when_route_null', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(() => null);
        expect(() => AttributeMetadata.httpPut(null)(Function, 'test'))
            .toThrowError(InvalidRouteException);
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(0);
    });
    it('httpPut.throws_InvalidRouteException_when_route_undefined', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(() => null);
        expect(() => AttributeMetadata.httpPut(undefined)(Function, 'test'))
            .toThrowError(InvalidRouteException);
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(0);
    });
    it('httpPatch.verify_metadata', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value, target, property) => {
                expect(key).toBe(Attribute.httpPatch);
                expect(value).toBe('route');
                expect(target).toBe(Function.constructor.prototype);
                expect(property).toBe('test');
            });
        AttributeMetadata.httpPatch('route')(Function, 'test');
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
    });
    it('httpPatch.throws_InvalidRouteException_when_route_null', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(() => null);
        expect(() => AttributeMetadata.httpPatch(null)(Function, 'test'))
            .toThrowError(InvalidRouteException);
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(0);
    });
    it('httpPatch.throws_InvalidRouteException_when_route_undefined', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(() => null);
        expect(() => AttributeMetadata.httpPatch(undefined)(Function, 'test'))
            .toThrowError(InvalidRouteException);
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(0);
    });
    it('httpDelete.verify_metadata', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value, target, property) => {
                expect(key).toBe(Attribute.httpDelete);
                expect(value).toBe('route');
                expect(target).toBe(Function.constructor.prototype);
                expect(property).toBe('test');
            });
        AttributeMetadata.httpDelete('route')(Function, 'test');
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
    });
    it('httpDelete.throws_InvalidRouteException_when_route_null', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(() => null);
        expect(() => AttributeMetadata.httpDelete(null)(Function, 'test'))
            .toThrowError(InvalidRouteException);
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(0);
    });
    it('httpDelete.throws_InvalidRouteException_when_route_undefined', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(() => null);
        expect(() => AttributeMetadata.httpDelete(undefined)(Function, 'test'))
            .toThrowError(InvalidRouteException);
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(0);
    });
    it('httpHead.verify_metadata', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value, target, property) => {
                expect(key).toBe(Attribute.httpHead);
                expect(value).toBe('route');
                expect(target).toBe(Function.constructor.prototype);
                expect(property).toBe('test');
            });
        AttributeMetadata.httpHead('route')(Function, 'test');
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
    });
    it('httpHead.throws_InvalidRouteException_when_route_null', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(() => null);
        expect(() => AttributeMetadata.httpHead(null)(Function, 'test'))
            .toThrowError(InvalidRouteException);
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(0);
    });
    it('httpHead.throws_InvalidRouteException_when_route_undefined', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(() => null);
        expect(() => AttributeMetadata.httpHead(undefined)(Function, 'test'))
            .toThrowError(InvalidRouteException);
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(0);
    });
    it('httpAll.verify_metadata', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value, target, property) => {
                expect(key).toBe(Attribute.httpAll);
                expect(value).toBe('route');
                expect(target).toBe(Function.constructor.prototype);
                expect(property).toBe('test');
            });
        AttributeMetadata.httpAll('route')(Function, 'test');
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
    });
    it('httpAll.throws_InvalidRouteException_when_route_null', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(() => null);
        expect(() => AttributeMetadata.httpAll(null)(Function, 'test'))
            .toThrowError(InvalidRouteException);
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(0);
    });
    it('httpAll.throws_InvalidRouteException_when_route_undefined_verify_exception_values', () => {
        let e: InvalidRouteException;
        spyOn(Reflector, 'defineMetadata').and.callFake(() => null);
        try {
            AttributeMetadata.httpAll(undefined)(Function, 'test');
        } catch (err) {
            // Following expect statements verify the InvalidRouteException values for all http verbs
            // Do not delete this test case
            e = err;
        }
        expect(e instanceof InvalidRouteException).toBeTruthy();
        expect(e.route).toBe(undefined);
        expect(e.httpVerb).toBe(Attribute.httpAll);
        expect(e.action).toBe('test');
        expect(e.controller).toBe(Function.constructor.name);
        expect(() => AttributeMetadata.httpAll(undefined)(Function, 'test'))
            .toThrowError(InvalidRouteException);
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(0);
    });
    it('controller.throws_InvalidRouteException_when_prefix_undefined', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(() => null);
        expect(() => AttributeMetadata.controller(undefined)(Function, 'test'))
            .toThrowError(InvalidRouteException);
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(0);
    });
    it('controller.throws_InvalidRouteException_when_prefix_null_verify_exception_values', () => {
        let e: InvalidRouteException;
        spyOn(Reflector, 'defineMetadata').and.callFake(() => null);
        try {
            AttributeMetadata.controller(null)(Function, 'test');
        } catch (err) {
            // Following expects verify the exception values at controller level
            // Do not delete this test case
            e = err;
        }
        expect(e instanceof InvalidRouteException).toBeTruthy();
        expect(e.route).toBe(null);
        expect(e.httpVerb).toBeUndefined();
        expect(e.action).toBeUndefined();
        expect(e.controller).toBe(Function.constructor.name);
        expect(() => AttributeMetadata.controller(null)(Function, 'test'))
            .toThrowError(InvalidRouteException);
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(0);
    });
    it('controller.verify_metadata_when_attr_undefined', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value: IControllerAttributeExtended, target) => {
                expect(key).toBe(Attribute.controller);
                expect(value.prefix).toBe('route');
                expect(value.use).toEqual([]);
                expect(value.exceptions).toEqual([]);
                expect(value.filters).toEqual([]);
                expect(value.middlewares).toEqual([]);
                expect(value.result).toEqual([]);
                expect(target).toBe(Function.prototype);
            });
        AttributeMetadata.controller('route', undefined)(Function, 'test');
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
    });
    it('controller.verify_metadata_when_attr_null', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value: IControllerAttributeExtended, target) => {
                expect(key).toBe(Attribute.controller);
                expect(value.prefix).toBe('route');
                expect(value.use).toEqual([]);
                expect(value.exceptions).toEqual([]);
                expect(value.filters).toEqual([]);
                expect(value.middlewares).toEqual([]);
                expect(value.result).toEqual([]);
                expect(target).toBe(Function.prototype);
            });
        AttributeMetadata.controller('route', null)(Function, 'test');
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
    });
    it('controller.attr.use_equals_[]_when_attr.use_undefined', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value: IControllerAttributeExtended, target) => {
                expect(key).toBe(Attribute.controller);
                expect(value.prefix).toBe('route');
                expect(value.use).toEqual([]);
                expect(target).toBe(Function.prototype);
            });
        AttributeMetadata.controller('route', { use: undefined })(Function, 'test');
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
    });
    it('controller.attr.use_equals_[]_when_attr.use_null', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value: IControllerAttributeExtended, target) => {
                expect(key).toBe(Attribute.controller);
                expect(value.prefix).toBe('route');
                expect(value.use).toEqual([]);
                expect(target).toBe(Function.prototype);
            });
        AttributeMetadata.controller('route', { use: null })(Function, 'test');
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
    });
    it('controller.attr.middlewares_equals_[]_when_attr.middlewares_undefined', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value: IControllerAttributeExtended, target) => {
                expect(key).toBe(Attribute.controller);
                expect(value.prefix).toBe('route');
                expect(value.middlewares).toEqual([]);
                expect(target).toBe(Function.prototype);
            });
        AttributeMetadata.controller('route', { middlewares: undefined })(Function, 'test');
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
    });
    it('controller.attr.middlewares_equals_[]_when_attr.middlewares_null', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value: IControllerAttributeExtended, target) => {
                expect(key).toBe(Attribute.controller);
                expect(value.prefix).toBe('route');
                expect(value.middlewares).toEqual([]);
                expect(target).toBe(Function.prototype);
            });
        AttributeMetadata.controller('route', { middlewares: null })(Function, 'test');
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
    });
    it('controller.attr.filters_equals_[]_when_attr.filters_undefined', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value: IControllerAttributeExtended, target) => {
                expect(key).toBe(Attribute.controller);
                expect(value.prefix).toBe('route');
                expect(value.filters).toEqual([]);
                expect(target).toBe(Function.prototype);
            });
        AttributeMetadata.controller('route', { filters: undefined })(Function, 'test');
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
    });
    it('controller.attr.filters_equals_[]_when_attr.filters_null', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value: IControllerAttributeExtended, target) => {
                expect(key).toBe(Attribute.controller);
                expect(value.prefix).toBe('route');
                expect(value.filters).toEqual([]);
                expect(target).toBe(Function.prototype);
            });
        AttributeMetadata.controller('route', { filters: null })(Function, 'test');
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
    });
    it('controller.attr.exceptions_equals_[]_when_attr.exceptions_undefined', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value: IControllerAttributeExtended, target) => {
                expect(key).toBe(Attribute.controller);
                expect(value.prefix).toBe('route');
                expect(value.exceptions).toEqual([]);
                expect(target).toBe(Function.prototype);
            });
        AttributeMetadata.controller('route', { exceptions: undefined })(Function, 'test');
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
    });
    it('controller.attr.exceptions_equals_[]_when_attr.exceptions_null', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value: IControllerAttributeExtended, target) => {
                expect(key).toBe(Attribute.controller);
                expect(value.prefix).toBe('route');
                expect(value.exceptions).toEqual([]);
                expect(target).toBe(Function.prototype);
            });
        AttributeMetadata.controller('route', { exceptions: null })(Function, 'test');
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
    });
    it('controller.attr.result_equals_[]_when_attr.result_undefined', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value: IControllerAttributeExtended, target) => {
                expect(key).toBe(Attribute.controller);
                expect(value.prefix).toBe('route');
                expect(value.result).toEqual([]);
                expect(target).toBe(Function.prototype);
            });
        AttributeMetadata.controller('route', { result: undefined })(Function, 'test');
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
    });
    it('controller.attr.result_equals_[]_when_attr.result_null', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value: IControllerAttributeExtended, target) => {
                expect(key).toBe(Attribute.controller);
                expect(value.prefix).toBe('route');
                expect(value.result).toEqual([]);
                expect(target).toBe(Function.prototype);
            });
        AttributeMetadata.controller('route', { result: null })(Function, 'test');
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
    });
    it('controller.verify_metadata_when_attr_values_defined', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value: IControllerAttributeExtended, target) => {
                expect(key).toBe(Attribute.controller);
                expect(value.prefix).toBe('route');
                expect(value.use).toEqual([Function]);
                expect(value.exceptions).toEqual([Error]);
                expect(value.result).toEqual([String]);
                expect(value.filters).toEqual([Number]);
                expect(value.middlewares).toEqual([Array]);
                expect(target).toBe(Function.prototype);
            });
        AttributeMetadata.controller('route', {
            use: [Function],
            exceptions: [Error],
            result: [String],
            filters: [Number],
            middlewares: [Array]
        })(Function, 'test');
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
    });
});
