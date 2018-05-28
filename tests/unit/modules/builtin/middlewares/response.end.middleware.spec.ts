import { ResponseEndMiddleware } from '../../../index';

describe('modules.builtin.response.end.middleware.spec', () => {
    it('invoke.sends_json_response', () => {
        let responseResult;
        let res: any = {
            json: data => responseResult = data
        };
        let result = { data: 'test_data' };
        let invoked = false;
        new ResponseEndMiddleware()
            .invoke({}, res, null, result);

        expect(responseResult).toBe(result);
    });
});
