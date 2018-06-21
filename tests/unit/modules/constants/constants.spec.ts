
import { RouteAttribute, Attribute } from '../../index';

describe('modules.constants.constants.spec', () => {
    it('keys_of_RouteAttribute_obj_should_match_values_of_Attribute_obj_keys_for_httpverbType', () => {
        // expected values are to be valid http-verbs/http-methods on express
        // This test also makes sure, value of Attribute.key is RouteAttribute key
        // Should be considered thoroughly before deleting this test case
        expect(RouteAttribute[Attribute.httpGet]).toBe('get');
        expect(RouteAttribute[Attribute.httpPost]).toBe('post');
        expect(RouteAttribute[Attribute.httpDelete]).toBe('delete');
        expect(RouteAttribute[Attribute.httpPut]).toBe('put');
        expect(RouteAttribute[Attribute.httpPatch]).toBe('patch');
        expect(RouteAttribute[Attribute.httpHead]).toBe('head');
        expect(RouteAttribute[Attribute.httpAll]).toBe('all');
    });
    it('Attribute.errorControllerDefaultMethod_should_be_internalServerError', () => {
        expect(Attribute.errorControllerDefaultMethod).toBe('internalServerError');
    });
});
