import {
    DinoContainer,
    IDinoContainerConfig,
    DIContainer,
    RouteTable,
    ObjectUtility,
    DinoUtility,
    RequestStartMiddleWare,
    IRouteTable,
    DinoErrorController,
    Attribute,
    ControllerAction,
    DinoController
} from '../../index';

describe('modules.core.dino.container.spec', () => {
    it('resolve.enableTaskContext_false', () => {
        let config: IDinoContainerConfig = { enableTaskContext: false } as any;
        spyOn(DIContainer, 'create').and.callFake((a, b) => {
            return {
                resolve: m => {
                    expect(m).toBe(String);

                    return 'resolved';
                }
            };
        });
        spyOn(RouteTable, 'create').and.callFake(() => null);
        spyOn(ObjectUtility, 'replaceObjectReferences').and.callFake((a, b, c) => null);

        let dinoContainer = new DinoContainer(config);
        let o = dinoContainer.resolve(String, { context: 'test' });

        // following expects are common for every constructor execution
        // do not delete these test case
        expect(RouteTable.create).toHaveBeenCalledTimes(1);
        expect(DIContainer.create).toHaveBeenCalledTimes(1);

        expect(o).toBe('resolved');
        expect(ObjectUtility.replaceObjectReferences).toHaveBeenCalledTimes(0);
    });
    it('resolve.enableTaskContext_true', () => {
        let config: IDinoContainerConfig = { enableTaskContext: true } as any;
        spyOn(DIContainer, 'create').and.callFake((a, b) => {
            return {
                resolve: m => {
                    expect(m).toBe(String);

                    return 'resolved';
                }
            };
        });
        spyOn(RouteTable, 'create').and.callFake(() => null);
        spyOn(ObjectUtility, 'replaceObjectReferences').and.callFake((a, b, c) => 'replaced');

        let dinoContainer = new DinoContainer(config);
        let o = dinoContainer.resolve(String, { context: 'test' });

        expect(o).toBe('replaced');
        expect(ObjectUtility.replaceObjectReferences).toHaveBeenCalledTimes(1);
    });
    it('static_create.invoke_constructor', () => {
        let config: IDinoContainerConfig = {} as any;
        spyOn(DIContainer, 'create').and.callFake((a, b) => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);

        let dinoContainer = DinoContainer.create(config);
        expect(dinoContainer instanceof DinoContainer).toBeTruthy();
    });
    it('routeNotFoundMiddleware.when_isSyncRequestStartMiddleware_true', () => {
        const _req = { req: 'uri' };
        const _res = { res: 'express' };
        const _next = () => null;

        class RoutNotFoundMiddlewareFake extends RequestStartMiddleWare {
            constructor(route: IRouteTable) {
                super();
                expect(route).toBeNull();
            }
            invoke(request: any, response: any, next: any): void {
                expect(request).toBe(_req);
                expect(response).toBe(_res);
                expect(next()).toBeNull();
            }
        }

        let callback;
        let config: IDinoContainerConfig = {
            baseUri: 'testuri',
            app: {
                use: (uri, cb) => {
                    expect(uri).toBe('testuri');
                    callback = cb;
                }
            }
        } as any;
        spyOn(DIContainer, 'create').and.callFake((a, b) => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);
        spyOn(DinoUtility, 'isSyncRequestStartMiddleware')
            .and.callFake(m => {
                expect(m).toBe(RoutNotFoundMiddlewareFake);

                return true;
            });

        let dinoContainer = new DinoContainer(config);
        dinoContainer.routeNotFoundMiddleware(RoutNotFoundMiddlewareFake);
        expect(DinoUtility.isSyncRequestStartMiddleware).toHaveBeenCalledTimes(1);
        callback(_req, _res, _next);
    });
    it('routeNotFoundMiddleware.when_isSyncRequestStartMiddleware_false', () => {
        let callback;
        let config: IDinoContainerConfig = {} as any;
        spyOn(DIContainer, 'create').and.callFake((a, b) => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);
        spyOn(DinoUtility, 'isSyncRequestStartMiddleware')
            .and.callFake(m => {
                expect(m).toBe(Function);

                return false;
            });

        let dinoContainer = new DinoContainer(config);
        dinoContainer.routeNotFoundMiddleware(Function);
        expect(callback).toBeUndefined();
        expect(DinoUtility.isSyncRequestStartMiddleware).toHaveBeenCalledTimes(1);
    });
    it('builtInRequestStartMiddleWare.when_isSyncRequestStartMiddleware_true', () => {
        const _req = { req: 'uri' };
        const _res = { res: 'express' };
        const _next = () => null;

        class RequestStartFake extends RequestStartMiddleWare {
            invoke(request: any, response: any, next: any): void {
                expect(request).toBe(_req);
                expect(response).toBe(_res);
                expect(next()).toBeNull();
            }
        }

        let callback;
        let config: IDinoContainerConfig = {
            baseUri: 'testuri',
            app: {
                use: (uri, cb) => {
                    expect(uri).toBe('testuri');
                    callback = cb;
                }
            }
        } as any;
        spyOn(DIContainer, 'create').and.callFake((a, b) => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);
        spyOn(DinoUtility, 'isSyncRequestStartMiddleware')
            .and.callFake(m => {
                expect(m).toBe(RequestStartFake);

                return true;
            });

        let dinoContainer = new DinoContainer(config);
        dinoContainer.builtInRequestStartMiddleWare(RequestStartFake);
        expect(DinoUtility.isSyncRequestStartMiddleware).toHaveBeenCalledTimes(1);
        callback(_req, _res, _next);
    });
    it('builtInRequestStartMiddleWare.when_isSyncRequestStartMiddleware_false', () => {
        let callback;
        let config: IDinoContainerConfig = {} as any;
        spyOn(DIContainer, 'create').and.callFake((a, b) => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);
        spyOn(DinoUtility, 'isSyncRequestStartMiddleware')
            .and.callFake(m => {
                expect(m).toBe(Function);

                return false;
            });

        let dinoContainer = new DinoContainer(config);
        dinoContainer.builtInRequestStartMiddleWare(Function);
        expect(callback).toBeUndefined();
        expect(DinoUtility.isSyncRequestStartMiddleware).toHaveBeenCalledTimes(1);
    });
    it('requestStartMiddleWare.when_isSyncRequestStartMiddleware', () => {
        let invoked = false;
        let callback;
        let request = { path: 'test' };
        let config: IDinoContainerConfig = {
            baseUri: 'testuri',
            app: {
                use: (uri, cb) => {
                    expect(uri).toBe('testuri');
                    callback = cb;
                }
            }
        } as any;
        let res = { locals: { dino: 45 } };
        spyOn(DIContainer, 'create').and.callFake((a, b) => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);
        spyOn(DinoUtility, 'isSyncRequestStartMiddleware').and.callFake(a => true);

        let dinoContainer = new DinoContainer(config);

        // Spy on the same object method itself
        spyOn(dinoContainer, 'resolve')
            .and.callFake((middleware, dino) => {
                expect(middleware).toBe(String);
                expect(dino).toBe(res.locals.dino);

                return {
                    invoke: (req, resp, next) => {
                        expect(req).toBe(request);
                        expect(resp).toBe(res);
                        expect(next()).toBe('invoked');
                        invoked = true;
                    }
                };
            });

        dinoContainer.requestStartMiddleWare(String);
        callback(request, res, () => 'invoked');
        expect(DinoUtility.isSyncRequestStartMiddleware).toHaveBeenCalledTimes(1);
        expect(dinoContainer.resolve).toHaveBeenCalledTimes(1);
        expect(invoked).toBeTruthy();
    });
    it('requestStartMiddleWare.when_isAsyncRequestStartMiddleware', async () => {
        let invoked = false;
        let callback;
        let request = { path: 'test' };
        let config: IDinoContainerConfig = {
            baseUri: 'testuri',
            app: {
                use: (uri, cb) => {
                    expect(uri).toBe('testuri');
                    callback = cb;
                }
            }
        } as any;
        let res = { locals: { dino: 45 } };
        spyOn(DinoUtility, 'isSyncRequestStartMiddleware').and.callFake(a => false);
        spyOn(DinoUtility, 'isAsyncRequestStartMiddleware').and.callFake(a => true);
        spyOn(DIContainer, 'create').and.callFake((a, b) => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);
        let dinoContainer = new DinoContainer(config);

        // Spy on the same object method itself
        spyOn(dinoContainer, 'resolve')
            .and.callFake((middleware, dino) => {
                expect(middleware).toBe(String);
                expect(dino).toBe(res.locals.dino);

                return {
                    invoke: (req, resp, next) => {
                        expect(req).toBe(request);
                        expect(resp).toBe(res);
                        expect(next()).toBe('invoked');
                        invoked = true;
                    }
                };
            });

        dinoContainer.requestStartMiddleWare(String);
        await callback(request, res, () => 'invoked');
        expect(DinoUtility.isSyncRequestStartMiddleware).toHaveBeenCalledTimes(1);
        expect(DinoUtility.isAsyncRequestStartMiddleware).toHaveBeenCalledTimes(1);
        expect(dinoContainer.resolve).toHaveBeenCalledTimes(1);
        expect(invoked).toBeTruthy();
    });
    it('requestStartMiddleWare.throwsError_when_isAsyncRequestStartMiddleware', async () => {
        let err;
        let callback;
        let request = { path: 'test' };
        let config: IDinoContainerConfig = {
            baseUri: 'testuri',
            app: {
                use: (uri, cb) => {
                    expect(uri).toBe('testuri');
                    callback = cb;
                }
            }
        } as any;
        let res = { locals: { dino: 45 } };
        spyOn(DinoUtility, 'isSyncRequestStartMiddleware').and.callFake(a => false);
        spyOn(DinoUtility, 'isAsyncRequestStartMiddleware').and.callFake(a => true);
        spyOn(DIContainer, 'create').and.callFake((a, b) => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);

        let dinoContainer = new DinoContainer(config);

        // Spy on the same object method itself
        spyOn(dinoContainer, 'resolve')
            .and.callFake((middleware, dino) => {
                expect(middleware).toBe(String);
                expect(dino).toBe(res.locals.dino);

                return {
                    invoke: (req, resp, next) => {
                        expect(req).toBe(request);
                        expect(resp).toBe(res);
                        throw new Error('TestError');
                    }
                };
            });

        dinoContainer.requestStartMiddleWare(String);
        await callback(request, res, e => err = e);
        expect(DinoUtility.isSyncRequestStartMiddleware).toHaveBeenCalledTimes(1);
        expect(DinoUtility.isAsyncRequestStartMiddleware).toHaveBeenCalledTimes(1);
        expect(dinoContainer.resolve).toHaveBeenCalledTimes(1);
        expect(err).toEqual(new Error('TestError'));
    });
    it('requestStartMiddleWare.when_not_a_RequestStartMiddleware', () => {
        let callback;
        let config: IDinoContainerConfig = {
            baseUri: 'testuri',
            app: {
                use: (uri, cb) => {
                    expect(uri).toBe('testuri');
                    callback = cb;
                }
            }
        } as any;
        spyOn(DinoUtility, 'isSyncRequestStartMiddleware').and.callFake(a => false);
        spyOn(DinoUtility, 'isAsyncRequestStartMiddleware').and.callFake(a => false);
        spyOn(DIContainer, 'create').and.callFake((a, b) => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);

        let dinoContainer = new DinoContainer(config);
        dinoContainer.requestStartMiddleWare(String);
        expect(callback).toBeUndefined();
        expect(DinoUtility.isSyncRequestStartMiddleware).toHaveBeenCalledTimes(1);
        expect(DinoUtility.isAsyncRequestStartMiddleware).toHaveBeenCalledTimes(1);
    });
    it('requestEndMiddleWare.when_isSyncRequestEndMiddleware', () => {
        let invoked = false;
        let callback;
        let request = { path: 'test' };
        let config: IDinoContainerConfig = {
            baseUri: 'testuri',
            app: {
                use: (uri, cb) => {
                    expect(uri).toBe('testuri');
                    callback = cb;
                }
            }
        } as any;
        let res = { locals: { dino: 45 } };
        spyOn(DinoUtility, 'isSyncRequestEndMiddleware').and.callFake(a => true);
        spyOn(DIContainer, 'create').and.callFake((a, b) => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);

        let dinoContainer = new DinoContainer(config);

        // Spy on the same object method itself
        spyOn(dinoContainer, 'resolve')
            .and.callFake((middleware, dino) => {
                expect(middleware).toBe(String);
                expect(dino).toBe(res.locals.dino);

                return {
                    invoke: (req, resp, next) => {
                        expect(req).toBe(request);
                        expect(resp).toBe(res);
                        expect(next()).toBe('invoked');
                        invoked = true;
                    }
                };
            });

        dinoContainer.requestEndMiddleWare(String);
        callback(request, res, () => 'invoked');
        expect(DinoUtility.isSyncRequestEndMiddleware).toHaveBeenCalledTimes(1);
        expect(dinoContainer.resolve).toHaveBeenCalledTimes(1);
        expect(invoked).toBeTruthy();
    });
    it('requestEndMiddleWare.when_isAsyncRequestEndMiddleware', async () => {
        let invoked = false;
        let callback;
        let request = { path: 'test' };
        let config: IDinoContainerConfig = {
            baseUri: 'testuri',
            app: {
                use: (uri, cb) => {
                    expect(uri).toBe('testuri');
                    callback = cb;
                }
            }
        } as any;
        let res = { locals: { dino: 45 } };
        spyOn(DinoUtility, 'isSyncRequestEndMiddleware').and.callFake(a => false);
        spyOn(DinoUtility, 'isAsyncRequestEndMiddleware').and.callFake(a => true);
        spyOn(DIContainer, 'create').and.callFake((a, b) => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);

        let dinoContainer = new DinoContainer(config);

        // Spy on the same object method itself
        spyOn(dinoContainer, 'resolve')
            .and.callFake((middleware, dino) => {
                expect(middleware).toBe(String);
                expect(dino).toBe(res.locals.dino);

                return {
                    invoke: (req, resp, next) => {
                        expect(req).toBe(request);
                        expect(resp).toBe(res);
                        expect(next()).toBe('invoked');
                        invoked = true;
                    }
                };
            });

        dinoContainer.requestEndMiddleWare(String);
        await callback(request, res, () => 'invoked');
        expect(DinoUtility.isSyncRequestEndMiddleware).toHaveBeenCalledTimes(1);
        expect(DinoUtility.isAsyncRequestEndMiddleware).toHaveBeenCalledTimes(1);
        expect(dinoContainer.resolve).toHaveBeenCalledTimes(1);
        expect(invoked).toBeTruthy();
    });
    it('requestEndMiddleWare.throwsError_when_isAsyncRequestEndMiddleware', async () => {
        let err;
        let callback;
        let request = { path: 'test' };
        let config: IDinoContainerConfig = {
            baseUri: 'testuri',
            app: {
                use: (uri, cb) => {
                    expect(uri).toBe('testuri');
                    callback = cb;
                }
            }
        } as any;
        let res = { locals: { dino: 45 } };
        spyOn(DinoUtility, 'isSyncRequestEndMiddleware').and.callFake(a => false);
        spyOn(DinoUtility, 'isAsyncRequestEndMiddleware').and.callFake(a => true);
        spyOn(DIContainer, 'create').and.callFake((a, b) => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);

        let dinoContainer = new DinoContainer(config);

        // Spy on the same object method itself
        spyOn(dinoContainer, 'resolve')
            .and.callFake((middleware, dino) => {
                expect(middleware).toBe(String);
                expect(dino).toBe(res.locals.dino);

                return {
                    invoke: (req, resp, next) => {
                        expect(req).toBe(request);
                        expect(resp).toBe(res);
                        throw new Error('TestError');
                    }
                };
            });

        dinoContainer.requestEndMiddleWare(String);
        await callback(request, res, e => err = e);
        expect(DinoUtility.isSyncRequestEndMiddleware).toHaveBeenCalledTimes(1);
        expect(DinoUtility.isAsyncRequestEndMiddleware).toHaveBeenCalledTimes(1);
        expect(dinoContainer.resolve).toHaveBeenCalledTimes(1);
        expect(err).toEqual(new Error('TestError'));
    });
    it('requestEndMiddleWare.when_not_a_RequestEndMiddleware', () => {
        let callback;
        let config: IDinoContainerConfig = {
            baseUri: 'testuri',
            app: {
                use: (uri, cb) => {
                    expect(uri).toBe('testuri');
                    callback = cb;
                }
            }
        } as any;
        spyOn(DinoUtility, 'isSyncRequestEndMiddleware').and.callFake(a => false);
        spyOn(DinoUtility, 'isAsyncRequestEndMiddleware').and.callFake(a => false);
        spyOn(DIContainer, 'create').and.callFake((a, b) => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);

        let dinoContainer = new DinoContainer(config);
        dinoContainer.requestEndMiddleWare(String);
        expect(callback).toBeUndefined();
        expect(DinoUtility.isSyncRequestEndMiddleware).toHaveBeenCalledTimes(1);
        expect(DinoUtility.isAsyncRequestEndMiddleware).toHaveBeenCalledTimes(1);
    });
    it('registerObservables.when_isObservableMiddleware', () => {
        let config: IDinoContainerConfig = {} as any;
        spyOn(DinoUtility, 'isObservableMiddleware').and.callFake(a => true);

        let dinoContainer = new DinoContainer(config);
        dinoContainer.registerObservables(String);
        dinoContainer.registerObservables(Boolean);
        expect(DinoUtility.isObservableMiddleware).toHaveBeenCalledTimes(2);
        expect(dinoContainer.observableMiddlewares.includes(String)).toBeTruthy();
        expect(dinoContainer.observableMiddlewares.includes(Boolean)).toBeTruthy();
    });
    it('registerObservables.when_not_anObservableMiddleware', () => {
        let config: IDinoContainerConfig = {} as any;
        spyOn(DinoUtility, 'isObservableMiddleware').and.callFake(a => false);

        let dinoContainer = new DinoContainer(config);
        dinoContainer.registerObservables(String);
        expect(DinoUtility.isObservableMiddleware).toHaveBeenCalledTimes(1);
        expect(dinoContainer.observableMiddlewares.includes(String)).toBeFalsy();
    });
    it('registerErrorMiddleWare.when_isSyncErrorMiddleware', () => {
        let invoked = false;
        let callback;
        let request = { path: 'test' };
        let config: IDinoContainerConfig = {
            baseUri: 'testuri',
            app: {
                use: (uri, cb) => {
                    expect(uri).toBe('testuri');
                    callback = cb;
                }
            }
        } as any;
        let res = { locals: { dino: 45 } };
        spyOn(DinoUtility, 'isSyncErrorMiddleware').and.callFake(a => true);
        spyOn(DIContainer, 'create').and.callFake((a, b) => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);

        let dinoContainer = new DinoContainer(config);

        // Spy on the same object method itself
        spyOn(dinoContainer, 'resolve')
            .and.callFake((middleware, dino) => {
                expect(middleware).toBe(String);
                expect(dino).toBe(res.locals.dino);

                return {
                    invoke: (err, req, resp, next) => {
                        expect(err).toEqual(new Error('TestError'));
                        expect(req).toBe(request);
                        expect(resp).toBe(res);
                        expect(next()).toBe('invoked');
                        invoked = true;
                    }
                };
            });

        dinoContainer.registerErrorMiddleWare(String);
        callback(new Error('TestError'), request, res, () => 'invoked');
        expect(DinoUtility.isSyncErrorMiddleware).toHaveBeenCalledTimes(1);
        expect(dinoContainer.resolve).toHaveBeenCalledTimes(1);
        expect(invoked).toBeTruthy();
    });
    it('registerErrorMiddleWare.when_isAsyncErrorMiddleware', async () => {
        let invoked = false;
        let callback;
        let request = { path: 'test' };
        let config: IDinoContainerConfig = {
            baseUri: 'testuri',
            app: {
                use: (uri, cb) => {
                    expect(uri).toBe('testuri');
                    callback = cb;
                }
            }
        } as any;
        let res = { locals: { dino: 45 } };
        spyOn(DinoUtility, 'isSyncErrorMiddleware').and.callFake(a => false);
        spyOn(DinoUtility, 'isAsyncErrorMiddleware').and.callFake(a => true);
        spyOn(DIContainer, 'create').and.callFake((a, b) => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);

        let dinoContainer = new DinoContainer(config);

        // Spy on the same object method itself
        spyOn(dinoContainer, 'resolve')
            .and.callFake((middleware, dino) => {
                expect(middleware).toBe(String);
                expect(dino).toBe(res.locals.dino);

                return {
                    invoke: (err, req, resp, next) => {
                        expect(err).toEqual(new Error('TestError'));
                        expect(req).toBe(request);
                        expect(resp).toBe(res);
                        expect(next()).toBe('invoked');
                        invoked = true;
                    }
                };
            });

        dinoContainer.registerErrorMiddleWare(String);
        await callback(new Error('TestError'), request, res, () => 'invoked');
        expect(DinoUtility.isAsyncErrorMiddleware).toHaveBeenCalledTimes(1);
        expect(DinoUtility.isSyncErrorMiddleware).toHaveBeenCalledTimes(1);
        expect(dinoContainer.resolve).toHaveBeenCalledTimes(1);
        expect(invoked).toBeTruthy();
    });
    it('registerErrorMiddleWare.throwsError_when_isAsyncErrorMiddleware', async () => {
        let err;
        let callback;
        let request = { path: 'test' };
        let config: IDinoContainerConfig = {
            baseUri: 'testuri',
            app: {
                use: (uri, cb) => {
                    expect(uri).toBe('testuri');
                    callback = cb;
                }
            }
        } as any;
        let res = { locals: { dino: 45 } };
        spyOn(DinoUtility, 'isSyncErrorMiddleware').and.callFake(a => false);
        spyOn(DinoUtility, 'isAsyncErrorMiddleware').and.callFake(a => true);
        spyOn(DIContainer, 'create').and.callFake((a, b) => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);

        let dinoContainer = new DinoContainer(config);

        // Spy on the same object method itself
        spyOn(dinoContainer, 'resolve')
            .and.callFake((middleware, dino) => {
                expect(middleware).toBe(String);
                expect(dino).toBe(res.locals.dino);

                return {
                    invoke: (err, req, resp, next) => {
                        expect(err).toEqual(new Error('TestError'));
                        expect(req).toBe(request);
                        expect(resp).toBe(res);
                        throw new Error('TestErrorThrown');
                    }
                };
            });

        dinoContainer.registerErrorMiddleWare(String);
        await callback(new Error('TestError'), request, res, e => err = e);
        expect(DinoUtility.isAsyncErrorMiddleware).toHaveBeenCalledTimes(1);
        expect(DinoUtility.isSyncErrorMiddleware).toHaveBeenCalledTimes(1);
        expect(dinoContainer.resolve).toHaveBeenCalledTimes(1);
        expect(err).toEqual(new Error('TestErrorThrown'));
    });
    it('registerErrorMiddleWare.when_not_a_ErrorMiddleware', () => {
        let callback;
        let config: IDinoContainerConfig = {
            baseUri: 'testuri',
            app: {
                use: (uri, cb) => {
                    expect(uri).toBe('testuri');
                    callback = cb;
                }
            }
        } as any;
        spyOn(DinoUtility, 'isSyncErrorMiddleware').and.callFake(a => false);
        spyOn(DinoUtility, 'isAsyncErrorMiddleware').and.callFake(a => false);
        spyOn(DIContainer, 'create').and.callFake((a, b) => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);

        let dinoContainer = new DinoContainer(config);
        dinoContainer.registerErrorMiddleWare(String);
        expect(callback).toBeUndefined();
        expect(DinoUtility.isSyncErrorMiddleware).toHaveBeenCalledTimes(1);
        expect(DinoUtility.isAsyncErrorMiddleware).toHaveBeenCalledTimes(1);
    });
    it('registerErrorController.when_isErrorController', () => {
        let patch;
        let invoked;
        let callback;
        let request = { path: 'test' };
        let config: IDinoContainerConfig = {
            baseUri: 'testuri',
            app: {
                use: (uri, cb) => {
                    expect(uri).toBe('testuri');
                    callback = cb;
                }
            }
        } as any;
        let res = { locals: { dino: 45 } };

        spyOn(DIContainer, 'create').and.callFake((a, b) => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);
        spyOn(DinoUtility, 'isErrorController').and.callFake(a => true);
        spyOn(DinoErrorController, 'create').and.callFake(a => {
            expect(a).toEqual({ api: true });

            return {
                patch: (err, req, resp, next) => {
                    expect(err).toEqual(new Error('TestError'));
                    expect(req).toBe(request);
                    expect(resp).toBe(res);
                    expect(next()).toBe('invoked');
                    patch = true;
                },
                invoke: method => {
                    expect(method).toBe(Attribute.errorControllerDefaultMethod);
                    invoked = true;
                }
            };
        });
        let dinoContainer = new DinoContainer(config);

        // Spy on the same object method itself
        spyOn(dinoContainer, 'resolve')
            .and.callFake((middleware, dino) => {
                expect(middleware).toBe(String);
                expect(dino).toBe(res.locals.dino);

                return { api: true };
            });

        dinoContainer.registerErrorController(String);
        callback(new Error('TestError'), request, res, () => 'invoked');
        expect(DinoUtility.isErrorController).toHaveBeenCalledTimes(1);
        expect(DinoErrorController.create).toHaveBeenCalledTimes(1);
        expect(dinoContainer.resolve).toHaveBeenCalledTimes(1);
        expect(patch).toBeTruthy();
        expect(invoked).toBeTruthy();
    });
    it('registerErrorController.when_not_anErrorController', () => {
        let callback;
        let config: IDinoContainerConfig = {
            baseUri: 'testuri',
            app: {
                use: (uri, cb) => {
                    expect(uri).toBe('testuri');
                    callback = cb;
                }
            }
        } as any;
        spyOn(DinoUtility, 'isErrorController').and.callFake(a => false);
        spyOn(DIContainer, 'create').and.callFake((a, b) => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);
        let dinoContainer = new DinoContainer(config);

        dinoContainer.registerErrorController(String);
        expect(callback).toBeUndefined();
        expect(DinoUtility.isErrorController).toHaveBeenCalledTimes(1);
    });
    it('setUpDinoController.when_observableResponse_is_false', () => {
        let config: IDinoContainerConfig = {} as any;
        let res: any = { locals: { dino: 45 } };
        let dinoController: DinoController = { ctx: true } as any;
        let _sendsResponse = false;
        let _observable = false;
        let _bindmodel = {};

        spyOn(ControllerAction, 'create')
            .and.callFake((sendsResponse, observable, bindsModel) => {
                expect(sendsResponse).toBe(_sendsResponse);
                expect(observable).toBeUndefined();
                expect(bindsModel).toBe(_bindmodel);

                return 'testAction';
            });
        spyOn(DinoController, 'create').and.callFake(
            (api, action) => {
                expect(action).toBe('testAction');
                expect(api).toBe('resolved');

                return dinoController;
            });
        spyOn(DIContainer, 'create').and.callFake((a, b) => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);

        let dinoContainer = new DinoContainer(config);

        // Spy on the same object method itself
        spyOn(dinoContainer, 'resolve')
            .and.callFake((middleware, dino) => {
                expect(middleware).toBe(String);
                expect(dino).toBe(res.locals.dino);

                return 'resolved';
            });

        let obj = dinoContainer
            .setUpDinoController(String, _sendsResponse, _observable, _bindmodel, res);
        expect(ControllerAction.create).toHaveBeenCalledTimes(1);
        expect(DinoController.create).toHaveBeenCalledTimes(1);
        expect(dinoContainer.resolve).toHaveBeenCalledTimes(1);
        expect(obj).toBe(dinoController);
    });
    it('setUpDinoController.when_observableResponse_is_true', () => {
        let config: IDinoContainerConfig = {} as any;
        let res: any = { locals: { dino: 45 } };
        let dinoController: DinoController = { ctx: true } as any;
        let _sendsResponse = false;
        let _observable = true;
        let _bindmodel = {};
        let middlewares = [];

        spyOn(DIContainer, 'create').and.callFake((a, b) => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);
        spyOn(ControllerAction, 'create')
            .and.callFake((sendsResponse, observable, bindsModel) => {
                expect(sendsResponse).toBe(_sendsResponse);
                expect(observable).toBeDefined();
                expect(bindsModel).toBe(_bindmodel);

                return 'testAction';
            });
        spyOn(DinoController, 'create').and.callFake(
            (api, action) => {
                expect(action).toBe('testAction');
                expect(api).toBe('resolved');

                return dinoController;
            });

        let dinoContainer = new DinoContainer(config);
        // observable middleware will be the first element, no matter how many we add
        dinoContainer.observableMiddlewares.push(Function);
        dinoContainer.observableMiddlewares.push(Object);
        // Spy on the same object itself
        spyOn(dinoContainer, 'resolve')
            .and.callFake((middleware, dino) => {
                middlewares.push(middleware);
                expect(dino).toBe(res.locals.dino);

                return 'resolved';
            });

        let obj = dinoContainer
            .setUpDinoController(String, _sendsResponse, _observable, _bindmodel, res);
        expect(ControllerAction.create).toHaveBeenCalledTimes(1);
        expect(DinoController.create).toHaveBeenCalledTimes(1);
        expect(dinoContainer.resolve).toHaveBeenCalledTimes(2);
        expect(middlewares.includes(String)).toBeTruthy();
        expect(middlewares.includes(Function)).toBeTruthy();
        expect(obj).toBe(dinoController);
    });
});
