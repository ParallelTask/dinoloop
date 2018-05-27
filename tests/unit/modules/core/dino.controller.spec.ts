import {
    DinoController,
    ApiController,
    ControllerAction,
    DinoResponse,
    DinoModel,
    RouteUtility,
    HttpUtility,
    Validator,
    InvalidModelException,
    IDinoResponse
} from '../../index';

class Test { }

describe('modules.core.dino.controller.spec', () => {
    it('patch.verify_values_are_attached', () => {
        let throwInvokedNext = false;
        let proceedInvokedNext = false;
        let obj = {} as ApiController;
        let ca = {} as ControllerAction;
        let ctrl = new DinoController(obj, ca);
        let req = {};
        let res = { locals: { dino: { id: 111 } } };
        let next = x => {
            if (x instanceof Error) {
                throwInvokedNext = true;
            } else {
                proceedInvokedNext = true;
            }
        };

        ctrl.patch(req, res, next);
        let dino = obj.dino as IDinoResponse;
        expect(obj.request).toBe(req);
        expect(obj.response).toBe(res);
        expect(obj.next).toBe(next);
        expect(obj.dino).toBe(res.locals.dino as DinoResponse);
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
        let dino = obj.dino as IDinoResponse;
        expect(dino.result).toBe(result);
        expect(obj.next()).toBe(45);
    });
    it('attachResultToDino.sendsResponse_true', () => {
        let obj: ApiController = {
            dino: {}
        } as any;
        let result = { a: 15 };
        let ctrl = new DinoController(obj, {});
        ctrl.attachResultToDino(true, result);
        let dino = obj.dino as IDinoResponse;
        expect(dino.result).toBeUndefined();
    });
    it('getModelFromBody.no_httpbody_and_bindmodel_undefined', () => {
        let ctrl = new DinoController({} as any, { bindsModel: undefined });
        spyOn(HttpUtility, 'hasBody').and.callFake(() => false);
        let model = ctrl.getModelFromBody('get');
        expect(model.value).toBeUndefined();
        expect(model.type).toBeUndefined();
        expect(model.errors).toBeUndefined();
        expect(model.isValid).toBeUndefined();
    });
    it('getModelFromBody.httpbody_exists_and_bindmodel_undefined', () => {
        let ctrl = new DinoController({} as any, { bindsModel: undefined });
        spyOn(HttpUtility, 'hasBody').and.callFake(() => true);
        let model = ctrl.getModelFromBody('post');
        expect(model.value).toBeUndefined();
        expect(model.type).toBeUndefined();
        expect(model.errors).toBeUndefined();
        expect(model.isValid).toBeUndefined();
    });
    it('getModelFromBody.httpbody_exists_raiseModelError_is_false_and_no_errs', () => {
        let invoked = false;
        let ca: ControllerAction = {
            bindsModel: {
                model: Test,
                options: { raiseModelError: false }
            }
        };
        let ctx: ApiController = {
            request: {
                body: { test: 'sample' }
            },
            next: e => invoked = true
        } as any;
        let ctrl = new DinoController(ctx, ca);

        spyOn(HttpUtility, 'hasBody').and.callFake(() => true);
        spyOn(Validator, 'tryValidateWithType').and.callFake(() => []);

        let model = ctrl.getModelFromBody('post');
        expect(model.value).toBe(ctx.request.body);
        expect(model.type).toBe(ca.bindsModel.model);
        expect(model.errors).toEqual([]);
        expect(model.isValid).toBeTruthy();
        expect(invoked).toBeFalsy();
    });
    it('getModelFromBody.httpbody_exists_raiseModelError_is_false_with_errs', () => {
        let invoked = false;
        let ca: ControllerAction = {
            bindsModel: {
                model: Test,
                options: { raiseModelError: false }
            }
        };
        let ctx: ApiController = {
            request: {
                body: { test: 'sample' }
            },
            next: e => invoked = true
        } as any;
        let ctrl = new DinoController(ctx, ca);

        spyOn(HttpUtility, 'hasBody').and.callFake(() => true);
        spyOn(Validator, 'tryValidateWithType')
            .and.callFake(() => ['testerror']);

        let model = ctrl.getModelFromBody('post');
        expect(model.value).toBe(ctx.request.body);
        expect(model.type).toBe(ca.bindsModel.model);
        expect(model.errors).toEqual(['testerror']);
        expect(model.isValid).toBeFalsy();
        expect(invoked).toBeFalsy();
    });
    it('getModelFromBody.httpbody_exists_and_raiseModelError_true_with_errs', () => {
        let err: InvalidModelException;
        let ca: ControllerAction = {
            bindsModel: {
                model: Test,
                options: { raiseModelError: true }
            }
        };
        let ctx: ApiController = {
            request: {
                body: { test: 'sample' }
            },
            next: e => err = e
        } as any;
        let ctrl = new DinoController(ctx, ca);

        spyOn(HttpUtility, 'hasBody').and.callFake(() => true);
        spyOn(Validator, 'tryValidateWithType')
            .and.callFake(() => ['testerror']);

        let model = ctrl.getModelFromBody('post');
        expect(model.value).toBe(ctx.request.body);
        expect(model.type).toBe(ca.bindsModel.model);
        expect(model.errors).toEqual(['testerror']);
        expect(model.isValid).toBeFalsy();
        expect(err.errors).toEqual(['testerror']);
        expect(err.model).toBe(ca.bindsModel.model);
        expect(err.value).toBe(ctx.request.body);
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

        let ctrl = new DinoController(ctx, {});
        spyOn(RouteUtility, 'mapSegmentsAndQueryToActionArguments')
            .and.callFake(() => []);
        spyOn(HttpUtility, 'hasBody').and.callFake(() => false);
        spyOn(ctrl, 'getModelFromBody').and.callFake(() => null);
        spyOn(ctrl, 'attachResultToDino')
            .and.callFake((sendsResponse, result) => {
                expect(result).toBe(45);
            });

        ctrl.invoke('test', 'get', 'sample');
        expect(ctrl.getModelFromBody).toHaveBeenCalledTimes(1);
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

        let ctrl = new DinoController(ctx, {});
        spyOn(RouteUtility, 'mapSegmentsAndQueryToActionArguments')
            .and.callFake(() => []);
        spyOn(HttpUtility, 'hasBody').and.callFake(() => true);
        spyOn(ctrl, 'getModelFromBody').and.callFake(() => null);
        spyOn(ctrl, 'attachResultToDino')
            .and.callFake((sendsResponse, result) => {
                expect(result).toBe(45);
            });

        ctrl.invoke('test', 'get', 'sample');
        expect(ctrl.getModelFromBody).toHaveBeenCalledTimes(1);
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

        let ctrl = new DinoController(ctx, {});
        spyOn(RouteUtility, 'mapSegmentsAndQueryToActionArguments')
            .and.callFake(() => ['hello', 'world']);
        spyOn(HttpUtility, 'hasBody').and.callFake(() => false);
        spyOn(ctrl, 'getModelFromBody').and.callFake(() => null);
        spyOn(ctrl, 'attachResultToDino')
            .and.callFake((sendsResponse, result) => {
                expect(result).toBe(45);
            });

        ctrl.invoke('test', 'get', 'sample');
        expect(ctrl.getModelFromBody).toHaveBeenCalledTimes(1);
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

        let ctrl = new DinoController(ctx, {});
        spyOn(RouteUtility, 'mapSegmentsAndQueryToActionArguments')
            .and.callFake(() => [undefined, 'hello', 'world']);
        spyOn(HttpUtility, 'hasBody').and.callFake(() => true);
        spyOn(ctrl, 'getModelFromBody').and.callFake(() => null);
        spyOn(ctrl, 'attachResultToDino')
            .and.callFake((sendsResponse, result) => {
                expect(result).toBe(45);
            });

        ctrl.invoke('test', 'get', 'sample');
        expect(ctrl.getModelFromBody).toHaveBeenCalledTimes(1);
        expect(ctrl.attachResultToDino).toHaveBeenCalledTimes(1);
        expect(val[0]).toBe(ctx.request.body);
        expect(val[1]).toBe('hello');
        expect(val[2]).toBe('world');
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

        let ctrl = new DinoController(ctx, {});
        spyOn(RouteUtility, 'mapSegmentsAndQueryToActionArguments')
            .and.callFake(() => []);
        spyOn(HttpUtility, 'hasBody').and.callFake(() => false);
        spyOn(ctrl, 'getModelFromBody').and.callFake(() => null);
        spyOn(ctrl, 'attachResultToDino')
            .and.callFake((sendsResponse, result) => {
                expect(result).toBe(45);
            });

        await ctrl.invokeAsync('test', 'get', 'sample');
        expect(ctrl.getModelFromBody).toHaveBeenCalledTimes(1);
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

        let ctrl = new DinoController(ctx, {});
        spyOn(RouteUtility, 'mapSegmentsAndQueryToActionArguments')
            .and.callFake(() => []);
        spyOn(HttpUtility, 'hasBody').and.callFake(() => true);
        spyOn(ctrl, 'getModelFromBody').and.callFake(() => null);
        spyOn(ctrl, 'attachResultToDino')
            .and.callFake((sendsResponse, result) => {
                expect(result).toBe(45);
            });

        await ctrl.invokeAsync('test', 'get', 'sample');
        expect(ctrl.getModelFromBody).toHaveBeenCalledTimes(1);
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

        let ctrl = new DinoController(ctx, {});
        spyOn(RouteUtility, 'mapSegmentsAndQueryToActionArguments')
            .and.callFake(() => ['hello', 'world']);
        spyOn(HttpUtility, 'hasBody').and.callFake(() => false);
        spyOn(ctrl, 'getModelFromBody').and.callFake(() => null);
        spyOn(ctrl, 'attachResultToDino')
            .and.callFake((sendsResponse, result) => {
                expect(result).toBe(45);
            });

        await ctrl.invokeAsync('test', 'get', 'sample');
        expect(ctrl.getModelFromBody).toHaveBeenCalledTimes(1);
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

        let ctrl = new DinoController(ctx, {});
        spyOn(RouteUtility, 'mapSegmentsAndQueryToActionArguments')
            .and.callFake(() => [undefined, 'hello', 'world']);
        spyOn(HttpUtility, 'hasBody').and.callFake(() => true);
        spyOn(ctrl, 'getModelFromBody').and.callFake(() => null);
        spyOn(ctrl, 'attachResultToDino')
            .and.callFake((sendsResponse, result) => {
                expect(result).toBe(45);
            });

        await ctrl.invokeAsync('test', 'get', 'sample');
        expect(ctrl.getModelFromBody).toHaveBeenCalledTimes(1);
        expect(ctrl.attachResultToDino).toHaveBeenCalledTimes(1);
        expect(val[0]).toBe(ctx.request.body);
        expect(val[1]).toBe('hello');
        expect(val[2]).toBe('world');
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

        let ctrl = new DinoController(ctx, {});
        spyOn(RouteUtility, 'mapSegmentsAndQueryToActionArguments')
            .and.callFake(() => ['hello', 'world']);
        spyOn(HttpUtility, 'hasBody').and.callFake(() => false);
        spyOn(ctrl, 'getModelFromBody').and.callFake(() => null);
        spyOn(ctrl, 'attachResultToDino')
            .and.callFake((sendsResponse, result) => {
                expect(result).toBe(45);
            });

        await ctrl.invokeAsync('test', 'get', 'sample');
        expect(err).toEqual(new Error('TestError'));
        expect(ctrl.getModelFromBody).toHaveBeenCalledTimes(1);
        expect(ctrl.attachResultToDino).toHaveBeenCalledTimes(0);
    });
});
