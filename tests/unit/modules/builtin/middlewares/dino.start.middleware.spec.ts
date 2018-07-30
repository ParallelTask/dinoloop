import { DinoStartMiddleware } from '../../../index';

describe('modules.builtin.middlewares.dino.start.middleware.spec', () => {
    it('invoke.sets_dino_property_to_{}_and_invokes_next', () => {
        let res: any = { locals: {} };
        let invoked = false;
        new DinoStartMiddleware()
            .invoke({}, res, () => invoked = true);
        expect(res.locals.dino).toEqual({});
        expect(invoked).toBeTruthy();
    });
});
