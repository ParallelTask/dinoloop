import {
    DinoContainer,
    IDinoContainerConfig,
    DIContainer,
    RouteTable,
    ObjectUtility,
    DinoUtility,
    Attribute,
    Reflector,
    DataUtility,
    IControllerAttributeExtended,
    DinoRouter,
    IControllerAttributeProvider,
    RouteAttribute,
    IActionMethodAttribute
} from '../../index';

describe('modules.core.dino.container.two.spec', () => {
    it('populateControllerMiddlewares.metadata_undefined', () => {
        let config: IDinoContainerConfig = {} as any;

        spyOn(ObjectUtility, 'getPrototypeOf').and.callFake(() => undefined);
        spyOn(Reflector, 'getMetadata').and.callFake(() => undefined);
        spyOn(DataUtility, 'isUndefinedOrNull').and.callFake(() => true);
        spyOn(DIContainer, 'create').and.callFake(() => undefined);
        spyOn(RouteTable, 'create').and.callFake(() => undefined);

        let dinoContainer = new DinoContainer(config);
        let obj = dinoContainer
            .populateControllerMiddlewares({} as any);
        expect(obj.use).toEqual([]);
        expect(obj.middlewares).toEqual([]);
        expect(obj.beforeActionFilters).toEqual([]);
        expect(obj.afterActionFilters).toEqual([]);
        expect(obj.result).toEqual([]);
        expect(obj.exceptions).toEqual([]);
        expect(obj.prefix).toBe('');
    });
    it('populateControllerMiddlewares.metadata_defined_without_inheritance_prefix_""', () => {
        let inheritanceOrder = 1;
        let config: IDinoContainerConfig = {} as any;
        let meta: IControllerAttributeExtended = {
            use: [Function, String],
            middlewares: [Object, Array],
            filters: [Number, Boolean],
            result: [String, Number],
            exceptions: [Boolean, Object],
            prefix: ''
        };

        spyOn(ObjectUtility, 'getPrototypeOf').and.callFake(() => undefined);
        spyOn(DIContainer, 'create').and.callFake(() => undefined);
        spyOn(RouteTable, 'create').and.callFake(() => undefined);
        spyOn(Reflector, 'getMetadata').and.callFake(() => meta);
        spyOn(Reflector, 'getOwnMetadata').and.callFake(() => undefined);
        spyOn(DataUtility, 'isUndefinedOrNull').and.callFake(() => {
            if (inheritanceOrder > 1) return true;
            inheritanceOrder++;

            return false;
        });

        let dinoContainer = new DinoContainer(config);
        let obj = dinoContainer.populateControllerMiddlewares({} as any);

        expect(obj.prefix).toBe('');

        // order matters so we have to test for indices
        expect(obj.use[0]).toBe(Function);
        expect(obj.use[1]).toBe(String);
        expect(obj.middlewares[0]).toBe(Object);
        expect(obj.middlewares[1]).toBe(Array);
        expect(obj.beforeActionFilters[0]).toBe(Number);
        expect(obj.beforeActionFilters[1]).toBe(Boolean);
        expect(obj.afterActionFilters[0]).toBe(Number);
        expect(obj.afterActionFilters[1]).toBe(Boolean);
        expect(obj.result[0]).toBe(String);
        expect(obj.result[1]).toBe(Number);
        expect(obj.exceptions[0]).toBe(Boolean);
        expect(obj.exceptions[1]).toBe(Object);
    });
    it('populateControllerMiddlewares.metadata_defined_without_inheritance_prefix_test', () => {
        let inheritanceOrder = 0;
        let config: IDinoContainerConfig = {} as any;
        let meta: IControllerAttributeExtended = {
            use: [Function, String],
            middlewares: [Object, Array],
            filters: [Number, Boolean],
            result: [String, Number],
            exceptions: [Boolean, Object],
            prefix: 'test'
        };

        spyOn(ObjectUtility, 'getPrototypeOf').and.callFake(() => undefined);
        spyOn(DIContainer, 'create').and.callFake(() => undefined);
        spyOn(RouteTable, 'create').and.callFake(() => undefined);
        spyOn(Reflector, 'getMetadata').and.callFake(() => meta);
        spyOn(Reflector, 'getOwnMetadata').and.callFake(() => meta);
        spyOn(DataUtility, 'isUndefinedOrNull').and.callFake(() => {
            if (inheritanceOrder > 0) return true;
            inheritanceOrder++;

            return false;
        });

        let dinoContainer = new DinoContainer(config);
        let obj = dinoContainer
            .populateControllerMiddlewares({} as any);
        expect(obj.prefix).toBe('test');

        // order matters so we have to test for indices
        expect(obj.use[0]).toBe(Function);
        expect(obj.use[1]).toBe(String);
        expect(obj.middlewares[0]).toBe(Object);
        expect(obj.middlewares[1]).toBe(Array);
        expect(obj.beforeActionFilters[0]).toBe(Number);
        expect(obj.beforeActionFilters[1]).toBe(Boolean);
        expect(obj.afterActionFilters[0]).toBe(Number);
        expect(obj.afterActionFilters[1]).toBe(Boolean);
        expect(obj.result[0]).toBe(String);
        expect(obj.result[1]).toBe(Number);
        expect(obj.exceptions[0]).toBe(Boolean);
        expect(obj.exceptions[1]).toBe(Object);
    });
    it('populateControllerMiddlewares.metadata_defined_with_inheritance_level_one', () => {
        let inheritanceOrder = 0;
        let config: IDinoContainerConfig = {} as any;
        let child: IControllerAttributeExtended = {
            use: [Function, String],
            middlewares: [Object, Array],
            filters: [Number, Boolean],
            result: [String, Number],
            exceptions: [Boolean, Object],
            prefix: '/test'
        };
        let base: IControllerAttributeExtended = {
            use: [Object, Number],
            middlewares: [Function, Boolean],
            filters: [Array, String],
            result: [Object, Array],
            exceptions: [Number, Function],
            prefix: '/tester/meta'
        };

        spyOn(ObjectUtility, 'getPrototypeOf').and.callFake(() => undefined);
        spyOn(DIContainer, 'create').and.callFake(() => undefined);
        spyOn(RouteTable, 'create').and.callFake(() => undefined);
        spyOn(Reflector, 'getMetadata').and.callFake(() => child);
        spyOn(Reflector, 'getOwnMetadata').and.callFake(() => base);
        spyOn(DataUtility, 'isUndefinedOrNull').and.callFake(() => {
            if (inheritanceOrder > 1) return true;
            inheritanceOrder++;

            return false;
        });

        let dinoContainer = new DinoContainer(config);
        let obj = dinoContainer.populateControllerMiddlewares({} as any);

        expect(obj.prefix).toBe(`${base.prefix}${child.prefix}`);

        // order matters so we have to test for indices
        // for .use, base => child
        expect(obj.use[0]).toBe(Object);
        expect(obj.use[1]).toBe(Number);
        expect(obj.use[2]).toBe(Function);
        expect(obj.use[3]).toBe(String);
        // for middlwares, base => child
        expect(obj.middlewares[0]).toBe(Function);
        expect(obj.middlewares[1]).toBe(Boolean);
        expect(obj.middlewares[2]).toBe(Object);
        expect(obj.middlewares[3]).toBe(Array);
        // for beforeFilters, base => child
        expect(obj.beforeActionFilters[0]).toBe(Array);
        expect(obj.beforeActionFilters[1]).toBe(String);
        expect(obj.beforeActionFilters[2]).toBe(Number);
        expect(obj.beforeActionFilters[3]).toBe(Boolean);
        // for afterFilters, child => base
        expect(obj.afterActionFilters[0]).toBe(Number);
        expect(obj.afterActionFilters[1]).toBe(Boolean);
        expect(obj.afterActionFilters[2]).toBe(Array);
        expect(obj.afterActionFilters[3]).toBe(String);
        // for resultFilters, child => base
        expect(obj.result[0]).toBe(String);
        expect(obj.result[1]).toBe(Number);
        expect(obj.result[2]).toBe(Object);
        expect(obj.result[3]).toBe(Array);
        // for exceptions, child => base
        expect(obj.exceptions[0]).toBe(Boolean);
        expect(obj.exceptions[1]).toBe(Object);
        expect(obj.exceptions[2]).toBe(Number);
        expect(obj.exceptions[3]).toBe(Function);
    });
    it('populateControllerMiddlewares.metadata_defined_with_inheritance_level_two', () => {
        let inheritanceOrder = 0;
        let config: IDinoContainerConfig = {} as any;
        let child: IControllerAttributeExtended = {
            use: [Function, String],
            middlewares: [Array],
            filters: [Number, Boolean],
            result: [String, Number],
            exceptions: [Boolean],
            prefix: '/test'
        };
        let base: IControllerAttributeExtended = {
            use: [Object, Number],
            middlewares: [Function, Boolean],
            filters: [Array],
            result: [Object, Array],
            exceptions: [Number, Function],
            prefix: '/tester/meta'
        };
        let superbase: IControllerAttributeExtended = {
            use: [Boolean, Array],
            middlewares: [Number, String],
            filters: [Function, Object],
            result: [Function],
            exceptions: [Array, String],
            prefix: ''
        };

        spyOn(ObjectUtility, 'getPrototypeOf').and.callFake(() => undefined);
        spyOn(DIContainer, 'create').and.callFake(() => undefined);
        spyOn(RouteTable, 'create').and.callFake(() => undefined);
        spyOn(Reflector, 'getMetadata').and.callFake(() => child);
        spyOn(Reflector, 'getOwnMetadata').and.callFake(() => {
            if (inheritanceOrder === 1) return base;
            if (inheritanceOrder === 2) return superbase;
        });
        spyOn(DataUtility, 'isUndefinedOrNull').and.callFake(() => {
            if (inheritanceOrder > 2) return true;
            inheritanceOrder++;

            return false;
        });

        let dinoContainer = new DinoContainer(config);
        let obj = dinoContainer
            .populateControllerMiddlewares({} as any);
        expect(obj.prefix).toBe(`${superbase.prefix}${base.prefix}${child.prefix}`);

        // order matters so we have to test for indices
        // for .use, superbase => base => child
        expect(obj.use[0]).toBe(Boolean);
        expect(obj.use[1]).toBe(Array);
        expect(obj.use[2]).toBe(Object);
        expect(obj.use[3]).toBe(Number);
        expect(obj.use[4]).toBe(Function);
        expect(obj.use[5]).toBe(String);
        // for middlwares, superbase => base => child
        expect(obj.middlewares[0]).toBe(Number);
        expect(obj.middlewares[1]).toBe(String);
        expect(obj.middlewares[2]).toBe(Function);
        expect(obj.middlewares[3]).toBe(Boolean);
        expect(obj.middlewares[4]).toBe(Array);
        // for beforeFilters, superbase => base => child
        expect(obj.beforeActionFilters[0]).toBe(Function);
        expect(obj.beforeActionFilters[1]).toBe(Object);
        expect(obj.beforeActionFilters[2]).toBe(Array);
        expect(obj.beforeActionFilters[3]).toBe(Number);
        expect(obj.beforeActionFilters[4]).toBe(Boolean);
        // for afterFilters, child => base => superbase
        expect(obj.afterActionFilters[0]).toBe(Number);
        expect(obj.afterActionFilters[1]).toBe(Boolean);
        expect(obj.afterActionFilters[2]).toBe(Array);
        expect(obj.afterActionFilters[3]).toBe(Function);
        expect(obj.afterActionFilters[4]).toBe(Object);
        // for resultFilters, child => base => superbase
        expect(obj.result[0]).toBe(String);
        expect(obj.result[1]).toBe(Number);
        expect(obj.result[2]).toBe(Object);
        expect(obj.result[3]).toBe(Array);
        expect(obj.result[4]).toBe(Function);
        // for exceptions, child => base => superbase
        expect(obj.exceptions[0]).toBe(Boolean);
        expect(obj.exceptions[1]).toBe(Number);
        expect(obj.exceptions[2]).toBe(Function);
        expect(obj.exceptions[3]).toBe(Array);
        expect(obj.exceptions[4]).toBe(String);
    });
    it('registerController.when_not_Apicontroller', () => {
        let config: IDinoContainerConfig = {} as any;

        spyOn(DinoUtility, 'isApiController').and.callFake(() => false);
        let dinoContainer = new DinoContainer(config);
        let obj = dinoContainer
            .registerController({} as any);
        expect(DinoUtility.isApiController).toHaveBeenCalledTimes(1);
    });
    it('registerController.when_Apicontroller_but_metadata_undefined', () => {
        let config: IDinoContainerConfig = {} as any;

        spyOn(DinoUtility, 'isApiController').and.callFake(() => true);
        spyOn(DIContainer, 'create').and.callFake(() => undefined);
        spyOn(RouteTable, 'create').and.callFake(() => undefined);
        spyOn(ObjectUtility, 'create').and.callFake(() => undefined);
        spyOn(Reflector, 'hasMetadata').and.callFake(() => false);

        let dinoContainer = new DinoContainer(config);

        let obj = dinoContainer
            .registerController({} as any);
        expect(Reflector.hasMetadata).toHaveBeenCalledTimes(1);
    });
    it('registerController.when_Apicontroller_metadata_defined_and_no_actionMethods', () => {
        // Following test case validates middlewares, filters etc which is repetitive
        // and removed from other tests
        // do not delete this test case easily.
        let bindedRouterToApp = false;
        let expressWares = [];
        let mwares;
        let beforeFilters;
        let afterFilters;
        let results;
        let exwares;
        let meta: IControllerAttributeProvider = {
            use: [Function, String],
            middlewares: [Array],
            beforeActionFilters: [Number, Boolean],
            afterActionFilters: [],
            result: [String, Number],
            exceptions: [Boolean],
            prefix: '/test'
        };
        let config: IDinoContainerConfig = {
            baseUri: '/api',
            app: {
                use: (uri, router) => {
                    expect(uri).toBe(`${config.baseUri}${meta.prefix}`);
                    bindedRouterToApp = true;
                }
            }
        } as any;
        let dinoRouter = {
            expressRouter: () => {
                return {
                    use: mware => expressWares.push(mware)
                };
            },
            registerMiddlewares: mware => mwares = mware,
            registerBeginActionFilters: mware => beforeFilters = mware,
            registerAfterActionFilters: mware => afterFilters = mware,
            registerResultFilters: mware => results = mware,
            registerExceptionFilters: (app, uri, mware) => {
                expect(uri).toBe(`${config.baseUri}${meta.prefix}`);
                expect(app).toBe(config.app);
                exwares = mware;
            }
        };

        spyOn(DinoUtility, 'isApiController').and.callFake(() => true);
        spyOn(DIContainer, 'create').and.callFake(() => undefined);
        spyOn(RouteTable, 'create').and.callFake(() => undefined);
        spyOn(ObjectUtility, 'create').and.callFake(() => { });
        spyOn(Reflector, 'hasMetadata').and.callFake(() => true);
        spyOn(DinoRouter, 'create').and.callFake(() => dinoRouter);
        spyOn(DinoUtility, 'getControllerProperties').and.callFake(() => []);

        let dinoContainer = new DinoContainer(config);
        spyOn(dinoContainer, 'populateControllerMiddlewares').and.callFake(() => meta);
        let obj = dinoContainer.registerController({} as any);

        expect(expressWares[0]).toBe(Function);
        expect(expressWares[1]).toBe(String);
        expect(mwares).toBe(meta.middlewares);
        expect(beforeFilters).toBe(meta.beforeActionFilters);
        expect(afterFilters).toBe(meta.afterActionFilters);
        expect(results).toBe(meta.result);
        expect(exwares).toBe(meta.exceptions);
        expect(bindedRouterToApp).toBeTruthy();
    });
    it('registerController.when_Apicontroller_metadata_defined_and_actionMethod_is_sync', () => {
        let controllerType = Object;
        let meta: IControllerAttributeProvider = { prefix: '/test', use: [] };
        let routeAttr;
        let callback;
        let router: any = { use: mware => undefined };
        let patch;
        let invoked;
        let actionMeta: IActionMethodAttribute = {
            isAsync: false,
            httpVerb: 'get',
            route: 'test',
            sendsResponse: false
        };
        let fakeRouteTable = RouteTable.create();
        router[actionMeta.httpVerb] = (route, cb) => {
            expect(route).toBe(actionMeta.route);
            callback = cb;
        };
        let dinoRouter = {
            expressRouter: () => router,
            registerMiddlewares: mware => undefined,
            registerBeginActionFilters: mware => undefined,
            registerAfterActionFilters: mware => undefined,
            registerResultFilters: mware => undefined,
            registerExceptionFilters: (app, uri, mware) => undefined
        };
        let config: IDinoContainerConfig = {
            app: { use: (uri, router) => undefined }
        } as any;

        spyOn(DinoUtility, 'isApiController').and.callFake(() => true);
        spyOn(ObjectUtility, 'keys').and.callFake(o => {
            routeAttr = o;

            return ['post'];
        });
        spyOn(ObjectUtility, 'create').and.callFake(() => {
            // set some fake properties to loop through
            return { get: () => undefined };
        });
        spyOn(Reflector, 'hasMetadata').and.callFake(() => true);
        spyOn(DinoRouter, 'create').and.callFake(() => dinoRouter);
        spyOn(DIContainer, 'create').and.callFake(() => undefined);
        spyOn(RouteTable, 'create').and.callFake(() => fakeRouteTable);
        spyOn(DinoUtility, 'getControllerProperties').and.callFake(() => ['test']);

        let dinoContainer = new DinoContainer(config);
        spyOn(dinoContainer, 'populateControllerMiddlewares').and.callFake(() => meta);
        spyOn(dinoContainer, 'getActionMethodMetadata').and.callFake(() => actionMeta);
        spyOn(dinoContainer, 'setUpDinoController')
            .and.callFake((type, action: IActionMethodAttribute, res) => {
                expect(type).toBe(controllerType);
                expect(action.sendsResponse).toBe(actionMeta.sendsResponse);
                expect(res).toEqual({ dino: true });

                return {
                    patch: (req, res, next) => {
                        expect(req).toEqual({ req: true });
                        expect(res).toEqual({ dino: true });
                        expect(next()).toBe('invoke');
                        patch = true;
                    },
                    invoke: action => invoked = true
                };
            });

        let obj = dinoContainer.registerController(controllerType);

        expect(routeAttr).toBe(RouteAttribute);
        callback({ req: true }, { dino: true }, () => 'invoke');
        expect(patch).toBeTruthy();
        expect(invoked).toBeTruthy();
        expect(fakeRouteTable.getRoutes().length).toBe(1);
    });
    it('registerController.verify_register_middlewares_filters_etc_for_Apicontroller', () => {
        let invokeOrder = 0;
        let methodOrder: any = {};
        let controllerType = Object;
        let meta: IControllerAttributeProvider = { prefix: '/test', use: [Function] };
        let router: any = { use: m => methodOrder.routerUse = ++invokeOrder };
        let actionMeta: IActionMethodAttribute = {
            isAsync: false,
            httpVerb: 'get'
        } as any;
        let callback;
        let fakeRouteTable = RouteTable.create();
        router[actionMeta.httpVerb] = (route, cb) => {
            methodOrder.routerAction = ++invokeOrder;
            callback = cb;
        };
        let dinoRouter = {
            expressRouter: () => router,
            registerMiddlewares: m => methodOrder.middlewares = ++invokeOrder,
            registerBeginActionFilters: m => methodOrder.beginFilters = ++invokeOrder,
            registerAfterActionFilters: m => methodOrder.afterFilters = ++invokeOrder,
            registerResultFilters: m => methodOrder.resultFilters = ++invokeOrder,
            registerExceptionFilters: (app, uri, mware) => methodOrder.exceptionFilters = ++invokeOrder
        };
        let config: IDinoContainerConfig = {
            app: { use: (uri, router) => methodOrder.appUse = ++invokeOrder }
        } as any;

        spyOn(DinoUtility, 'isApiController').and.callFake(() => true);
        spyOn(Reflector, 'hasMetadata').and.callFake(() => true);
        spyOn(ObjectUtility, 'keys').and.callFake(() => ['post']);
        spyOn(ObjectUtility, 'create').and.callFake(() => {
            // set some fake properties to loop through
            return { get: () => undefined };
        });
        spyOn(DinoRouter, 'create').and.callFake(() => dinoRouter);
        spyOn(DIContainer, 'create').and.callFake(() => undefined);
        spyOn(RouteTable, 'create').and.callFake(() => fakeRouteTable);
        spyOn(DinoUtility, 'getControllerProperties').and.callFake(() => ['test']);

        let dinoContainer = new DinoContainer(config);
        spyOn(dinoContainer, 'populateControllerMiddlewares').and.callFake(() => meta);
        spyOn(dinoContainer, 'getActionMethodMetadata').and.callFake(() => actionMeta);
        spyOn(dinoContainer, 'setUpDinoController')
            .and.callFake((type, sendsResponse, bindsModel, res) => {

                return {
                    patch: (req, res, next) => undefined,
                    invoke: (action, verb, route) => undefined
                };
            });

        let obj = dinoContainer.registerController(controllerType);
        callback({ req: true }, { dino: true }, () => 'invoke');

        expect(methodOrder.routerUse).toBe(1);
        expect(methodOrder.middlewares).toBe(2);
        expect(methodOrder.beginFilters).toBe(3);
        expect(methodOrder.routerAction).toBe(4);
        expect(methodOrder.afterFilters).toBe(5);
        expect(methodOrder.resultFilters).toBe(6);
        expect(methodOrder.appUse).toBe(7);
        expect(methodOrder.exceptionFilters).toBe(8);
    });
    it('registerController.when_Apicontroller_metadata_defined_and_actionMethod_is_Async', async () => {
        let controllerType = Object;
        let meta: IControllerAttributeProvider = { prefix: '/test', use: [] };
        let routeAttr;
        let callback;
        let router: any = { use: mware => undefined };
        let patch;
        let invoked;
        let actionMeta: IActionMethodAttribute = {
            isAsync: true,
            httpVerb: 'get',
            route: 'test',
            sendsResponse: false
        };
        let fakeRouteTable = RouteTable.create();
        router[actionMeta.httpVerb] = (route, cb) => {
            expect(route).toBe(actionMeta.route);
            callback = cb;
        };
        let dinoRouter = {
            expressRouter: () => router,
            registerMiddlewares: mware => undefined,
            registerBeginActionFilters: mware => undefined,
            registerAfterActionFilters: mware => undefined,
            registerResultFilters: mware => undefined,
            registerExceptionFilters: (app, uri, mware) => undefined
        };
        let config: IDinoContainerConfig = {
            app: { use: (uri, router) => undefined }
        } as any;

        spyOn(DinoUtility, 'isApiController').and.callFake(() => true);
        spyOn(ObjectUtility, 'keys').and.callFake(o => {
            routeAttr = o;

            return ['post'];
        });
        spyOn(DIContainer, 'create').and.callFake(() => undefined);
        spyOn(RouteTable, 'create').and.callFake(() => fakeRouteTable);
        spyOn(ObjectUtility, 'create').and.callFake(() => {
            return { get: () => undefined };
        });
        spyOn(Reflector, 'hasMetadata').and.callFake(() => true);
        spyOn(DinoRouter, 'create').and.callFake(() => dinoRouter);
        spyOn(DinoUtility, 'getControllerProperties').and.callFake(() => ['test']);

        let dinoContainer = new DinoContainer(config);
        spyOn(dinoContainer, 'populateControllerMiddlewares').and.callFake(() => meta);
        spyOn(dinoContainer, 'getActionMethodMetadata').and.callFake(() => actionMeta);
        spyOn(dinoContainer, 'setUpDinoController')
            .and.callFake((type, action: IActionMethodAttribute, res) => {
                expect(type).toBe(controllerType);
                expect(action.sendsResponse).toBe(actionMeta.sendsResponse);
                expect(res).toEqual({ dino: true });

                return {
                    patch: (req, res, next) => {
                        expect(req).toEqual({ req: true });
                        expect(res).toEqual({ dino: true });
                        expect(next()).toBe('invoke');
                        patch = true;
                    },
                    invokeAsync: action => invoked = true
                };
            });

        let obj = dinoContainer.registerController(controllerType);

        expect(routeAttr).toBe(RouteAttribute);
        await callback({ req: true }, { dino: true }, () => 'invoke');
        expect(patch).toBeTruthy();
        expect(invoked).toBeTruthy();
        expect(fakeRouteTable.getRoutes().length).toBe(1);
    });
    it('getActionMethodMetadata.when_Attribute.parse_is_undefined', async () => {

        let returns = { hello: 'world' };
        let config: IDinoContainerConfig = { raiseModelError: true } as any;

        spyOn(Reflector, 'getMetadata').and.callFake(ob => {
            if (ob === Attribute.httpGet) return '/route';
            if (ob === Attribute.returns) return returns;
        });
        spyOn(Reflector, 'hasMetadata').and.callFake(ob => {
            if (ob === Attribute.asyncAttr) return true;
            if (ob === Attribute.sendsResponse) return false;
        });
        spyOn(DataUtility, 'isUndefinedOrNull').and.callFake(() => true);
        spyOn(DIContainer, 'create').and.callFake(() => undefined);
        spyOn(RouteTable, 'create').and.callFake(() => undefined);

        let dinoContainer = new DinoContainer(config);
        let obj = dinoContainer
            .getActionMethodMetadata(Attribute.httpGet, 'testAction', {} as any);

        expect(obj.isAsync).toBeTruthy();
        expect(obj.sendsResponse).toBeFalsy();
        expect(obj.route).toBe('/route');
        expect(obj.httpVerb).toBe(RouteAttribute.httpGet_ActionAttribute);
        expect(obj.actionArguments).toEqual([]);
        expect(obj.returns).toBe(returns);
    });
    it('getActionMethodMetadata.when_Attribute.parse_is_defined', async () => {
        let config: IDinoContainerConfig = { raiseModelError: true } as any;
        let testData = [{
            key: 'body',
            value: 'test'
        }];
        spyOn(Reflector, 'getMetadata').and.callFake(ob => {
            if (ob === Attribute.httpGet) return '/route';
            if (ob === Attribute.parse) return testData;
        });
        spyOn(Reflector, 'hasMetadata').and.callFake(ob => {
            if (ob === Attribute.asyncAttr) return true;
            if (ob === Attribute.sendsResponse) return false;
        });
        spyOn(DataUtility, 'isUndefinedOrNull').and.callFake(() => false);
        spyOn(DIContainer, 'create').and.callFake(() => undefined);
        spyOn(RouteTable, 'create').and.callFake(() => undefined);

        let dinoContainer = new DinoContainer(config);
        let obj = dinoContainer
            .getActionMethodMetadata(Attribute.httpGet, 'testAction', {} as any);
        expect(obj.isAsync).toBeTruthy();
        expect(obj.sendsResponse).toBeFalsy();
        expect(obj.route).toBe('/route');
        expect(obj.httpVerb).toBe(RouteAttribute.httpGet_ActionAttribute);
        expect(obj.actionArguments).toBe(testData);
        expect(obj.returns).toBeUndefined();
    });
});
