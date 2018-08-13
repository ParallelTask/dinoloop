import {
    HttpStatusCode,
    HttpResponseExceptionMiddleware,
    HttpResponseException
} from '../../../index';

describe('modules.builtin.middlewares.http.exception.middleware.spec', () => {
    it('invoke.sends_json_when_err_instanceof_HttpResponseException', () => {
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
        let err = new HttpResponseException(HttpStatusCode.badRequest, { data: 'test_data' });
        new HttpResponseExceptionMiddleware()
            .invoke(err, null, res, next);
        expect(responseResult).toBe(err.content);
        expect(statusCode).toBe(HttpStatusCode.badRequest);
        expect(invoked).toBeFalsy();
    });
    it('invoke.next(err)_when_result_not_instanceof_HttpResponseException', () => {
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
        new HttpResponseExceptionMiddleware()
            .invoke({ test: 'true' }, null, res, next);
        expect(responseResult).toBe(undefined);
        expect(statusCode).toBe(undefined);
        expect(ex).toEqual({ test: 'true' });
    });
});
