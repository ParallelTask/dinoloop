import { DinoStartMiddleware } from '../../../index';

describe('modules.builtin.dino.start.middleware.spec', () => {
    it('invoke.defines_dino_property_and_invokes_next', () => {
        let res: any = { locals: {} };
        let invoked = false;
        new DinoStartMiddleware()
            .invoke({}, res, () => invoked = true);
        expect(res.locals.dino).toBeDefined();
        expect(invoked).toBeTruthy();
    });
});
