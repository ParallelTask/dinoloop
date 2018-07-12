import {
    Reflector,
    SendsResponse,
    Async,
    HttpGet,
    Attribute,
    AttributeMetadata,
    HttpPost,
    HttpPatch,
    HttpPut,
    HttpDelete,
    HttpHead,
    HttpAll,
    Controller,
    Parse
} from '../../index';

describe('api.attributes.spec', () => {
    it('Parse.invoke_AttributeMetadata.parse_exact_once', () => {
        let testHandler = () => 45;
        let testData = Function;
        spyOn(AttributeMetadata, 'parse')
            .and.callFake((cb, data) => {
                expect(data).toBe(testData);
                expect(cb).toBe(testHandler);
            });
        Parse(testHandler, testData);
        expect(AttributeMetadata.parse).toHaveBeenCalledTimes(1);
    });
    it('SendsResponse.invoke_AttributeMetadata.sendsResponse_exact_once', () => {
        spyOn(AttributeMetadata, 'sendsResponse').and.callFake(() => null);
        SendsResponse();
        expect(AttributeMetadata.sendsResponse).toHaveBeenCalledTimes(1);
    });
    it('Async.invoke_AttributeMetadata.asyncAttr_exact_once', () => {
        spyOn(AttributeMetadata, 'asyncAttr').and.callFake(() => null);
        Async();
        expect(AttributeMetadata.asyncAttr).toHaveBeenCalledTimes(1);
    });
    it('HttpGet.invoke_AttributeMetadata.httpGet_exact_once', () => {
        spyOn(AttributeMetadata, 'httpGet')
            .and.callFake(route => expect(route).toBe('test'));
        HttpGet('test');
        expect(AttributeMetadata.httpGet).toHaveBeenCalledTimes(1);
    });
    it('HttpPost.invoke_AttributeMetadata.httpPost_exact_once', () => {
        spyOn(AttributeMetadata, 'httpPost')
            .and.callFake(route => expect(route).toBe('test'));
        HttpPost('test');
        expect(AttributeMetadata.httpPost).toHaveBeenCalledTimes(1);
    });
    it('HttpPatch.invoke_AttributeMetadata.httpPatch_exact_once', () => {
        spyOn(AttributeMetadata, 'httpPatch')
            .and.callFake(route => expect(route).toBe('test'));
        HttpPatch('test');
        expect(AttributeMetadata.httpPatch).toHaveBeenCalledTimes(1);
    });
    it('HttpPut.invoke_AttributeMetadata.httpPut_exact_once', () => {
        spyOn(AttributeMetadata, 'httpPut')
            .and.callFake(route => expect(route).toBe('test'));
        HttpPut('test');
        expect(AttributeMetadata.httpPut).toHaveBeenCalledTimes(1);
    });
    it('HttpDelete.invoke_AttributeMetadata.httpDelete_exact_once', () => {
        spyOn(AttributeMetadata, 'httpDelete')
            .and.callFake(route => expect(route).toBe('test'));
        HttpDelete('test');
        expect(AttributeMetadata.httpDelete).toHaveBeenCalledTimes(1);
    });
    it('HttpHead.invoke_AttributeMetadata.httpHead_exact_once', () => {
        spyOn(AttributeMetadata, 'httpHead')
            .and.callFake(route => expect(route).toBe('test'));
        HttpHead('test');
        expect(AttributeMetadata.httpHead).toHaveBeenCalledTimes(1);
    });
    it('HttpAll.invoke_AttributeMetadata.httpAll_exact_once', () => {
        spyOn(AttributeMetadata, 'httpAll')
            .and.callFake(route => expect(route).toBe('test'));
        HttpAll('test');
        expect(AttributeMetadata.httpAll).toHaveBeenCalledTimes(1);
    });
    it('Controller.invoke_AttributeMetadata.controller_without_attributes_exact_once', () => {
        spyOn(AttributeMetadata, 'controller')
            .and.callFake((prefix, attr) => {
                expect(prefix).toBe('test');
                expect(attr).toBeUndefined();
            });
        Controller('test');
        expect(AttributeMetadata.controller).toHaveBeenCalledTimes(1);
    });
    it('Controller.invoke_AttributeMetadata.controller_with_attributes_exact_once', () => {
        spyOn(AttributeMetadata, 'controller')
            .and.callFake((prefix, attr) => {
                expect(prefix).toBe('test');
                expect(attr).toEqual({ use: [String] });
            });
        Controller('test', { use: [String] });
        expect(AttributeMetadata.controller).toHaveBeenCalledTimes(1);
    });
});
