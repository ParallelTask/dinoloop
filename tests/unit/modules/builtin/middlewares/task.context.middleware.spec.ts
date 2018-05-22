import { TaskContextMiddleware, UserIdentity } from '../../../index';

describe('modules.builtin.task.context.middleware.spec', () => {
    it('invoke.context_must_be_instanceof_UserIdentity_and_invokes_next', () => {
        let res: any = { locals: { dino: {} } };
        let invoked = false;
        new TaskContextMiddleware()
            .invoke({}, res, () => invoked = true);
        expect(res.locals.dino.context instanceof UserIdentity).toBeTruthy();
        expect(invoked).toBeTruthy();
    });
    it('invoke.throws_TypeError_when_dino_is_not_set_on_res.local', () => {
        let res: any = { locals: {} };
        expect(() => new TaskContextMiddleware()
            .invoke({}, res, () => null)).toThrowError(TypeError);
    });
});
