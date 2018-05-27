import { ControllerAction } from '../../index';

describe('modules.controller.controller.action.spec', () => {
    it('constructor.verify_properties', () => {
        let o = new ControllerAction(true, { model: Function });
        expect(o.bindsModel).toEqual({ model: Function });
        expect(o.sendsResponse).toBeTruthy();
    });
    it('static_create.verify_constructor_invoked', () => {
        let o = ControllerAction.create(true, { model: Function });
        expect(o instanceof ControllerAction).toBeTruthy();
    });
});
