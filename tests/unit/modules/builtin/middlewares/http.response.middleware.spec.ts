import {
    HttpStatusCode,
    HttpResponseMessageMiddleware,
    HttpResponseMessage
} from '../../../index';

describe('modules.builtin.middlewares.http.response.middleware.spec', () => {
    it('invoke.sends_json_when_result_instanceof_HttpResponseMessage', () => {
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
        let result = new HttpResponseMessage({
            statusCode: HttpStatusCode.oK,
            content: { data: 'test_data' }
        });
        new HttpResponseMessageMiddleware()
            .invoke({}, res, next, result);
        expect(responseResult).toBe(result.content);
        expect(statusCode).toBe(HttpStatusCode.oK);
        expect(invoked).toBeFalsy();
    });
    it('invoke.sends_json_when_HttpStatusCode_204_and_instanceof_HttpResponseMessage', () => {
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
        let result = new HttpResponseMessage({
            statusCode: HttpStatusCode.noContent
        });
        new HttpResponseMessageMiddleware()
            .invoke({}, res, next, result);
        expect(responseResult).toBe(undefined);
        expect(statusCode).toBe(HttpStatusCode.noContent);
        expect(invoked).toBeFalsy();
    });
    it('invoke.next()_when_result_not_instanceof_HttpResponseMessage', () => {
        let responseResult;
        let statusCode;
        let result = {};
        let invoked = false;
        let next: any = () => invoked = true;
        let res: any = {
            status: code => {
                statusCode = code;

                return res;
            },
            json: data => responseResult = data
        };
        new HttpResponseMessageMiddleware()
            .invoke({}, res, next, result);
        expect(responseResult).toBe(undefined);
        expect(statusCode).toBe(undefined);
        expect(invoked).toBeTruthy();
    });
});
