import { ControllerAction } from '../../index';

describe('modules.controller.controller.action.spec', () => {
    it('constructor.verify_properties', () => {
        let o = new ControllerAction({
            sendsResponse: true,
            isAsync: false,
            route: '/api',
            httpVerb: '/test'
        });
        expect(o.actionAttributes.sendsResponse).toBeTruthy();
        expect(o.actionAttributes.isAsync).toBeFalsy();
        expect(o.actionAttributes.route).toBe('/api');
        expect(o.actionAttributes.httpVerb).toBe('/test');
    });
    it('static_create.verify_constructor_invoked', () => {
        let o = ControllerAction.create({
            sendsResponse: true
        });
        expect(o instanceof ControllerAction).toBeTruthy();
    });
});
