import {
    Reflector,
    SendsResponse,
    Observable,
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
    BindModel
} from '../../index';

describe('api.attributes.spec', () => {
    it('SendsResponse.invoke_AttributeMetadata.sendsResponse_exact_once', () => {
        spyOn(AttributeMetadata, 'sendsResponse').and.callFake(() => null);
        SendsResponse();
        expect(AttributeMetadata.sendsResponse).toHaveBeenCalledTimes(1);
    });
    it('Observable.invoke_AttributeMetadata.observable_exact_once', () => {
        spyOn(AttributeMetadata, 'observable').and.callFake(() => null);
        Observable();
        expect(AttributeMetadata.observable).toHaveBeenCalledTimes(1);
    });
    it('Async.invoke_AttributeMetadata.asyncAttr_exact_once', () => {
        spyOn(AttributeMetadata, 'asyncAttr').and.callFake(() => null);
        Async();
        expect(AttributeMetadata.asyncAttr).toHaveBeenCalledTimes(1);
    });
    it('HttpGet.invoke_AttributeMetadata.httpGet_exact_once', () => {
        spyOn(AttributeMetadata, 'httpGet').and.callFake(s => expect(s).toBe('test'));
        HttpGet('test');
        expect(AttributeMetadata.httpGet).toHaveBeenCalledTimes(1);
    });
    it('HttpPost.invoke_AttributeMetadata.httpPost_exact_once', () => {
        spyOn(AttributeMetadata, 'httpPost').and.callFake(s => expect(s).toBe('test'));
        HttpPost('test');
        expect(AttributeMetadata.httpPost).toHaveBeenCalledTimes(1);
    });
    it('HttpPatch.invoke_AttributeMetadata.httpPatch_exact_once', () => {
        spyOn(AttributeMetadata, 'httpPatch').and.callFake(s => expect(s).toBe('test'));
        HttpPatch('test');
        expect(AttributeMetadata.httpPatch).toHaveBeenCalledTimes(1);
    });
    it('HttpPut.invoke_AttributeMetadata.httpPut_exact_once', () => {
        spyOn(AttributeMetadata, 'httpPut').and.callFake(s => expect(s).toBe('test'));
        HttpPut('test');
        expect(AttributeMetadata.httpPut).toHaveBeenCalledTimes(1);
    });
    it('HttpDelete.invoke_AttributeMetadata.httpDelete_exact_once', () => {
        spyOn(AttributeMetadata, 'httpDelete').and.callFake(s => expect(s).toBe('test'));
        HttpDelete('test');
        expect(AttributeMetadata.httpDelete).toHaveBeenCalledTimes(1);
    });
    it('HttpHead.invoke_AttributeMetadata.httpHead_exact_once', () => {
        spyOn(AttributeMetadata, 'httpHead').and.callFake(s => expect(s).toBe('test'));
        HttpHead('test');
        expect(AttributeMetadata.httpHead).toHaveBeenCalledTimes(1);
    });
    it('HttpAll.invoke_AttributeMetadata.httpAll_exact_once', () => {
        spyOn(AttributeMetadata, 'httpAll').and.callFake(s => expect(s).toBe('test'));
        HttpAll('test');
        expect(AttributeMetadata.httpAll).toHaveBeenCalledTimes(1);
    });
    it('Controller.invoke_AttributeMetadata.controller_without_attributes_exact_once', () => {
        spyOn(AttributeMetadata, 'controller').and.callFake((prefix, attr) => {
            expect(prefix).toBe('test');
            expect(attr).toBeUndefined();
        });
        Controller('test');
        expect(AttributeMetadata.controller).toHaveBeenCalledTimes(1);
    });
    it('Controller.invoke_AttributeMetadata.controller_with_attributes_exact_once', () => {
        spyOn(AttributeMetadata, 'controller').and.callFake((prefix, attr) => {
            expect(prefix).toBe('test');
            expect(attr).toEqual({ use: [String] });
        });
        Controller('test', { use: [String] });
        expect(AttributeMetadata.controller).toHaveBeenCalledTimes(1);
    });
    it('BindModel.invoke_AttributeMetadata.bindModel_without_attributes_exact_once', () => {
        spyOn(AttributeMetadata, 'bindModel').and.callFake((type, opts) => {
            expect(type).toBe(Function);
            expect(opts).toBeUndefined();
        });
        BindModel(Function);
        expect(AttributeMetadata.bindModel).toHaveBeenCalledTimes(1);
    });
    it('BindModel.invoke_AttributeMetadata.bindModel_with_attributes_exact_once', () => {
        spyOn(AttributeMetadata, 'bindModel').and.callFake((type, opts) => {
            expect(type).toBe(String);
            expect(opts).toEqual({ stopOnError: true });
        });
        BindModel(String, { stopOnError: true });
        expect(AttributeMetadata.bindModel).toHaveBeenCalledTimes(1);
    });
});
