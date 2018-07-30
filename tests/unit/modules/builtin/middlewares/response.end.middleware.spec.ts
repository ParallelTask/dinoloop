import { ResponseEndMiddleware, HttpStatusCode } from '../../../index';

describe('modules.builtin.middlewares.response.end.middleware.spec', () => {
    it('invoke.sends_json_response_when_result_exists', () => {
        let responseResult;
        let statusCode;
        let res: any = {
            status: code => {
                statusCode = code;

                return res;
            },
            json: data => responseResult = data
        };
        let result = { data: 'test_data' };
        let invoked = false;
        new ResponseEndMiddleware()
            .invoke({}, res, null, result);
        expect(responseResult).toBe(result);
        expect(statusCode).toBe(HttpStatusCode.oK);
    });
    it('invoke.sends_json_response_when_result_undefined', () => {
        let responseResult;
        let statusCode;
        let result = undefined;
        let res: any = {
            status: code => {
                statusCode = code;

                return res;
            },
            end: data => responseResult = data
        };
        let invoked = false;
        new ResponseEndMiddleware()
            .invoke({}, res, null, result);
        expect(responseResult).toBe(undefined);
        expect(statusCode).toBe(HttpStatusCode.noContent);
    });
});
