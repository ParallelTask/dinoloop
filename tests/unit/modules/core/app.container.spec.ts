import {
    AppContainer,
    DinoContainer,
    IDinoContainer,
    DinoStartMiddleware,
    TaskContextMiddleware,
    RouteNotFoundMiddleware,
    DataUtility,
    ResponseEndMiddleware,
    RouteExceptionMiddleware,
    HttpResponseExceptionMiddleware,
    ActionParamExceptionMiddleware,
    HttpResponseMessageMiddleware
} from '../../index';

describe('modules.core.app.container.spec', () => {
    it('constructor.verify_default_values', () => {
        let app = new AppContainer({ use: undefined } as any);
        expect(app.controllers).toEqual([]);
        expect(app.baseUri).toEqual('');
        expect(app.startMiddleware).toEqual([]);
        expect(app.endMiddleware).toEqual([]);
        expect(app.appStartMiddleware).toEqual([]);
        expect(app.diContainer).toBeUndefined();
        expect(app.diResolveCallback).toBeUndefined();
        expect(app.errorController).toBeUndefined();
        expect(app.routeNotFoundMiddleware).toBeUndefined();
        expect(app.errorMiddleware).toEqual([]);
        expect(app.raiseModelError).toBeFalsy();
        expect(app.enableTaskContext).toBeFalsy();
        expect(app.useRouter).toBeUndefined();
    });
    it('static_create.invoke_constructor', () => {
        let app = AppContainer.create({ use: undefined } as any);
        expect(app instanceof AppContainer).toBeTruthy();
    });
    it('build.verify_BuiltInMiddlewares_are_registered', () => {
        let app = new AppContainer({} as any);
        let obj: IDinoContainer = {} as IDinoContainer;
        let exists = false;
        spyOn(DinoContainer, 'create').and.callFake(config => obj);
        obj.builtInRequestStartMiddleware = m => {
            if (m.name === DinoStartMiddleware.name) exists = true;
        };
        obj.builtInRequestEndMiddleware = m => {
            if (m.name === ResponseEndMiddleware.name) exists = true;
        };
        obj.builtInErrorMiddleware = m => {
            if (m.name === RouteExceptionMiddleware.name) exists = true;
        };
        spyOn(obj, 'builtInRequestStartMiddleware').and.callThrough();
        app.build();
        expect(exists).toBeTruthy();
    });
    it('build.verify_TaskContextMiddleware_not_registered_when_enableTaskContext_is_false', () => {
        let app = new AppContainer({} as any);
        app.enableTaskContext = false;
        let obj: IDinoContainer = {} as IDinoContainer;
        let exists = false;
        spyOn(DinoContainer, 'create').and.callFake(config => obj);
        obj.builtInRequestStartMiddleware = m => {
            if (m.name === TaskContextMiddleware.name) exists = true;
        };
        obj.builtInRequestEndMiddleware = x => null;
        obj.builtInErrorMiddleware = x => null;
        spyOn(obj, 'builtInRequestStartMiddleware').and.callThrough();
        app.build();
        expect(exists).toBeFalsy();
    });
    it('build.verify_TaskContextMiddleware_is_registered_when_enableTaskContext_is_true', () => {
        let app = new AppContainer({} as any);
        app.enableTaskContext = true;
        let obj: IDinoContainer = {} as IDinoContainer;
        let exists = false;
        spyOn(DinoContainer, 'create').and.callFake(() => obj);
        obj.builtInRequestStartMiddleware = m => {
            if (m.name === TaskContextMiddleware.name) exists = true;
        };
        obj.builtInRequestEndMiddleware = x => null;
        obj.builtInErrorMiddleware = x => null;
        spyOn(obj, 'builtInRequestStartMiddleware').and.callThrough();
        app.build();
        expect(exists).toBeTruthy();
    });
    it('build.verify_RouteNotFoundMiddleware_is_registered_when_routeNotFoundMiddleware_exists', () => {
        let app = new AppContainer({} as any);
        app.routeNotFoundMiddleware = RouteNotFoundMiddleware;
        let obj: IDinoContainer = {
            builtInRequestStartMiddleware: x => null,
            builtInRequestEndMiddleware: x => null,
            builtInErrorMiddleware: x => null
        } as IDinoContainer;
        let exists = false;
        spyOn(DinoContainer, 'create').and.callFake(() => obj);
        obj.routeNotFoundMiddleware = m => {
            if (m.name === RouteNotFoundMiddleware.name) exists = true;
        };
        spyOn(obj, 'routeNotFoundMiddleware').and.callThrough();
        app.build();
        expect(exists).toBeTruthy();
    });
    it('build.RouteNotFoundMiddleware_is_not_registered_when_routeNotFoundMiddleware_undefined', () => {
        let app = new AppContainer({} as any);
        app.routeNotFoundMiddleware = undefined;
        let obj: IDinoContainer = {
            builtInRequestStartMiddleware: x => null,
            builtInRequestEndMiddleware: x => null,
            builtInErrorMiddleware: x => null
        } as IDinoContainer;
        let exists = false;
        spyOn(DinoContainer, 'create').and.callFake(() => obj);
        obj.routeNotFoundMiddleware = m => {
            if (m.name === RouteNotFoundMiddleware.name) exists = true;
        };
        spyOn(obj, 'routeNotFoundMiddleware').and.callThrough();
        app.build();
        expect(exists).toBeFalsy();
    });
    it('build.ErrorController_is_not_registered_when_errorController_is_undefined', () => {
        let app = new AppContainer({} as any);
        app.errorController = undefined;
        let obj: IDinoContainer = {
            builtInRequestStartMiddleware: x => null,
            routeNotFoundMiddleware: x => null,
            builtInRequestEndMiddleware: x => null,
            builtInErrorMiddleware: x => null
        } as IDinoContainer;
        let exists = false;
        spyOn(DinoContainer, 'create').and.callFake(() => obj);
        obj.registerErrorController = m => {
            if (m.name === String.name) exists = true;
        };
        spyOn(obj, 'registerErrorController').and.callThrough();
        app.build();
        expect(exists).toBeFalsy();
    });
    it('build.ErrorController_is_registered_when_errorController_is_defined', () => {
        let app = new AppContainer({} as any);
        app.errorController = String;
        let obj: IDinoContainer = {
            builtInRequestStartMiddleware: x => null,
            routeNotFoundMiddleware: x => null,
            builtInRequestEndMiddleware: x => null,
            builtInErrorMiddleware: x => null
        } as IDinoContainer;
        let exists = false;
        spyOn(DinoContainer, 'create').and.callFake(() => obj);
        obj.registerErrorController = m => {
            if (m.name === String.name) exists = true;
        };
        spyOn(obj, 'registerErrorController').and.callThrough();
        app.build();
        expect(exists).toBeTruthy();
    });
    it('create.verify_method_invocation_order_and_values', () => {
        let app = new AppContainer({} as any);
        app.enableTaskContext = true;
        app.errorController = String;
        app.routeNotFoundMiddleware = RouteNotFoundMiddleware;
        app.errorController = Number;
        app.startMiddleware = [String, Number];
        app.controllers = [Function, Number];
        app.endMiddleware = [Array, Function];
        app.errorMiddleware = [Boolean, String];
        app.appStartMiddleware = [Array, String];

        let obj: IDinoContainer = {} as IDinoContainer;
        let builtInRequestStart = [];
        let builtInRequestEnd = [];
        let builtInError = [];
        let requestStart = [];
        let appStart = [];
        let controllers = [];
        let requestEnd = [];
        let errorMiddleware = [];
        let methodOrder: any = {};
        let i = 0;

        spyOn(DinoContainer, 'create').and.callFake(() => obj);

        obj.builtInRequestStartMiddleware = m => {
            if (DataUtility.isUndefined(methodOrder.builtInRequestStartMiddleWare)) {
                methodOrder.builtInRequestStartMiddleWare = ++i;
            }
            builtInRequestStart.push(m.name);
        };
        obj.builtInRequestEndMiddleware = m => {
            if (DataUtility.isUndefined(methodOrder.builtInRequestEndMiddleWare)) {
                methodOrder.builtInRequestEndMiddleWare = ++i;
            }
            builtInRequestEnd.push(m.name);
        };
        obj.builtInErrorMiddleware = m => {
            if (DataUtility.isUndefined(methodOrder.builtInErrorMiddleWare)) {
                methodOrder.builtInErrorMiddleWare = ++i;
            }
            builtInError.push(m.name);
        };
        obj.routeNotFoundMiddleware = m => {
            if (DataUtility.isUndefined(methodOrder.routeNotFoundMiddleware)) {
                methodOrder.routeNotFoundMiddleware = ++i;
            }
            expect(m.name).toEqual(RouteNotFoundMiddleware.name);
        };
        obj.requestStartMiddleware = m => {
            if (DataUtility.isUndefined(methodOrder.requestStartMiddleWare)) {
                methodOrder.requestStartMiddleWare = ++i;
            }
            requestStart.push(m.name);
        };
        obj.registerController = m => {
            if (DataUtility.isUndefined(methodOrder.registerController)) {
                methodOrder.registerController = ++i;
            }
            controllers.push(m.name);
        };
        obj.requestEndMiddleware = m => {
            if (DataUtility.isUndefined(methodOrder.requestEndMiddleWare)) {
                methodOrder.requestEndMiddleWare = ++i;
            }
            requestEnd.push(m.name);
        };
        obj.registerErrorMiddleware = m => {
            if (DataUtility.isUndefined(methodOrder.registerErrorMiddleWare)) {
                methodOrder.registerErrorMiddleWare = ++i;
            }
            errorMiddleware.push(m.name);
        };
        obj.registerErrorController = m => {
            if (DataUtility.isUndefined(methodOrder.registerErrorController)) {
                methodOrder.registerErrorController = ++i;
            }
            expect(m.name).toEqual(Number.name);
        };
        obj.appStartMiddleware = m => {
            if (DataUtility.isUndefined(methodOrder.appStartMiddleware)) {
                methodOrder.appStartMiddleware = ++i;
            }
            appStart.push(m.name);
        };

        spyOn(obj, 'builtInRequestStartMiddleware').and.callThrough();
        spyOn(obj, 'builtInRequestEndMiddleware').and.callThrough();
        spyOn(obj, 'builtInErrorMiddleware').and.callThrough();
        spyOn(obj, 'routeNotFoundMiddleware').and.callThrough();
        spyOn(obj, 'requestStartMiddleware').and.callThrough();
        spyOn(obj, 'registerController').and.callThrough();
        spyOn(obj, 'requestEndMiddleware').and.callThrough();
        spyOn(obj, 'registerErrorMiddleware').and.callThrough();
        spyOn(obj, 'registerErrorController').and.callThrough();
        spyOn(obj, 'appStartMiddleware').and.callThrough();
        app.build();

        // Verifies the order of registration of middlewares
        expect(methodOrder.builtInRequestStartMiddleWare).toBe(1);
        expect(methodOrder.routeNotFoundMiddleware).toBe(2);
        expect(methodOrder.requestStartMiddleWare).toBe(3);
        expect(methodOrder.registerController).toBe(4);
        expect(methodOrder.requestEndMiddleWare).toBe(5);
        expect(methodOrder.builtInRequestEndMiddleWare).toBe(6);
        expect(methodOrder.registerErrorMiddleWare).toBe(7);
        expect(methodOrder.builtInErrorMiddleWare).toBe(8);
        expect(methodOrder.registerErrorController).toBe(9);
        expect(methodOrder.appStartMiddleware).toBe(10);
        // Verifies whether middlewares are registered exactly
        expect(builtInRequestStart[0]).toBe(DinoStartMiddleware.name);
        expect(builtInRequestStart.includes(TaskContextMiddleware.name)).toBeTruthy();
        expect(builtInRequestEnd.includes(HttpResponseMessageMiddleware.name)).toBeTruthy();
        expect(builtInRequestEnd[builtInRequestEnd.length - 1]).toBe(ResponseEndMiddleware.name);
        expect(builtInError[0]).toBe(RouteExceptionMiddleware.name);
        expect(builtInError.includes(HttpResponseExceptionMiddleware.name)).toBeTruthy();
        expect(builtInError.includes(ActionParamExceptionMiddleware.name)).toBeTruthy();
        expect(requestStart.includes(app.startMiddleware[0].name)).toBeTruthy();
        expect(requestStart.includes(app.startMiddleware[1].name)).toBeTruthy();
        expect(controllers.includes(app.controllers[0].name)).toBeTruthy();
        expect(controllers.includes(app.controllers[1].name)).toBeTruthy();
        expect(requestEnd.includes(app.endMiddleware[0].name)).toBeTruthy();
        expect(requestEnd.includes(app.endMiddleware[1].name)).toBeTruthy();
        expect(errorMiddleware.includes(app.errorMiddleware[0].name)).toBeTruthy();
        expect(errorMiddleware.includes(app.errorMiddleware[1].name)).toBeTruthy();
        expect(appStart.includes(app.appStartMiddleware[0].name)).toBeTruthy();
        expect(appStart.includes(app.appStartMiddleware[1].name)).toBeTruthy();
    });
});
