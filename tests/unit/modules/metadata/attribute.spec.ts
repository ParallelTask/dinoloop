import {
    Reflector,
    SendsResponse,
    Observable,
    Async,
    HttpGet,
    Attribute,
    AttributeMetadata,
    InvalidRouteException,
    IControllerAttributeExtended,
    InvalidArgumentException,
    IBindModelAttributeExtended
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
    it('observable.verify_metadata', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value, target, property) => {
                expect(key).toBe(Attribute.observable);
                expect(value).toBe('observable');
                expect(target).toBe(Function.constructor.prototype);
                expect(property).toBe('test');
            });
        AttributeMetadata.observable()(Function, 'test');
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
    it('httpPost.verify_metadata', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value, target, property) => {
                expect(key).toBe(Attribute.httpGet);
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
                expect(key).toBe(Attribute.httpGet);
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
                expect(key).toBe(Attribute.httpGet);
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
                expect(key).toBe(Attribute.httpGet);
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
                expect(key).toBe(Attribute.httpGet);
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
                expect(key).toBe(Attribute.httpGet);
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
    it('httpAll.throws_InvalidRouteException_when_route_undefined_veriy_expection_values', () => {
        let e: InvalidRouteException;
        spyOn(Reflector, 'defineMetadata').and.callFake(() => null);
        try {
            AttributeMetadata.httpAll(undefined)(Function, 'test');
        } catch (err) {
            // Following expect statements verify the InvalidRouteException values for all httpverbs
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
            // Following expects verify the exceptionvalues at controller level
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
    // Following expects are same when_value_is_null is too, do not remove try catch
    // because it validates the exception object and message
    it('bindModel.throws_InvalidArgumentException_when_value_undefined', () => {
        let e: InvalidArgumentException;
        spyOn(Reflector, 'defineMetadata').and.callFake((key, value, target) => null);
        try {
            AttributeMetadata.bindModel(undefined)(Function, 'test');
        } catch (err) {
            e = err;
        }
        expect(e instanceof InvalidArgumentException).toBeTruthy();
        expect(e.argumentValue).toBe(undefined);
        expect(e.type).toBe(InvalidArgumentException.name);
        expect(e.message).toBe(`bindModel(${e.argumentValue}) is not valid`);
        expect(() => AttributeMetadata.bindModel(undefined)(Function, 'test'))
            .toThrowError(InvalidArgumentException);
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(0);
    });
    it('bindModel.throws_InvalidArgumentException_when_value_null', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake((key, value, target) => null);
        expect(() => AttributeMetadata.bindModel(null)(Function, 'test'))
            .toThrowError(InvalidArgumentException);
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(0);
    });
    it('bindModel.options.stopOnError_false_options.raiseModelError_undefined_when_options_undefined', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value: IBindModelAttributeExtended, target) => {
                expect(key).toBe(Attribute.bindModel);
                expect(value.model).toEqual(String);
                expect(value.options.stopOnError).toBeFalsy();
                expect(value.options.raiseModelError).toBeUndefined();
            });
        AttributeMetadata.bindModel(String)(Function, 'test');
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
    });
    it('bindModel.options.stopOnError_false_options.raiseModelError_undefined_when_options_null', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value: IBindModelAttributeExtended, target) => {
                expect(key).toBe(Attribute.bindModel);
                expect(value.model).toEqual(String);
                expect(value.options.stopOnError).toBeFalsy();
                expect(value.options.raiseModelError).toBeUndefined();
            });
        AttributeMetadata.bindModel(String, null)(Function, 'test');
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
    });
    it('bindModel.options.stopOnError_true_when_options.stopOnError_true', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value: IBindModelAttributeExtended, target) => {
                expect(key).toBe(Attribute.bindModel);
                expect(value.model).toEqual(String);
                expect(value.options.stopOnError).toBeTruthy();
            });
        AttributeMetadata.bindModel(String, { stopOnError: true })(Function, 'test');
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
    });
    it('bindModel.options.stopOnError_false_when_options.stopOnError_false', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value: IBindModelAttributeExtended, target) => {
                expect(key).toBe(Attribute.bindModel);
                expect(value.model).toEqual(String);
                expect(value.options.stopOnError).toBeFalsy();
            });
        AttributeMetadata.bindModel(String, { stopOnError: false })(Function, 'test');
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
    });
    it('bindModel.options.raiseModelError_false_when_options.raiseModelError_false', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value: IBindModelAttributeExtended, target) => {
                expect(key).toBe(Attribute.bindModel);
                expect(value.options.raiseModelError).toBeFalsy();
            });
        AttributeMetadata.bindModel(String, { raiseModelError: false })(Function, 'test');
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
    });
    it('bindModel.options.raiseModelError_true_when_options.raiseModelError_true', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value: IBindModelAttributeExtended, target) => {
                expect(key).toBe(Attribute.bindModel);
                expect(value.options.raiseModelError).toBeTruthy();
            });
        AttributeMetadata.bindModel(String, { raiseModelError: true })(Function, 'test');
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
    });
});