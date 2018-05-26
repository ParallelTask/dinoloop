import { ControllerAction } from '../../index';
import { ObservableMiddlewareFake } from '../../../fakes/index';

describe('modules.controller.controller.action.spec', () => {
    it('constructor.verify_properties', () => {
        let middleware = new ObservableMiddlewareFake();
        let o = new ControllerAction(true, middleware, { model: Function });
        expect(o.bindsModel).toEqual({ model: Function });
        expect(o.observableResponse).toEqual(middleware);
        expect(o.sendsResponse).toBeTruthy();
    });
    it('static_create.verify_constructor_invoked', () => {
        let middleware = new ObservableMiddlewareFake();
        let o = ControllerAction.create(true, middleware, { model: Function });
        expect(o instanceof ControllerAction).toBeTruthy();
    });
});
