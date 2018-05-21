import { DinoErrorController, ErrorController } from '../../index';

describe('modules.core.dino.error.controller.spec', () => {
    it('patch.verify_properties_are_mapped', () => {
        let obj: any = { dino: {} };
        let err = new DinoErrorController(obj);
        let errHandler: any = {};
        let reqHandler: any = {};
        let resHandler: any = { locals: { dino: {} } };
        let errObj;
        let nextHandler: any = e => errObj = e;
        err.patch(errHandler, reqHandler, resHandler, nextHandler);
        expect(obj.request).toBe(reqHandler);
        expect(obj.response).toBe(resHandler);
        expect(obj.next).toBe(nextHandler);
        expect(obj.error).toBe(errHandler);
    });
    it('static_create.verify_constructor_invoked', () => {
        let obj: any = {};
        let err = DinoErrorController.create(obj);
        expect(err instanceof DinoErrorController).toBeTruthy();
    });
    it('invoke.invoke_action_if_exists', () => {
        let invoked = false;
        let obj: any = { get: () => invoked = true };
        let err = new DinoErrorController(obj);
        err.invoke('get');
        expect(invoked).toBeTruthy();
    });
    it('invoke.throws_TypeError_if_action_not_exists', () => {
        let invoked = false;
        let obj: any = {};
        let err = new DinoErrorController(obj);
        expect(() => err.invoke('get')).toThrowError(TypeError);
    });
});