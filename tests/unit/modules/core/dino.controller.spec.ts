import {
    DinoController,
    ApiController,
    ControllerAction,
    DinoModel,
    RouteUtility,
    HttpUtility,
    IDinoProperties,
    IParseAttribute,
    IKeyValuePair,
    FunctionUtility
} from '../../index';

describe('modules.core.dino.controller.spec', () => {
    it('getQueryParams.returns_{ id: 45 }_when_?id=45', () => {
        let actionParams: IParseAttribute[] = [{
            key: 'id',
            isQueryParam: true
        }, {
            key: 'b',
            isQueryParam: false
        }];
        let obj = {
            request: {
                query: {
                    id: 45
                }
            }
        } as ApiController;
        let ca = {
            actionAttributes: {
                actionArguments: actionParams
            }
        } as ControllerAction;
        let ctrl = new DinoController(obj, ca);
        const result = ctrl.getQueryParams();
        expect(result.id).toBe(45);
        expect(result.b).toBe(undefined);
    });
    it('raiseActionParamsHandlers.invoke_for_matched_keys', () => {
        let user;
        let id;
        let uuid;
        let values: IKeyValuePair[] = [{
            key: 'id',
            value: '45'
        }, {
            key: 'user',
            value: 'john'
        }];
        let actionParams: IParseAttribute[] = [{
            key: 'id',
            handler: () => id = 45
        }, {
            key: 'user',
            handler: () => user = 'john'
        }, {
            key: 'uuid',
            handler: () => uuid = 'xyz'
        }];
        let obj = {
            model: new DinoModel()
        } as ApiController;
        let ca = {
            actionAttributes: {
                actionArguments: actionParams
            }
        } as ControllerAction;
        let ctrl = new DinoController(obj, ca);
        ctrl.raiseActionParamsHandlers(values);
        expect(user).toBe('john');
        expect(id).toBe(45);
        expect(uuid).toBe(undefined);
    });
    it('patch.verify_values_are_attached', () => {
        let throwInvokedNext = false;
        let proceedInvokedNext = false;
        let obj = {} as ApiController;
        let ca = {
            actionAttributes: {
                returns: {}
            }
        } as ControllerAction;
        let ctrl = new DinoController(obj, ca);
        let req = {} as any;
        let res = { locals: { dino: { id: 111 } } } as any;
        let next = x => {
            if (x instanceof Error) {
                throwInvokedNext = true;
            } else {
                proceedInvokedNext = true;
            }
        };

        ctrl.patch(req, res, next);
        let dino = obj.dino as IDinoProperties;
        expect(obj.request).toBe(req);
        expect(obj.response).toBe(res);
        expect(obj.next).toBe(next);
        expect(obj.dino).toBe(res.locals.dino as IDinoProperties);
        expect(obj.model instanceof DinoModel).toBeTruthy();

        dino.proceed(45);
        expect(dino.result).toBe(45);
        expect(proceedInvokedNext).toBeTruthy();

        dino.throw(new Error());
        expect(throwInvokedNext).toBeTruthy();
    });
    it('static_create.verify_constructor_invoked', () => {
        let ctrl = DinoController.create(
            {} as ApiController,
            {} as ControllerAction);
        expect(ctrl instanceof DinoController).toBeTruthy();
    });
    it('attachResultToDino.sendsResponse_false', () => {
        let obj: ApiController = {
            next: () => 45,
            dino: {}
        } as any;
        let result = { a: 15 };
        let ctrl = new DinoController(obj, {});
        ctrl.attachResultToDino(false, result);
        let dino = obj.dino as IDinoProperties;
        expect(dino.result).toBe(result);
        expect(obj.next() as any).toBe(45);
    });
    it('attachResultToDino.sendsResponse_true', () => {
        let obj: ApiController = {
            dino: {}
        } as any;
        let result = { a: 15 };
        let ctrl = new DinoController(obj, {});
        ctrl.attachResultToDino(true, result);
        let dino = obj.dino as IDinoProperties;
        expect(dino.result).toBeUndefined();
    });
    it('invoke.when_mappedSegments_[]_and_body_false', () => {
        let val = [];
        let ctx = {
            request: {},
            test: a => {
                val[0] = a;

                return 45;
            }
        } as any;

        let ctrl = new DinoController(ctx, {
            actionAttributes: {
                route: '/test',
                actionArguments: []
            }
        });
        spyOn(RouteUtility, 'mapSegmentsAndQueryToActionArguments')
            .and.callFake(() => []);
        spyOn(HttpUtility, 'hasBody').and.callFake(() => false);
        spyOn(ctrl, 'attachResultToDino')
            .and.callFake((sendsResponse, result) => {
                expect(result).toBe(45);
            });

        ctrl.invoke('test');
        expect(ctrl.attachResultToDino).toHaveBeenCalledTimes(1);
        expect(val[0]).toBeUndefined();
    });
    it('invoke.when_mappedSegments_[]_and_body_true', () => {
        let val = [];
        let ctx = {
            request: {
                body: 'testBody'
            },
            test: a => {
                val[0] = a;

                return 45;
            }
        } as any;

        let ctrl = new DinoController(ctx, {
            actionAttributes: {
                route: '/test',
                actionArguments: [{
                    paramIndex: 0,
                    handler: () => 'testBody'
                }]
            }
        });
        spyOn(FunctionUtility, 'getParamNames').and.callFake(() => ['body']);
        spyOn(HttpUtility, 'hasBody').and.callFake(() => true);
        spyOn(ctrl, 'attachResultToDino')
            .and.callFake((sendsResponse, result) => {
                expect(result).toBe(45);
            });
        spyOn(ctrl, 'mapSegments')
            .and.callFake(() => []);

        ctrl.invoke('test');
        expect(ctrl.attachResultToDino).toHaveBeenCalledTimes(1);
        expect(val[0]).toBe(ctx.request.body);
    });
    it('invoke.when_mappedSegments_[hello,world]_and_body_false', () => {
        let val = [];
        let ctx = {
            request: {},
            test: (a, b) => {
                val[0] = a;
                val[1] = b;

                return 45;
            }
        } as any;

        let ctrl = new DinoController(ctx, {
            actionAttributes: {
                route: '/test',
                actionArguments: []
            }
        });
        spyOn(RouteUtility, 'mapSegmentsAndQueryToActionArguments')
            .and.callFake(() => [
                { key: 'a', value: 'hello' },
                { key: 'b', value: 'world' }
            ]);
        spyOn(HttpUtility, 'hasBody').and.callFake(() => false);
        spyOn(ctrl, 'attachResultToDino')
            .and.callFake((sendsResponse, result) => {
                expect(result).toBe(45);
            });

        ctrl.invoke('test');
        expect(ctrl.attachResultToDino).toHaveBeenCalledTimes(1);
        expect(val[0]).toBe('hello');
        expect(val[1]).toBe('world');
    });
    it('invoke.when_mappedSegments_[hello,world]_and_body_true', () => {
        let val = [];
        let ctx = {
            request: {
                body: 'testBody'
            },
            test: (a, b, c) => {
                val[0] = a;
                val[1] = b;
                val[2] = c;

                return 45;
            }
        } as any;

        let ctrl = new DinoController(ctx, {
            actionAttributes: {
                route: '/test',
                actionArguments: [
                    {
                        paramIndex: 0,
                        handler: () => 'testBody'
                    },
                    {
                        key: 'b',
                        handler: () => 'world'
                    },
                    {
                        key: 'a',
                        handler: () => 'hello'
                    }
                ]
            }
        });
        spyOn(FunctionUtility, 'getParamNames').and.callFake(() => ['body', 'a', 'b']);
        spyOn(RouteUtility, 'mapSegmentsAndQueryToActionArguments')
            .and.callFake(() => [
                { key: 'body', value: undefined },
                { key: 'a', value: 'hello' },
                { key: 'b', value: 'world' }
            ]);
        spyOn(HttpUtility, 'hasBody').and.callFake(() => true);
        spyOn(ctrl, 'attachResultToDino')
            .and.callFake((sendsResponse, result) => {
                expect(result).toBe(45);
            });

        ctrl.invoke('test');
        expect(ctrl.attachResultToDino).toHaveBeenCalledTimes(1);
        expect(val[0]).toBe(ctx.request.body);
        expect(val[1]).toBe('hello');
        expect(val[2]).toBe('world');
    });
    it('invoke.when_mappedSegments_has_body_key_and_also_body_true', () => {
        let val = [];
        let ctx = {
            request: {
                body: 'testBody'
            },
            test: (a, b) => {
                val[0] = a;
                val[1] = b;

                return 45;
            }
        } as any;

        let ctrl = new DinoController(ctx, {
            actionAttributes: {
                route: '/test',
                actionArguments: [
                    {
                        key: 'body',
                        paramIndex: 0,
                        handler: () => 'testBody'
                    },
                    {
                        key: 'a',
                        paramIndex: 1,
                        handler: () => 'hello'
                    }
                ]
            }
        });
        spyOn(FunctionUtility, 'getParamNames').and.callFake(() => ['body', 'a']);
        spyOn(RouteUtility, 'mapSegmentsAndQueryToActionArguments')
            .and.callFake(() => [
                { key: 'body', value: 'segment-body' },
                { key: 'a', value: 'hello' }
            ]);
        spyOn(HttpUtility, 'hasBody').and.callFake(() => true);
        spyOn(ctrl, 'attachResultToDino')
            .and.callFake((sendsResponse, result) => {
                expect(result).toBe(45);
            });

        ctrl.invoke('test');
        expect(ctrl.attachResultToDino).toHaveBeenCalledTimes(1);
        expect(val[0]).toBe(ctx.request.body);
        expect(val[1]).toBe('hello');
    });
    it('invokeAsync.when_mappedSegments_[]_has_body_is_false', async () => {
        let val = [];
        let ctx = {
            request: {},
            test: a => {
                val[0] = a;

                return 45;
            }
        } as any;

        let ctrl = new DinoController(ctx, {
            actionAttributes: {
                route: '/test',
                actionArguments: []
            }
        });
        spyOn(RouteUtility, 'mapSegmentsAndQueryToActionArguments')
            .and.callFake(() => []);
        spyOn(HttpUtility, 'hasBody').and.callFake(() => false);
        spyOn(ctrl, 'attachResultToDino')
            .and.callFake((sendsResponse, result) => {
                expect(result).toBe(45);
            });

        await ctrl.invokeAsync('test');
        expect(ctrl.attachResultToDino).toHaveBeenCalledTimes(1);
        expect(val[0]).toBeUndefined();
    });
    it('invokeAsync.when_mappedSegments_[]_has_body_is_true', async () => {
        let val = [];
        let ctx = {
            request: {
                body: 'testBody'
            },
            test: a => {
                val[0] = a;

                return 45;
            }
        } as any;

        let ctrl = new DinoController(ctx, {
            actionAttributes: {
                route: '/test',
                actionArguments: [{
                    paramIndex: 0,
                    handler: () => 'testBody'
                }]
            }
        });
        spyOn(FunctionUtility, 'getParamNames').and.callFake(() => ['body']);
        spyOn(HttpUtility, 'hasBody').and.callFake(() => true);
        spyOn(ctrl, 'attachResultToDino')
            .and.callFake((sendsResponse, result) => {
                expect(result).toBe(45);
            });
        spyOn(ctrl, 'mapSegments')
            .and.callFake(() => []);

        await ctrl.invokeAsync('test');
        expect(ctrl.attachResultToDino).toHaveBeenCalledTimes(1);
        expect(val[0]).toBe(ctx.request.body);
    });
    it('invokeAsync.when_mappedSegments_[hello,world]_has_body_is_false', async () => {
        let val = [];
        let ctx = {
            request: {},
            test: (a, b) => {
                val[0] = a;
                val[1] = b;

                return 45;
            }
        } as any;

        let ctrl = new DinoController(ctx, {
            actionAttributes: {
                route: '/test',
                actionArguments: []
            }
        });
        spyOn(RouteUtility, 'mapSegmentsAndQueryToActionArguments')
            .and.callFake(() => [
                { key: 'a', value: 'hello' },
                { key: 'b', value: 'world' }
            ]);
        spyOn(HttpUtility, 'hasBody').and.callFake(() => false);
        spyOn(ctrl, 'attachResultToDino')
            .and.callFake((sendsResponse, result) => {
                expect(result).toBe(45);
            });

        await ctrl.invokeAsync('test');
        expect(ctrl.attachResultToDino).toHaveBeenCalledTimes(1);
        expect(val[0]).toBe('hello');
        expect(val[1]).toBe('world');
    });
    it('invokeAsync.when_mappedSegments_[hello,world]_has_body_is_true', async () => {
        let val = [];
        let ctx = {
            request: {
                body: 'testBody'
            },
            test: (a, b, c) => {
                val[0] = a;
                val[1] = b;
                val[2] = c;

                return 45;
            }
        } as any;

        let ctrl = new DinoController(ctx, {
            actionAttributes: {
                route: '/test',
                actionArguments: [
                    {
                        paramIndex: 0,
                        handler: () => 'testBody'
                    },
                    {
                        key: 'b',
                        handler: () => 'world'
                    },
                    {
                        key: 'a',
                        handler: () => 'hello'
                    }
                ]
            }
        });
        spyOn(FunctionUtility, 'getParamNames').and.callFake(() => ['body', 'a', 'b']);
        spyOn(RouteUtility, 'mapSegmentsAndQueryToActionArguments')
            .and.callFake(() => [
                { key: 'body', value: undefined },
                { key: 'a', value: 'hello' },
                { key: 'b', value: 'world' }
            ]);
        spyOn(HttpUtility, 'hasBody').and.callFake(() => true);
        spyOn(ctrl, 'attachResultToDino')
            .and.callFake((sendsResponse, result) => {
                expect(result).toBe(45);
            });

        await ctrl.invokeAsync('test');
        expect(ctrl.attachResultToDino).toHaveBeenCalledTimes(1);
        expect(val[0]).toBe(ctx.request.body);
        expect(val[1]).toBe('hello');
        expect(val[2]).toBe('world');
    });
    it('invokeAsync.when_mappedSegments_has_body_key_and_also_body_true', async () => {
        let val = [];
        let ctx = {
            request: {
                body: 'testBody'
            },
            test: (a, b) => {
                val[0] = a;
                val[1] = b;

                return 45;
            }
        } as any;

        let ctrl = new DinoController(ctx, {
            actionAttributes: {
                route: '/test',
                actionArguments: [
                    {
                        key: 'body',
                        paramIndex: 0,
                        handler: () => 'testBody'
                    },
                    {
                        key: 'a',
                        paramIndex: 1,
                        handler: () => 'hello'
                    }
                ]
            }
        });
        spyOn(FunctionUtility, 'getParamNames').and.callFake(() => ['body', 'a']);
        spyOn(RouteUtility, 'mapSegmentsAndQueryToActionArguments')
            .and.callFake(() => [
                { key: 'body', value: 'segment-body' },
                { key: 'a', value: 'hello' }
            ]);
        spyOn(HttpUtility, 'hasBody').and.callFake(() => true);
        spyOn(ctrl, 'attachResultToDino')
            .and.callFake((sendsResponse, result) => {
                expect(result).toBe(45);
            });

        await ctrl.invoke('test');
        expect(ctrl.attachResultToDino).toHaveBeenCalledTimes(1);
        expect(val[0]).toBe(ctx.request.body);
        expect(val[1]).toBe('hello');
    });
    it('invokeAsync.throws_error', async () => {
        let err;
        let ctx = {
            request: {},
            test: a => {
                throw new Error('TestError');
            },
            next: e => err = e
        } as any;

        let ctrl = new DinoController(ctx, {
            actionAttributes: {
                route: '/test',
                actionArguments: []
            }
        });
        spyOn(RouteUtility, 'mapSegmentsAndQueryToActionArguments')
            .and.callFake(() => [
                { key: 'a', value: 'hello' },
                { key: 'b', value: 'world' }
            ]);
        spyOn(HttpUtility, 'hasBody').and.callFake(() => false);
        spyOn(ctrl, 'attachResultToDino')
            .and.callFake((sendsResponse, result) => {
                expect(result).toBe(45);
            });

        await ctrl.invokeAsync('test');
        expect(err).toEqual(new Error('TestError'));
        expect(ctrl.attachResultToDino).toHaveBeenCalledTimes(0);
    });
});
