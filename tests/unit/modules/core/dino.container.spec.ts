import {
    DinoContainer,
    IDinoContainerConfig,
    DIContainer,
    RouteTable,
    ObjectUtility,
    DinoUtility,
    RequestStartMiddleware,
    IRouteTable,
    DinoErrorController,
    ControllerAction,
    DinoController,
    RequestEndMiddleware,
    ErrorMiddleware,
    Constants,
    IActionMethodAttribute
} from '../../index';

describe('modules.core.dino.container.spec', () => {
    it('resolve.enableTaskContext_false', () => {
        let config: IDinoContainerConfig = { enableTaskContext: false } as any;
        spyOn(DIContainer, 'create').and.callFake(() => {
            return {
                resolve: m => {
                    expect(m).toBe(String);

                    return 'resolved';
                }
            };
        });
        spyOn(RouteTable, 'create').and.callFake(() => null);
        spyOn(ObjectUtility, 'replaceObjectReferences').and.callFake(() => 'replaced');

        let dinoContainer = new DinoContainer(config);
        let obj = dinoContainer.resolve(String, { context: 'test' });

        // following expects are common for every constructor execution
        // do not delete these test case
        expect(RouteTable.create).toHaveBeenCalledTimes(1);
        expect(DIContainer.create).toHaveBeenCalledTimes(1);

        expect(obj).toBe('resolved');
        expect(ObjectUtility.replaceObjectReferences).toHaveBeenCalledTimes(0);
    });
    it('resolve.enableTaskContext_true', () => {
        let config: IDinoContainerConfig = { enableTaskContext: true } as any;
        spyOn(DIContainer, 'create').and.callFake(() => {
            return {
                resolve: m => {
                    expect(m).toBe(String);

                    return 'resolved';
                }
            };
        });
        spyOn(RouteTable, 'create').and.callFake(() => null);
        spyOn(ObjectUtility, 'replaceObjectReferences').and.callFake(() => 'replaced');

        let dinoContainer = new DinoContainer(config);
        let obj = dinoContainer.resolve(String, { context: 'test' });

        expect(obj).toBe('replaced');
    });
    it('static_create.invoke_constructor', () => {
        let config: IDinoContainerConfig = {} as any;
        spyOn(DIContainer, 'create').and.callFake(() => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);

        let dinoContainer = DinoContainer.create(config);
        expect(dinoContainer instanceof DinoContainer).toBeTruthy();
    });
    it('routeNotFoundMiddleware.when_isSyncRequestStartMiddleware_true', () => {
        const _req = { req: 'uri' };
        const _res = { res: 'express' };
        const _next = () => null;

        class RoutNotFoundMiddlewareFake extends RequestStartMiddleware {
            constructor(route: IRouteTable) {
                super();
                expect(route).toBeNull();
            }
            invoke(req, res, next): void {
                expect(req).toBe(_req);
                expect(res).toBe(_res);
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
        spyOn(DIContainer, 'create').and.callFake(() => null);
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
        spyOn(DIContainer, 'create').and.callFake(() => null);
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

        class RequestStartFake extends RequestStartMiddleware {
            invoke(req, res, next): void {
                expect(req).toBe(_req);
                expect(res).toBe(_res);
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
        spyOn(DIContainer, 'create').and.callFake(() => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);
        spyOn(DinoUtility, 'isSyncRequestStartMiddleware')
            .and.callFake(m => {
                expect(m).toBe(RequestStartFake);

                return true;
            });

        let dinoContainer = new DinoContainer(config);
        dinoContainer.builtInRequestStartMiddleware(RequestStartFake);
        expect(DinoUtility.isSyncRequestStartMiddleware).toHaveBeenCalledTimes(1);
        callback(_req, _res, _next);
    });
    it('builtInRequestStartMiddleWare.when_isSyncRequestStartMiddleware_false', () => {
        let callback;
        let config: IDinoContainerConfig = {} as any;
        spyOn(DIContainer, 'create').and.callFake(() => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);
        spyOn(DinoUtility, 'isSyncRequestStartMiddleware')
            .and.callFake(m => {
                expect(m).toBe(Function);

                return false;
            });

        let dinoContainer = new DinoContainer(config);
        dinoContainer.builtInRequestStartMiddleware(Function);
        expect(callback).toBeUndefined();
        expect(DinoUtility.isSyncRequestStartMiddleware).toHaveBeenCalledTimes(1);
    });
    it('builtInRequestEndMiddleWare.when_isSyncRequestEndMiddleware_true', () => {
        const _req = { req: 'uri' };
        const _res = {
            locals: { dino: { result: 'express' } }
        };
        const _next = () => null;

        class RequestEndFake extends RequestEndMiddleware {
            invoke(req, res, next): void {
                expect(req).toBe(_req);
                expect(res).toBe(_res);
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
        spyOn(DIContainer, 'create').and.callFake(() => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);
        spyOn(DinoUtility, 'isSyncRequestEndMiddleware')
            .and.callFake(m => {
                expect(m).toBe(RequestEndFake);

                return true;
            });

        let dinoContainer = new DinoContainer(config);
        dinoContainer.builtInRequestEndMiddleware(RequestEndFake);
        callback(_req, _res, _next);
        expect(DinoUtility.isSyncRequestEndMiddleware).toHaveBeenCalledTimes(1);
    });
    it('builtInRequestEndMiddleWare.when_isSyncRequestEndMiddleware_false', () => {
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
        spyOn(DIContainer, 'create').and.callFake(() => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);
        spyOn(DinoUtility, 'isSyncRequestEndMiddleware')
            .and.callFake(m => false);

        let dinoContainer = new DinoContainer(config);
        dinoContainer.builtInRequestEndMiddleware(Function);
        expect(callback).toBeUndefined();
        expect(DinoUtility.isSyncRequestEndMiddleware).toHaveBeenCalledTimes(1);
    });
    it('builtInErrorMiddleWare.when_isSyncErrorMiddleware_true', () => {
        const _req = { req: 'uri' };
        const _res = { res: 'express' };
        const _err = new Error('testerror');
        const _next = () => null;

        class ErrorFake extends ErrorMiddleware {
            invoke(err, req, res, next): void {
                expect(err).toBe(_err);
                expect(req).toBe(_req);
                expect(res).toBe(_res);
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
        spyOn(DIContainer, 'create').and.callFake(() => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);
        spyOn(DinoUtility, 'isSyncErrorMiddleware')
            .and.callFake(m => {
                expect(m).toBe(ErrorFake);

                return true;
            });

        let dinoContainer = new DinoContainer(config);
        dinoContainer.builtInErrorMiddleware(ErrorFake);
        callback(_err, _req, _res, _next);
        expect(DinoUtility.isSyncErrorMiddleware).toHaveBeenCalledTimes(1);
    });
    it('builtInErrorMiddleWare.when_isSyncErrorMiddleware_false', () => {
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
        spyOn(DIContainer, 'create').and.callFake(() => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);
        spyOn(DinoUtility, 'isSyncErrorMiddleware')
            .and.callFake(m => false);

        let dinoContainer = new DinoContainer(config);
        dinoContainer.builtInErrorMiddleware(Function);
        expect(callback).toBeUndefined();
        expect(DinoUtility.isSyncErrorMiddleware).toHaveBeenCalledTimes(1);
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
        spyOn(DIContainer, 'create').and.callFake(() => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);
        spyOn(DinoUtility, 'isSyncRequestStartMiddleware').and.callFake(() => true);

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

        dinoContainer.requestStartMiddleware(String);
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
        spyOn(DinoUtility, 'isSyncRequestStartMiddleware').and.callFake(() => false);
        spyOn(DinoUtility, 'isAsyncRequestStartMiddleware').and.callFake(() => true);
        spyOn(DIContainer, 'create').and.callFake(() => null);
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

        dinoContainer.requestStartMiddleware(String);
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
        spyOn(DinoUtility, 'isSyncRequestStartMiddleware').and.callFake(() => false);
        spyOn(DinoUtility, 'isAsyncRequestStartMiddleware').and.callFake(() => true);
        spyOn(DIContainer, 'create').and.callFake(() => null);
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

        dinoContainer.requestStartMiddleware(String);
        await callback(request, res, e => err = e);
        expect(DinoUtility.isSyncRequestStartMiddleware).toHaveBeenCalledTimes(1);
        expect(DinoUtility.isAsyncRequestStartMiddleware).toHaveBeenCalledTimes(1);
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
        spyOn(DinoUtility, 'isSyncRequestStartMiddleware').and.callFake(() => false);
        spyOn(DinoUtility, 'isAsyncRequestStartMiddleware').and.callFake(() => false);
        spyOn(DIContainer, 'create').and.callFake(() => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);

        let dinoContainer = new DinoContainer(config);
        dinoContainer.requestStartMiddleware(String);
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
        spyOn(DinoUtility, 'isSyncRequestEndMiddleware').and.callFake(() => true);
        spyOn(DIContainer, 'create').and.callFake(() => null);
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

        dinoContainer.requestEndMiddleware(String);
        callback(request, res, () => 'invoked');
        expect(DinoUtility.isSyncRequestEndMiddleware).toHaveBeenCalledTimes(1);
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
        spyOn(DinoUtility, 'isSyncRequestEndMiddleware').and.callFake(() => false);
        spyOn(DinoUtility, 'isAsyncRequestEndMiddleware').and.callFake(() => true);
        spyOn(DIContainer, 'create').and.callFake(() => null);
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

        dinoContainer.requestEndMiddleware(String);
        await callback(request, res, () => 'invoked');
        expect(DinoUtility.isSyncRequestEndMiddleware).toHaveBeenCalledTimes(1);
        expect(DinoUtility.isAsyncRequestEndMiddleware).toHaveBeenCalledTimes(1);
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
        spyOn(DinoUtility, 'isSyncRequestEndMiddleware').and.callFake(() => false);
        spyOn(DinoUtility, 'isAsyncRequestEndMiddleware').and.callFake(() => true);
        spyOn(DIContainer, 'create').and.callFake(() => null);
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

        dinoContainer.requestEndMiddleware(String);
        await callback(request, res, e => err = e);
        expect(DinoUtility.isSyncRequestEndMiddleware).toHaveBeenCalledTimes(1);
        expect(DinoUtility.isAsyncRequestEndMiddleware).toHaveBeenCalledTimes(1);
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
        spyOn(DinoUtility, 'isSyncRequestEndMiddleware').and.callFake(() => false);
        spyOn(DinoUtility, 'isAsyncRequestEndMiddleware').and.callFake(() => false);
        spyOn(DIContainer, 'create').and.callFake(() => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);

        let dinoContainer = new DinoContainer(config);
        dinoContainer.requestEndMiddleware(String);
        expect(callback).toBeUndefined();
        expect(DinoUtility.isSyncRequestEndMiddleware).toHaveBeenCalledTimes(1);
        expect(DinoUtility.isAsyncRequestEndMiddleware).toHaveBeenCalledTimes(1);
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
        spyOn(DinoUtility, 'isSyncErrorMiddleware').and.callFake(() => true);
        spyOn(DIContainer, 'create').and.callFake(() => null);
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

        dinoContainer.registerErrorMiddleware(String);
        callback(new Error('TestError'), request, res, () => 'invoked');
        expect(DinoUtility.isSyncErrorMiddleware).toHaveBeenCalledTimes(1);
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
        spyOn(DinoUtility, 'isSyncErrorMiddleware').and.callFake(() => false);
        spyOn(DinoUtility, 'isAsyncErrorMiddleware').and.callFake(() => true);
        spyOn(DIContainer, 'create').and.callFake(() => null);
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

        dinoContainer.registerErrorMiddleware(String);
        await callback(new Error('TestError'), request, res, () => 'invoked');
        expect(DinoUtility.isAsyncErrorMiddleware).toHaveBeenCalledTimes(1);
        expect(DinoUtility.isSyncErrorMiddleware).toHaveBeenCalledTimes(1);
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
        spyOn(DinoUtility, 'isSyncErrorMiddleware').and.callFake(() => false);
        spyOn(DinoUtility, 'isAsyncErrorMiddleware').and.callFake(() => true);
        spyOn(DIContainer, 'create').and.callFake(() => null);
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

        dinoContainer.registerErrorMiddleware(String);
        await callback(new Error('TestError'), request, res, e => err = e);
        expect(DinoUtility.isAsyncErrorMiddleware).toHaveBeenCalledTimes(1);
        expect(DinoUtility.isSyncErrorMiddleware).toHaveBeenCalledTimes(1);
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
        spyOn(DinoUtility, 'isSyncErrorMiddleware').and.callFake(() => false);
        spyOn(DinoUtility, 'isAsyncErrorMiddleware').and.callFake(() => false);
        spyOn(DIContainer, 'create').and.callFake(() => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);

        let dinoContainer = new DinoContainer(config);
        dinoContainer.registerErrorMiddleware(String);
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

        spyOn(DIContainer, 'create').and.callFake(() => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);
        spyOn(DinoUtility, 'isErrorController').and.callFake(() => true);
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
                    expect(method).toBe(Constants.errControllerDefaultMethod);
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
        spyOn(DinoUtility, 'isErrorController').and.callFake(() => false);
        spyOn(DIContainer, 'create').and.callFake(() => null);
        spyOn(RouteTable, 'create').and.callFake(() => null);
        let dinoContainer = new DinoContainer(config);

        dinoContainer.registerErrorController(String);
        expect(callback).toBeUndefined();
        expect(DinoUtility.isErrorController).toHaveBeenCalledTimes(1);
    });
    it('setUpDinoController.verify_values', () => {
        let config: IDinoContainerConfig = {} as any;
        let res: any = { locals: { dino: 45 } };
        let dinoController: DinoController = { ctx: true } as any;
        let action: IActionMethodAttribute = {
            sendsResponse: false
        };
        let _bindmodel = {};

        spyOn(ControllerAction, 'create')
            .and.callFake((actionAttr: IActionMethodAttribute) => {
                expect(actionAttr.sendsResponse).toBe(action.sendsResponse);

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
            .setUpDinoController(String, action, res);
        expect(ControllerAction.create).toHaveBeenCalledTimes(1);
        expect(DinoController.create).toHaveBeenCalledTimes(1);
        expect(dinoContainer.resolve).toHaveBeenCalledTimes(1);
        expect(obj).toBe(dinoController);
    });
});
