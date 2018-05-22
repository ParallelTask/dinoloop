import {
    DinoController,
    ApiController,
    ControllerAction,
    DinoResponse,
    DinoModel,
    RouteUtility,
    HttpUtility,
    Validator,
    InvalidModelException
} from '../../index';

class Test { }

describe('modules.core.dino.controller.spec', () => {
    it('patch.verify_values_are_attached', () => {
        let invoked = false;
        let obj = {} as ApiController;
        let ca = {} as ControllerAction;
        let ctrl = new DinoController(obj, ca);
        let req = {};
        let res = { locals: { dino: { id: 111 } } };
        let next = x => {
            invoked = x instanceof Error ? undefined : true;

            return invoked;
        };

        ctrl.patch(req, res, next);

        expect(obj.request).toBe(req);
        expect(obj.response).toBe(res);
        expect(obj.next).toBe(next);
        expect(obj.dino).toBe(res.locals.dino as DinoResponse);
        expect(obj.model instanceof DinoModel).toBeTruthy();
        expect(obj.dino.proceed).toBeDefined();
        expect(obj.dino.throw).toBeDefined();
        obj.dino.proceed(45);
        expect(obj.dino.result).toBe(45);
        expect(invoked).toBeTruthy();
        obj.dino.throw(new Error());
        expect(invoked).toBeUndefined();
    });
    it('static_create.verify_constructor_invoked', () => {
        let obj = {} as ApiController;
        let ca = {} as ControllerAction;
        let ctrl = DinoController.create(obj, ca);
        expect(ctrl instanceof DinoController).toBeTruthy();
    });
    it('attachResultToDino.sendsResponse_false_observable_undefined', () => {
        let obj: ApiController = {
            next: () => 45, dino: {}
        } as any;
        let r = { a: 15 };
        let ctrl = new DinoController(obj, {});
        ctrl.attachResultToDino(false, undefined, r);

        expect(obj.dino.result).toBe(r);
        expect(obj.next).toBeDefined();
        expect(obj.next()).toBe(45);
    });
    it('attachResultToDino.sendsResponse_true_observable_undefined', () => {
        let invoked = false;
        let obj: ApiController = {
            next: () => invoked = true, dino: {}
        } as any;
        let r = { a: 15 };
        let ctrl = new DinoController(obj, {});
        ctrl.attachResultToDino(true, undefined, r);

        expect(obj.dino.result).toBeUndefined();
        expect(invoked).toBeFalsy();
    });
    it('attachResultToDino.sendsResponse_false_observable_defined', () => {
        let obj: ApiController = {
            request: 1,
            response: 2,
            next: () => 45, dino: {}
        } as any;
        let data: ApiController = {} as any;
        let r = { a: 15 };
        let obs = {
            invoke: (req, res, next, dino) => {
                data.request = req;
                data.response = res;
                data.next = next;
                data.dino = dino;
            }
        };
        let ctrl = new DinoController(obj, {});
        ctrl.attachResultToDino(false, obs, r);

        expect(obj.dino.result).toBe(r);
        expect(data.request).toBe(obj.request);
        expect(data.response).toBe(obj.response);
        expect(data.next()).toBe(45);
        expect(data.dino).toBe(obj.dino);
    });
    it('attachResultToDino.when_sendsResponse_true_observable_defined', () => {
        let obj: ApiController = {
            request: 1,
            response: 2,
            next: () => 45, dino: {}
        } as any;
        let data: ApiController = {} as any;
        let r = { a: 15 };
        let obs = {
            invoke: (req, res, next, dino) => {
                data.request = req;
                data.response = res;
                data.next = next;
                data.dino = dino;
            }
        };
        let ctrl = new DinoController(obj, {});
        ctrl.attachResultToDino(false, obs, r);

        expect(obj.dino.result).toBe(r);
        expect(data.request).toBe(obj.request);
        expect(data.response).toBe(obj.response);
        expect(data.next()).toBe(45);
        expect(data.dino).toBe(obj.dino);
    });
    it('getModelFromBody.no_httpbody_bindmodel_undefined', () => {
        let ctrl = new DinoController({} as any, { bindsModel: undefined });
        spyOn(HttpUtility, 'hasBody').and.callFake(verb => false);
        let model = ctrl.getModelFromBody('get');
        expect(model.value).toBeUndefined();
        expect(model.type).toBeUndefined();
        expect(model.errors).toBeUndefined();
        expect(model.isValid).toBeUndefined();
        expect(HttpUtility.hasBody).toHaveBeenCalledTimes(1);
    });
    it('getModelFromBody.httpbody_exists_bindmodel_undefined', () => {
        let ctrl = new DinoController({} as any, { bindsModel: undefined });
        spyOn(HttpUtility, 'hasBody').and.callFake(verb => true);
        let model = ctrl.getModelFromBody('post');
        expect(model.value).toBeUndefined();
        expect(model.type).toBeUndefined();
        expect(model.errors).toBeUndefined();
        expect(model.isValid).toBeUndefined();
        expect(HttpUtility.hasBody).toHaveBeenCalledTimes(1);
    });
    it('getModelFromBody.httpbody_exists_raiseModelError_false_no_errs', () => {
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

        spyOn(HttpUtility, 'hasBody').and.callFake(verb => true);
        spyOn(Validator, 'tryValidateWithType').and.callFake((a, b, c) => []);

        let model = ctrl.getModelFromBody('post');
        expect(model.value).toBe(ctx.request.body);
        expect(model.type).toBe(ca.bindsModel.model);
        expect(model.errors).toEqual([]);
        expect(model.isValid).toBeTruthy();
        expect(invoked).toBeFalsy();
        expect(HttpUtility.hasBody).toHaveBeenCalledTimes(1);
        expect(Validator.tryValidateWithType).toHaveBeenCalledTimes(1);
    });
    it('getModelFromBody.httpbody_exists_raiseModelError_false_with_errs', () => {
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

        spyOn(HttpUtility, 'hasBody').and.callFake(verb => true);
        spyOn(Validator, 'tryValidateWithType').and.callFake((a, b, c) => ['testerror']);

        let model = ctrl.getModelFromBody('post');
        expect(model.value).toBe(ctx.request.body);
        expect(model.type).toBe(ca.bindsModel.model);
        expect(model.errors).toEqual(['testerror']);
        expect(model.isValid).toBeFalsy();
        expect(invoked).toBeFalsy();
        expect(HttpUtility.hasBody).toHaveBeenCalledTimes(1);
        expect(Validator.tryValidateWithType).toHaveBeenCalledTimes(1);
    });
    it('getModelFromBody.httpbody_exists_raiseModelError_true_with_errs', () => {
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

        spyOn(HttpUtility, 'hasBody').and.callFake(verb => true);
        spyOn(Validator, 'tryValidateWithType').and.callFake((a, b, c) => ['testerror']);

        let model = ctrl.getModelFromBody('post');
        expect(model.value).toBe(ctx.request.body);
        expect(model.type).toBe(ca.bindsModel.model);
        expect(model.errors).toEqual(['testerror']);
        expect(model.isValid).toBeFalsy();
        expect(err.errors).toEqual(['testerror']);
        expect(err.model).toBe(ca.bindsModel.model);
        expect(err.value).toBe(ctx.request.body);
        expect(HttpUtility.hasBody).toHaveBeenCalledTimes(1);
        expect(Validator.tryValidateWithType).toHaveBeenCalledTimes(1);
    });
    it('invoke.when_mappedSegments_[]', () => {
        let val = 'test';
        let ctx = {
            request: {},
            test: a => {
                val = a;

                return 45;
            }
        } as any;

        let ctrl = new DinoController(ctx, {});
        spyOn(RouteUtility, 'mapSegmentsAndQueryToActionArguments')
            .and.callFake((a, b, c, d) => []);
        spyOn(ctrl, 'getModelFromBody').and.callFake(a => null);
        spyOn(ctrl, 'attachResultToDino').and.callFake((a, b, c) => {
            expect(c).toBe(45);
        });

        ctrl.invoke('test', 'get', 'sample');
        expect(RouteUtility.mapSegmentsAndQueryToActionArguments).toHaveBeenCalledTimes(1);
        expect(ctrl.getModelFromBody).toHaveBeenCalledTimes(1);
        expect(ctrl.attachResultToDino).toHaveBeenCalledTimes(1);
        // since default value of a is undefined
        expect(val).toBeUndefined();
    });
    it('invoke.when_mappedSegments_[hello]', () => {
        let val = 'test';
        let ctx = {
            request: {},
            test: a => {
                val = a;

                return 45;
            }
        } as any;

        let ctrl = new DinoController(ctx, {});
        spyOn(RouteUtility, 'mapSegmentsAndQueryToActionArguments')
            .and.callFake((a, b, c, d) => ['hello']);
        spyOn(ctrl, 'getModelFromBody').and.callFake(a => null);
        spyOn(ctrl, 'attachResultToDino').and.callFake((a, b, c) => {
            expect(c).toBe(45);
        });

        ctrl.invoke('test', 'get', 'sample');
        expect(RouteUtility.mapSegmentsAndQueryToActionArguments).toHaveBeenCalledTimes(1);
        expect(ctrl.getModelFromBody).toHaveBeenCalledTimes(1);
        expect(ctrl.attachResultToDino).toHaveBeenCalledTimes(1);
        expect(val).toBe('hello');
    });
    it('invokeAsync.when_mappedSegments_[]', async () => {
        let val = 'test';
        let ctx = {
            request: {},
            test: a => {
                val = a;

                return 45;
            }
        } as any;

        let ctrl = new DinoController(ctx, {});
        spyOn(RouteUtility, 'mapSegmentsAndQueryToActionArguments')
            .and.callFake((a, b, c, d) => []);
        spyOn(ctrl, 'getModelFromBody').and.callFake(a => null);
        spyOn(ctrl, 'attachResultToDino').and.callFake((a, b, c) => {
            expect(c).toBe(45);
        });

        await ctrl.invokeAsync('test', 'get', 'sample');
        expect(RouteUtility.mapSegmentsAndQueryToActionArguments).toHaveBeenCalledTimes(1);
        expect(ctrl.getModelFromBody).toHaveBeenCalledTimes(1);
        expect(ctrl.attachResultToDino).toHaveBeenCalledTimes(1);
        // since default value of a is undefined
        expect(val).toBeUndefined();
    });
    it('invokeAsync.when_mappedSegments_[hello]', async () => {
        let val = 'test';
        let ctx = {
            request: {},
            test: a => {
                val = a;

                return 45;
            }
        } as any;

        let ctrl = new DinoController(ctx, {});
        spyOn(RouteUtility, 'mapSegmentsAndQueryToActionArguments')
            .and.callFake((a, b, c, d) => ['hello']);
        spyOn(ctrl, 'getModelFromBody').and.callFake(a => null);
        spyOn(ctrl, 'attachResultToDino').and.callFake((a, b, c) => {
            expect(c).toBe(45);
        });

        await ctrl.invokeAsync('test', 'get', 'sample');
        expect(RouteUtility.mapSegmentsAndQueryToActionArguments).toHaveBeenCalledTimes(1);
        expect(ctrl.getModelFromBody).toHaveBeenCalledTimes(1);
        expect(ctrl.attachResultToDino).toHaveBeenCalledTimes(1);
        expect(val).toBe('hello');
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
            .and.callFake((a, b, c, d) => ['hello']);
        spyOn(ctrl, 'getModelFromBody').and.callFake(a => null);
        spyOn(ctrl, 'attachResultToDino').and.callFake((a, b, c) => {
            expect(c).toBe(45);
        });

        try {
            await ctrl.invokeAsync('test', 'get', 'sample');
        } catch (ex) {
            err = ex;
        }
        expect(err).toEqual(new Error('TestError'));
        expect(RouteUtility.mapSegmentsAndQueryToActionArguments).toHaveBeenCalledTimes(1);
        expect(ctrl.getModelFromBody).toHaveBeenCalledTimes(1);
        expect(ctrl.attachResultToDino).toHaveBeenCalledTimes(0);
    });
});
