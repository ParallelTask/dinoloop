import {
    DinoRouter,
    IRouterConfig,
    ObjectUtility,
    DinoParser,
    DinoUtility
} from '../../index';

describe('modules.router.dino.router.spec', () => {
    it('static_create.invoke_constructor', () => {
        let config: IRouterConfig = {
            routerCb: () => null
        } as any;
        let router = DinoRouter.create(config);
        expect(router instanceof DinoRouter).toBeTruthy();
    });
    it('resolve.enableTaskContext_false', () => {
        let config: IRouterConfig = {
            diContainer: {
                resolve: m => {
                    expect(m).toBe(String);

                    return 'resolved';
                }
            },
            enableTaskContext: false,
            routerCb: () => null
        } as any;

        spyOn(ObjectUtility, 'replaceObjectReferences')
            .and.callFake(() => 'replaced');
        let dinoRouter = new DinoRouter(config);
        let o = dinoRouter.resolve(String, { context: 'test' });

        expect(o).toBe('resolved');
        expect(ObjectUtility.replaceObjectReferences).toHaveBeenCalledTimes(0);
    });
    it('resolve.enableTaskContext_true', () => {
        let middleware;
        let config: IRouterConfig = {
            diContainer: {
                resolve: m => {
                    middleware = m;

                    return 'resolved';
                }
            },
            enableTaskContext: true,
            routerCb: () => null
        } as any;

        spyOn(ObjectUtility, 'replaceObjectReferences')
            .and.callFake(() => 'replaced');
        let dinoRouter = new DinoRouter(config);
        let o = dinoRouter.resolve(String, { context: 'test' });

        expect(o).toBe('replaced');
        expect(middleware).toBe(String);
    });
    it('expressRouter.return_this.router', () => {
        let middleware;
        let config: IRouterConfig = { routerCb: () => 45 } as any;
        let dinoRouter = new DinoRouter(config);
        let o = dinoRouter.expressRouter();

        expect(o).toBe(45);
    });
    it('registerMiddleware.when_isSyncMiddleWare', () => {
        let invoked = false;
        let callback;
        let request = { path: 'test' };
        let config: IRouterConfig = {
            routerCb: () => {
                return { use: cb => callback = cb };
            }
        } as any;
        let provider = { useClass: Function, data: 'sampledata' };
        let res = { locals: { dino: 45 } };
        spyOn(DinoParser, 'parseMiddlewareProvider').and.callFake(a => a);
        spyOn(DinoUtility, 'isSyncMiddleWare').and.callFake(() => true);

        let dinoRouter = new DinoRouter(config);

        // Spy on the same object method itself
        spyOn(dinoRouter, 'resolve')
            .and.callFake((middleware, dino) => {
                expect(middleware).toBe(Function);
                expect(dino).toBe(res.locals.dino);

                return {
                    invoke: (req, resp, next, data) => {
                        // Should invoke all expects
                        expect(req).toBe(request);
                        expect(resp).toBe(res);
                        expect(next()).toBe('invoked');
                        expect(data).toBe(provider.data);
                        invoked = true;
                    }
                };
            });

        dinoRouter.registerMiddleware(provider);
        callback(request, res, () => 'invoked');
        expect(DinoUtility.isSyncMiddleWare).toHaveBeenCalledTimes(1);
        expect(DinoParser.parseMiddlewareProvider).toHaveBeenCalledTimes(1);
        expect(dinoRouter.resolve).toHaveBeenCalledTimes(1);
        expect(invoked).toBeTruthy();
    });
    it('registerMiddleware.when_isAsyncMiddleWare', async () => {
        let callback;
        let request = { path: 'test' };
        let invoked = false;
        let config: IRouterConfig = {
            routerCb: () => {
                return { use: cb => callback = cb };
            }
        } as any;
        let provider = { useClass: Function, data: 'sampledata' };
        let res = { locals: { dino: 45 } };
        spyOn(DinoParser, 'parseMiddlewareProvider').and.callFake(a => a);
        spyOn(DinoUtility, 'isSyncMiddleWare').and.callFake(() => false);
        spyOn(DinoUtility, 'isAsyncMiddleWare').and.callFake(() => true);

        let dinoRouter = new DinoRouter(config);

        // Spy on the same object method itself
        spyOn(dinoRouter, 'resolve')
            .and.callFake((middleware, dino) => {
                expect(middleware).toBe(Function);
                expect(dino).toBe(res.locals.dino);

                return {
                    invoke: (req, resp, next, data) => {
                        // Should invoke all expects
                        expect(req).toBe(request);
                        expect(resp).toBe(res);
                        expect(next()).toBe('invoked');
                        expect(data).toBe(provider.data);
                        invoked = true;
                    }
                };
            });

        dinoRouter.registerMiddleware(provider);
        await callback(request, res, () => 'invoked');
        expect(DinoUtility.isSyncMiddleWare).toHaveBeenCalledTimes(1);
        expect(DinoUtility.isAsyncMiddleWare).toHaveBeenCalledTimes(1);
        expect(DinoParser.parseMiddlewareProvider).toHaveBeenCalledTimes(1);
        expect(dinoRouter.resolve).toHaveBeenCalledTimes(1);
        expect(invoked).toBeTruthy();
    });
    it('registerMiddleware.throwsError_when_isAsyncMiddleWare', async () => {
        let callback;
        let err;
        let request = { path: 'test' };
        let config: IRouterConfig = {
            routerCb: () => {
                return { use: cb => callback = cb };
            }
        } as any;
        let provider = { useClass: Function, data: 'sampledata' };
        let res = { locals: { dino: 45 } };
        spyOn(DinoParser, 'parseMiddlewareProvider').and.callFake(a => a);
        spyOn(DinoUtility, 'isSyncMiddleWare').and.callFake(() => false);
        spyOn(DinoUtility, 'isAsyncMiddleWare').and.callFake(() => true);

        let dinoRouter = new DinoRouter(config);

        // Spy on the same object method itself
        spyOn(dinoRouter, 'resolve')
            .and.callFake((middleware, dino) => {
                expect(middleware).toBe(Function);
                expect(dino).toBe(res.locals.dino);

                return {
                    invoke: (req, resp, next, data) => {
                        expect(req).toBe(request);
                        expect(resp).toBe(res);
                        expect(data).toBe(provider.data);
                        throw new Error('TestError');
                    }
                };
            });

        dinoRouter.registerMiddleware(provider);
        await callback(request, res, e => err = e);
        expect(DinoUtility.isSyncMiddleWare).toHaveBeenCalledTimes(1);
        expect(DinoUtility.isAsyncMiddleWare).toHaveBeenCalledTimes(1);
        expect(DinoParser.parseMiddlewareProvider).toHaveBeenCalledTimes(1);
        expect(dinoRouter.resolve).toHaveBeenCalledTimes(1);
        expect(err).toEqual(new Error('TestError'));
    });
    it('registerMiddleware.when_not_a_middleware', () => {
        let callback;
        let config: IRouterConfig = {
            routerCb: () => {
                return { use: cb => callback = cb };
            }
        } as any;
        spyOn(DinoParser, 'parseMiddlewareProvider').and.callFake(a => a);
        spyOn(DinoUtility, 'isSyncMiddleWare').and.callFake(() => false);
        spyOn(DinoUtility, 'isAsyncMiddleWare').and.callFake(() => false);

        let dinoRouter = new DinoRouter(config);
        dinoRouter.registerMiddleware(String);
        expect(DinoUtility.isSyncMiddleWare).toHaveBeenCalledTimes(1);
        expect(DinoUtility.isAsyncMiddleWare).toHaveBeenCalledTimes(1);
        expect(DinoParser.parseMiddlewareProvider).toHaveBeenCalledTimes(1);
        expect(callback).toBeUndefined();
    });
    it('registerBeginActionFilter.when_isSyncActionFilter', () => {
        let invoked = false;
        let callback;
        let request = { path: 'test' };
        let config: IRouterConfig = {
            routerCb: () => {
                return { use: cb => callback = cb };
            }
        } as any;
        let provider = { useClass: Function, data: 'sampledata' };
        let res = { locals: { dino: 45 } };
        spyOn(DinoParser, 'parseMiddlewareProvider').and.callFake(a => a);
        spyOn(DinoUtility, 'isSyncActionFilter').and.callFake(() => true);

        let dinoRouter = new DinoRouter(config);

        // Spy on the same object method itself
        spyOn(dinoRouter, 'resolve')
            .and.callFake((middleware, dino) => {
                expect(middleware).toBe(Function);
                expect(dino).toBe(res.locals.dino);

                return {
                    beforeExecution: (req, resp, next, data) => {
                        expect(req).toBe(request);
                        expect(resp).toBe(res);
                        expect(next()).toBe('invoked');
                        expect(data).toBe(provider.data);
                        invoked = true;
                    }
                };
            });

        dinoRouter.registerBeginActionFilter(provider);
        callback(request, res, () => 'invoked');
        expect(DinoUtility.isSyncActionFilter).toHaveBeenCalledTimes(1);
        expect(DinoParser.parseMiddlewareProvider).toHaveBeenCalledTimes(1);
        expect(invoked).toBeTruthy();
    });
    it('registerBeginActionFilter.when_isAsyncActionFilter', async () => {
        let callback;
        let invoked = false;
        let request = { path: 'test' };
        let config: IRouterConfig = {
            routerCb: () => {
                return { use: cb => callback = cb };
            }
        } as any;
        let provider = { useClass: Function, data: 'sampledata' };
        let res = { locals: { dino: 45 } };
        spyOn(DinoParser, 'parseMiddlewareProvider').and.callFake(a => a);
        spyOn(DinoUtility, 'isSyncActionFilter').and.callFake(() => false);
        spyOn(DinoUtility, 'isAsyncActionFilter').and.callFake(() => true);

        let dinoRouter = new DinoRouter(config);

        // Spy on the same object method itself
        spyOn(dinoRouter, 'resolve')
            .and.callFake((middleware, dino) => {
                expect(middleware).toBe(Function);
                expect(dino).toBe(res.locals.dino);

                return {
                    beforeExecution: (req, resp, next, data) => {
                        expect(req).toBe(request);
                        expect(resp).toBe(res);
                        expect(next()).toBe('invoked');
                        expect(data).toBe(provider.data);
                        invoked = true;
                    }
                };
            });

        dinoRouter.registerBeginActionFilter(provider);
        await callback(request, res, () => 'invoked');
        expect(DinoUtility.isSyncActionFilter).toHaveBeenCalledTimes(1);
        expect(DinoUtility.isAsyncActionFilter).toHaveBeenCalledTimes(1);
        expect(DinoParser.parseMiddlewareProvider).toHaveBeenCalledTimes(1);
        expect(invoked).toBeTruthy();
    });
    it('registerBeginActionFilter.throwsError_when_isAsyncActionFilter', async () => {
        let callback;
        let err;
        let request = { path: 'test' };
        let config: IRouterConfig = {
            routerCb: () => {
                return { use: cb => callback = cb };
            }
        } as any;
        let provider = { useClass: Function, data: 'sampledata' };
        let res = { locals: { dino: 45 } };
        spyOn(DinoParser, 'parseMiddlewareProvider').and.callFake(a => a);
        spyOn(DinoUtility, 'isSyncActionFilter').and.callFake(() => false);
        spyOn(DinoUtility, 'isAsyncActionFilter').and.callFake(() => true);

        let dinoRouter = new DinoRouter(config);

        // Spy on the same object method itself
        spyOn(dinoRouter, 'resolve')
            .and.callFake((middleware, dino) => {
                expect(middleware).toBe(Function);
                expect(dino).toBe(res.locals.dino);

                return {
                    beforeExecution: (req, resp, next, data) => {
                        expect(req).toBe(request);
                        expect(resp).toBe(res);
                        // expect(c) not invoked because it should invoke next(err)
                        expect(data).toBe(provider.data);
                        throw new Error('TestError');
                    }
                };
            });

        dinoRouter.registerBeginActionFilter(provider);
        await callback(request, res, e => err = e);
        expect(DinoUtility.isSyncActionFilter).toHaveBeenCalledTimes(1);
        expect(DinoUtility.isAsyncActionFilter).toHaveBeenCalledTimes(1);
        expect(DinoParser.parseMiddlewareProvider).toHaveBeenCalledTimes(1);
        expect(err).toEqual(new Error('TestError'));
    });
    it('registerBeginActionFilter.when_not_an_actionFilter', () => {
        let callback;
        let config: IRouterConfig = {
            routerCb: () => {
                return { use: cb => callback = cb };
            }
        } as any;
        spyOn(DinoParser, 'parseMiddlewareProvider').and.callFake(a => a);
        spyOn(DinoUtility, 'isSyncActionFilter').and.callFake(() => false);
        spyOn(DinoUtility, 'isAsyncActionFilter').and.callFake(() => false);

        let dinoRouter = new DinoRouter(config);
        dinoRouter.registerBeginActionFilter(String);
        expect(DinoUtility.isSyncActionFilter).toHaveBeenCalledTimes(1);
        expect(DinoUtility.isAsyncActionFilter).toHaveBeenCalledTimes(1);
        expect(DinoParser.parseMiddlewareProvider).toHaveBeenCalledTimes(1);
        expect(callback).toBeUndefined();
    });
    it('registerAfterActionFilter.when_isSyncActionFilter', () => {
        let invoked = false;
        let callback;
        let request = { path: 'test' };
        let config: IRouterConfig = {
            routerCb: () => {
                return { use: cb => callback = cb };
            }
        } as any;
        let res = { locals: { dino: { result: 45 } } };
        let provider = { useClass: Function, data: 'sampledata' };
        spyOn(DinoParser, 'parseMiddlewareProvider').and.callFake(a => a);
        spyOn(DinoUtility, 'isSyncActionFilter').and.callFake(() => true);

        let dinoRouter = new DinoRouter(config);

        // Spy on the same object method itself
        spyOn(dinoRouter, 'resolve')
            .and.callFake((middleware, dino) => {
                expect(middleware).toBe(Function);
                expect(dino).toBe(res.locals.dino);

                return {
                    afterExecution: (req, resp, next, result, data) => {
                        expect(req).toBe(request);
                        expect(res).toBe(res);
                        expect(next()).toBe('invoked');
                        expect(result).toBe(res.locals.dino.result);
                        expect(data).toBe(provider.data);
                        invoked = true;
                    }
                };
            });

        dinoRouter.registerAfterActionFilter(provider);
        callback(request, res, () => 'invoked');
        expect(DinoUtility.isSyncActionFilter).toHaveBeenCalledTimes(1);
        expect(DinoParser.parseMiddlewareProvider).toHaveBeenCalledTimes(1);
        expect(invoked).toBeTruthy();
    });
    it('registerAfterActionFilter.when_isAsyncActionFilter', async () => {
        let callback;
        let request = { path: 'test' };
        let invoked = false;
        let config: IRouterConfig = {
            routerCb: () => {
                return { use: cb => callback = cb };
            }
        } as any;
        let provider = { useClass: Function, data: 'sampledata' };
        let res = { locals: { dino: { result: 45 } } };
        spyOn(DinoParser, 'parseMiddlewareProvider').and.callFake(a => a);
        spyOn(DinoUtility, 'isSyncActionFilter').and.callFake(() => false);
        spyOn(DinoUtility, 'isAsyncActionFilter').and.callFake(() => true);

        let dinoRouter = new DinoRouter(config);

        // Spy on the same object method itself
        spyOn(dinoRouter, 'resolve')
            .and.callFake((middleware, dino) => {
                expect(middleware).toBe(Function);
                expect(dino).toBe(res.locals.dino);

                return {
                    afterExecution: (req, resp, next, result, data) => {
                        expect(req).toBe(request);
                        expect(resp).toBe(res);
                        expect(next()).toBe('invoked');
                        expect(result).toBe(res.locals.dino.result);
                        expect(data).toBe(provider.data);
                        invoked = true;
                    }
                };
            });

        dinoRouter.registerAfterActionFilter(provider);
        await callback(request, res, () => 'invoked');
        expect(DinoUtility.isSyncActionFilter).toHaveBeenCalledTimes(1);
        expect(DinoUtility.isAsyncActionFilter).toHaveBeenCalledTimes(1);
        expect(DinoParser.parseMiddlewareProvider).toHaveBeenCalledTimes(1);
        expect(invoked).toBeTruthy();
    });
    it('registerAfterActionFilter.throwsError_when_isAsyncActionFilter', async () => {
        let callback;
        let err;
        let request = { path: 'test' };
        let config: IRouterConfig = {
            routerCb: () => {
                return { use: cb => callback = cb };
            }
        } as any;
        let provider = { useClass: Function, data: 'sampledata' };
        let res = { locals: { dino: { result: 45 } } };
        spyOn(DinoParser, 'parseMiddlewareProvider').and.callFake(a => a);
        spyOn(DinoUtility, 'isSyncActionFilter').and.callFake(() => false);
        spyOn(DinoUtility, 'isAsyncActionFilter').and.callFake(() => true);

        let dinoRouter = new DinoRouter(config);

        // Spy on the same object method itself
        spyOn(dinoRouter, 'resolve')
            .and.callFake((middleware, dino) => {
                expect(middleware).toBe(Function);
                expect(dino).toBe(res.locals.dino);

                return {
                    afterExecution: (req, resp, next, result, data) => {
                        expect(req).toBe(request);
                        expect(resp).toBe(res);
                        // expect(c) not invoked because it should invoke next(err)
                        expect(result).toBe(res.locals.dino.result);
                        expect(data).toBe(provider.data);
                        throw new Error('TestError');
                    }
                };
            });

        dinoRouter.registerAfterActionFilter(provider);
        await callback(request, res, e => err = e);
        expect(DinoUtility.isSyncActionFilter).toHaveBeenCalledTimes(1);
        expect(DinoUtility.isAsyncActionFilter).toHaveBeenCalledTimes(1);
        expect(DinoParser.parseMiddlewareProvider).toHaveBeenCalledTimes(1);
        expect(err).toEqual(new Error('TestError'));
    });
    it('registerAfterActionFilter.when_not_an_actionFilter', () => {
        let callback;
        let config: IRouterConfig = {
            routerCb: () => {
                return { use: cb => callback = cb };
            }
        } as any;
        spyOn(DinoParser, 'parseMiddlewareProvider').and.callFake(a => a);
        spyOn(DinoUtility, 'isSyncActionFilter').and.callFake(() => false);
        spyOn(DinoUtility, 'isAsyncActionFilter').and.callFake(() => false);

        let dinoRouter = new DinoRouter(config);
        dinoRouter.registerAfterActionFilter(String);
        expect(DinoUtility.isSyncActionFilter).toHaveBeenCalledTimes(1);
        expect(DinoUtility.isAsyncActionFilter).toHaveBeenCalledTimes(1);
        expect(DinoParser.parseMiddlewareProvider).toHaveBeenCalledTimes(1);
        expect(callback).toBeUndefined();
    });
    it('registerResultFilter.when_isSyncResultFilter', () => {
        let invoked = false;
        let callback;
        let request = { path: 'test' };
        let config: IRouterConfig = {
            routerCb: () => {
                return { use: cb => callback = cb };
            }
        } as any;
        let res = { locals: { dino: { result: 45 } } };
        let provider = { useClass: Function, data: 'sampledata' };
        spyOn(DinoParser, 'parseMiddlewareProvider').and.callFake(a => a);
        spyOn(DinoUtility, 'isSyncResultFilter').and.callFake(() => true);

        let dinoRouter = new DinoRouter(config);

        // Spy on the same object method itself
        spyOn(dinoRouter, 'resolve')
            .and.callFake((middleware, dino) => {
                expect(middleware).toBe(Function);
                expect(dino).toBe(res.locals.dino);

                return {
                    invoke: (req, resp, next, result, data) => {
                        expect(req).toBe(request);
                        expect(res).toBe(res);
                        expect(next()).toBe('invoked');
                        expect(result).toBe(res.locals.dino.result);
                        expect(data).toBe(provider.data);
                        invoked = true;
                    }
                };
            });

        dinoRouter.registerResultFilter(provider);
        callback(request, res, () => 'invoked');
        expect(DinoUtility.isSyncResultFilter).toHaveBeenCalledTimes(1);
        expect(DinoParser.parseMiddlewareProvider).toHaveBeenCalledTimes(1);
        expect(invoked).toBeTruthy();
    });
    it('registerResultFilter.when_isAsyncResultFilter', async () => {
        let callback;
        let request = { path: 'test' };
        let invoked = false;
        let config: IRouterConfig = {
            routerCb: () => {
                return { use: cb => callback = cb };
            }
        } as any;
        let provider = { useClass: Function, data: 'sampledata' };
        let res = { locals: { dino: { result: 45 } } };
        spyOn(DinoParser, 'parseMiddlewareProvider').and.callFake(a => a);
        spyOn(DinoUtility, 'isSyncResultFilter').and.callFake(() => false);
        spyOn(DinoUtility, 'isAsyncResultFilter').and.callFake(() => true);

        let dinoRouter = new DinoRouter(config);

        // Spy on the same object method itself
        spyOn(dinoRouter, 'resolve')
            .and.callFake((middleware, dino) => {
                expect(middleware).toBe(Function);
                expect(dino).toBe(res.locals.dino);

                return {
                    invoke: (req, resp, next, result, data) => {
                        expect(req).toBe(request);
                        expect(resp).toBe(res);
                        expect(next()).toBe('invoked');
                        expect(result).toBe(res.locals.dino.result);
                        expect(data).toBe(provider.data);
                        invoked = true;
                    }
                };
            });

        dinoRouter.registerResultFilter(provider);
        await callback(request, res, () => 'invoked');
        expect(DinoUtility.isSyncResultFilter).toHaveBeenCalledTimes(1);
        expect(DinoUtility.isAsyncResultFilter).toHaveBeenCalledTimes(1);
        expect(DinoParser.parseMiddlewareProvider).toHaveBeenCalledTimes(1);
        expect(invoked).toBeTruthy();
    });
    it('registerResultFilter.throwsError_when_isAsyncResultFilter', async () => {
        let callback;
        let err;
        let request = { path: 'test' };
        let config: IRouterConfig = {
            routerCb: () => {
                return { use: cb => callback = cb };
            }
        } as any;
        let provider = { useClass: Function, data: 'sampledata' };
        let res = { locals: { dino: { result: 45 } } };
        spyOn(DinoParser, 'parseMiddlewareProvider').and.callFake(a => a);
        spyOn(DinoUtility, 'isSyncResultFilter').and.callFake(() => false);
        spyOn(DinoUtility, 'isAsyncResultFilter').and.callFake(() => true);

        let dinoRouter = new DinoRouter(config);

        // Spy on the same object method itself
        spyOn(dinoRouter, 'resolve')
            .and.callFake((middleware, dino) => {
                expect(middleware).toBe(Function);
                expect(dino).toBe(res.locals.dino);

                return {
                    invoke: (req, resp, next, result, data) => {
                        expect(req).toBe(request);
                        expect(resp).toBe(res);
                        // expect(c) not invoked because it should invoke next(err)
                        expect(result).toBe(res.locals.dino.result);
                        expect(data).toBe(provider.data);
                        throw new Error('TestError');
                    }
                };
            });

        dinoRouter.registerResultFilter(provider);
        await callback(request, res, e => err = e);
        expect(DinoUtility.isSyncResultFilter).toHaveBeenCalledTimes(1);
        expect(DinoUtility.isAsyncResultFilter).toHaveBeenCalledTimes(1);
        expect(DinoParser.parseMiddlewareProvider).toHaveBeenCalledTimes(1);
        expect(err).toEqual(new Error('TestError'));
    });
    it('registerResultFilter.when_not_an_resultFilter', () => {
        let callback;
        let config: IRouterConfig = {
            routerCb: () => {
                return { use: cb => callback = cb };
            }
        } as any;
        spyOn(DinoParser, 'parseMiddlewareProvider').and.callFake(a => a);
        spyOn(DinoUtility, 'isSyncResultFilter').and.callFake(() => false);
        spyOn(DinoUtility, 'isAsyncResultFilter').and.callFake(() => false);

        let dinoRouter = new DinoRouter(config);
        dinoRouter.registerResultFilter(String);
        expect(DinoUtility.isSyncResultFilter).toHaveBeenCalledTimes(1);
        expect(DinoUtility.isAsyncResultFilter).toHaveBeenCalledTimes(1);
        expect(DinoParser.parseMiddlewareProvider).toHaveBeenCalledTimes(1);
        expect(callback).toBeUndefined();
    });
    it('registerExceptionFilter.when_isSyncExceptionFilter', () => {
        let invoked = false;
        let callback;
        let request = { path: 'test' };
        let config: IRouterConfig = { routerCb: () => null } as any;
        let ruri = 'sampleuri';
        let app = {
            use: (uri, cb) => {
                expect(uri).toBe(ruri);
                callback = cb;
            }
        };
        let res = { locals: { dino: 45 } };
        let provider = { useClass: Function, data: 'sampledata' };
        spyOn(DinoParser, 'parseMiddlewareProvider').and.callFake(a => a);
        spyOn(DinoUtility, 'isSyncExceptionFilter').and.callFake(() => true);

        let dinoRouter = new DinoRouter(config);

        // Spy on the same object method itself
        spyOn(dinoRouter, 'resolve')
            .and.callFake((middleware, dino) => {
                expect(middleware).toBe(Function);
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

        dinoRouter.registerExceptionFilter(app as any, ruri, provider);
        callback(new Error('TestError'), request, res, () => 'invoked');
        expect(DinoUtility.isSyncExceptionFilter).toHaveBeenCalledTimes(1);
        expect(DinoParser.parseMiddlewareProvider).toHaveBeenCalledTimes(1);
        expect(invoked).toBeTruthy();
    });
    it('registerExceptionFilter.when_isAsyncExceptionFilter', async () => {
        let invoked = false;
        let callback;
        let request = { path: 'test' };
        let config: IRouterConfig = { routerCb: () => null } as any;
        let ruri = 'sampleuri';
        let app = {
            use: (uri, cb) => {
                expect(uri).toBe(ruri);
                callback = cb;
            }
        };
        let res = { locals: { dino: 45 } };
        let provider = { useClass: Function, data: 'sampledata' };
        spyOn(DinoParser, 'parseMiddlewareProvider').and.callFake(a => a);
        spyOn(DinoUtility, 'isSyncExceptionFilter').and.callFake(() => false);
        spyOn(DinoUtility, 'isAsyncExceptionFilter').and.callFake(() => true);

        let dinoRouter = new DinoRouter(config);

        // Spy on the same object method itself
        spyOn(dinoRouter, 'resolve')
            .and.callFake((middleware, dino) => {
                expect(middleware).toBe(Function);
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

        dinoRouter.registerExceptionFilter(app as any, ruri, provider);
        await callback(new Error('TestError'), request, res, () => 'invoked');
        expect(DinoUtility.isSyncExceptionFilter).toHaveBeenCalledTimes(1);
        expect(DinoUtility.isAsyncExceptionFilter).toHaveBeenCalledTimes(1);
        expect(DinoParser.parseMiddlewareProvider).toHaveBeenCalledTimes(1);
        expect(invoked).toBeTruthy();
    });
    it('registerExceptionFilter.throwsError_when_isAsyncExceptionFilter', async () => {
        let invoked = false;
        let callback;
        let request = { path: 'test' };
        let err;
        let config: IRouterConfig = { routerCb: () => null } as any;
        let ruri = 'sampleuri';
        let app = {
            use: (uri, cb) => {
                expect(uri).toBe(ruri);
                callback = cb;
            }
        };
        let res = { locals: { dino: 45 } };
        let provider = { useClass: Function, data: 'sampledata' };
        spyOn(DinoParser, 'parseMiddlewareProvider').and.callFake(a => a);
        spyOn(DinoUtility, 'isSyncExceptionFilter').and.callFake(() => false);
        spyOn(DinoUtility, 'isAsyncExceptionFilter').and.callFake(() => true);

        let dinoRouter = new DinoRouter(config);

        // Spy on the same object method itself
        spyOn(dinoRouter, 'resolve')
            .and.callFake((middleware, dino) => {
                expect(middleware).toBe(Function);
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

        dinoRouter.registerExceptionFilter(app as any, ruri, provider);
        await callback(new Error('TestError'), request, res, e => err = e);
        expect(DinoUtility.isSyncExceptionFilter).toHaveBeenCalledTimes(1);
        expect(DinoUtility.isAsyncExceptionFilter).toHaveBeenCalledTimes(1);
        expect(DinoParser.parseMiddlewareProvider).toHaveBeenCalledTimes(1);
        expect(err).toEqual(new Error('TestErrorThrown'));
    });
    it('registerExceptionFilter.when_not_an_exceptionfilter', () => {
        let callback;
        let config: IRouterConfig = { routerCb: () => null } as any;
        let app = {
            use: (uri, cb) => {
                callback = cb;
            }
        };
        spyOn(DinoParser, 'parseMiddlewareProvider').and.callFake(a => a);
        spyOn(DinoUtility, 'isSyncExceptionFilter').and.callFake(() => false);
        spyOn(DinoUtility, 'isAsyncExceptionFilter').and.callFake(() => false);

        let dinoRouter = new DinoRouter(config);
        dinoRouter.registerExceptionFilter(app as any, 'test', String);
        expect(DinoUtility.isSyncExceptionFilter).toHaveBeenCalledTimes(1);
        expect(DinoUtility.isAsyncExceptionFilter).toHaveBeenCalledTimes(1);
        expect(DinoParser.parseMiddlewareProvider).toHaveBeenCalledTimes(1);
        expect(callback).toBeUndefined();
    });
    it('registerExceptionFilters.verify_exceptionFilters', () => {
        let config: IRouterConfig = { routerCb: () => null } as any;
        let dinoRouter = new DinoRouter(config);
        let app = { express: true };
        let provider = [
            { useClass: Function, data: 'sampledata' },
            { useClass: String, data: 'sampledata' }
        ];
        let arr = [];
        // Spy on the same object method itself
        spyOn(dinoRouter, 'registerExceptionFilter')
            .and.callFake((lapp, uri, filter) => {
                expect(lapp).toBe(app);
                expect(uri).toBe('testUri');
                arr.push(filter.useClass);
            });

        dinoRouter.registerExceptionFilters(app as any, 'testUri', provider);
        expect(arr.includes(Function)).toBeTruthy();
        expect(arr.includes(String)).toBeTruthy();
    });
    it('registerMiddlewares.verify_middlewares', () => {
        let config: IRouterConfig = { routerCb: () => null } as any;
        let dinoRouter = new DinoRouter(config);
        let app = { express: true };
        let provider = [
            { useClass: Number, data: 'sampledata' },
            { useClass: String, data: 'sampledata' }
        ];
        let arr = [];
        // Spy on the same object method itself
        spyOn(dinoRouter, 'registerMiddleware')
            .and.callFake(filter => {
                arr.push(filter.useClass);
            });

        dinoRouter.registerMiddlewares(provider);
        expect(arr.includes(Number)).toBeTruthy();
        expect(arr.includes(String)).toBeTruthy();
    });
    it('registerBeginActionFilters.verify_beginActionFilters', () => {
        let config: IRouterConfig = { routerCb: () => null } as any;
        let dinoRouter = new DinoRouter(config);
        let app = { express: true };
        let provider = [
            { useClass: Object, data: 'sampledata' },
            { useClass: String, data: 'sampledata' }
        ];
        let arr = [];
        // Spy on the same object method itself
        spyOn(dinoRouter, 'registerBeginActionFilter')
            .and.callFake(filter => {
                arr.push(filter.useClass);
            });

        dinoRouter.registerBeginActionFilters(provider);
        expect(arr.includes(Object)).toBeTruthy();
        expect(arr.includes(String)).toBeTruthy();
    });
    it('registerAfterActionFilters.verify_afterActionFilters', () => {
        let config: IRouterConfig = { routerCb: () => null } as any;
        let dinoRouter = new DinoRouter(config);
        let app = { express: true };
        let provider = [
            { useClass: Object, data: 'sampledata' },
            { useClass: Array, data: 'sampledata' }
        ];
        let arr = [];
        // Spy on the same object method itself
        spyOn(dinoRouter, 'registerAfterActionFilter')
            .and.callFake(filter => {
                arr.push(filter.useClass);
            });

        dinoRouter.registerAfterActionFilters(provider);
        expect(arr.includes(Object)).toBeTruthy();
        expect(arr.includes(Array)).toBeTruthy();
    });
    it('registerResultFilters.verify_resultFilters', () => {
        let config: IRouterConfig = { routerCb: () => null } as any;
        let dinoRouter = new DinoRouter(config);
        let app = { express: true };
        let provider = [
            { useClass: Object, data: 'sampledata' },
            { useClass: Function, data: 'sampledata' }
        ];
        let arr = [];
        // Spy on the same object method itself
        spyOn(dinoRouter, 'registerResultFilter')
            .and.callFake(filter => {
                arr.push(filter.useClass);
            });

        dinoRouter.registerResultFilters(provider);
        expect(arr.includes(Object)).toBeTruthy();
        expect(arr.includes(Function)).toBeTruthy();
    });
});
