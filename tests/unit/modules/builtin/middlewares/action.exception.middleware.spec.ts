import {
    HttpStatusCode,
    ActionParamExceptionMiddleware,
    ActionParamException
} from '../../../index';

describe('modules.builtin.middlewares.parse.exception.middleware.spec', () => {
    it('invoke.sends_json_when_err_instanceof_ActionParamException', () => {
        let responseResult;
        let statusCode;
        let invoked = false;
        let next: any = () => invoked = true;
        let res: any = {
            status: code => {
                statusCode = code;

                return res;
            },
            json: data => responseResult = data
        };
        let err = new ActionParamException('a', 'b', 'c', 'd');
        new ActionParamExceptionMiddleware()
            .invoke(err, null, res, next);
        expect(responseResult).toEqual({
            value: err.value,
            message: err.message
        });
        expect(statusCode).toBe(HttpStatusCode.badRequest);
        expect(invoked).toBeFalsy();
    });
    it('invoke.next(err)_when_result_not_instanceof_ActionParamException', () => {
        let responseResult;
        let statusCode;
        let ex;
        let next: any = err => ex = err;
        let res: any = {
            status: code => {
                statusCode = code;

                return res;
            },
            json: data => responseResult = data
        };
        new ActionParamExceptionMiddleware()
            .invoke({ test: 'true' }, null, res, next);
        expect(responseResult).toBe(undefined);
        expect(statusCode).toBe(undefined);
        expect(ex).toEqual({ test: 'true' });
    });
});
