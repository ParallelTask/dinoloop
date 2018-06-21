import {
    RouteExceptionMiddleware,
    RouteNotFoundException,
    HttpStatusCode
} from '../../../index';

describe('modules.builtin.route.exception.middleware.spec', () => {
    it('invoke.sends_response_when_RouteNotFoundException_occurred', () => {
        let responseResult;
        let statusCode;
        let res: any = {
            status: code => {
                statusCode = code;

                return res;
            },
            json: data => responseResult = data
        };
        let httpVerb = 'get';
        let uri = '/api/test';
        let err = new RouteNotFoundException(httpVerb, uri);
        let invoked = false;

        new RouteExceptionMiddleware()
            .invoke(err, {}, res, () => invoked = true);

        expect(responseResult).toBe(`Cannot ${httpVerb} ${uri}`);
        expect(statusCode).toBe(HttpStatusCode.NotFound);
        expect(invoked).toBeFalsy();
    });
    it('invoke.invoked_next_err_handler_when_RouteNotFoundException_not_occurred', () => {
        let responseResult;
        let res: any = {
            json: data => responseResult = data
        };
        let invoked = false;

        new RouteExceptionMiddleware()
            .invoke(new Error('TestError'), {}, {}, () => invoked = true);

        expect(invoked).toBeTruthy();
        expect(responseResult).toBeUndefined();
    });
    it('invoke.invoked_next_err_handler_when_error_object_is_null', () => {
        let responseResult;
        let res: any = {
            json: data => responseResult = data
        };
        let invoked = false;

        new RouteExceptionMiddleware()
            .invoke(null, {}, {}, () => invoked = true);

        expect(invoked).toBeTruthy();
        expect(responseResult).toBeUndefined();
    });
});
