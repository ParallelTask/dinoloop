import { DinoParser, IMiddlewareProvider } from '../../index';

describe('modules.utility.dino.parser.spec', () => {
    it('parseMiddlewareProvider.returns_null_when_null', () => {
        let result = DinoParser.parseMiddlewareProvider(null);
        expect(result.data).toBeUndefined();
        expect(result.useClass).toBeNull();
    });
    it('parseMiddlewareProvider.returns_undefined_when_undefined', () => {
        let result = DinoParser.parseMiddlewareProvider(undefined);
        expect(result.data).toBeUndefined();
        expect(result.useClass).toBeUndefined();
    });
    it('parseMiddlewareProvider.return_Func_when_Func', () => {
        let result = DinoParser.parseMiddlewareProvider(String);
        expect(result.data).toBeUndefined();
        expect(result.useClass).toBe(String);
    });
    it('parseMiddlewareProvider.return_{}_when_{}', () => {
        let result = DinoParser.parseMiddlewareProvider({});
        expect(result.data).toBeUndefined();
        expect(result.useClass).toBeUndefined();
    });
    it('parseMiddlewareProvider.return_null_when_useclass_null', () => {
        let data: IMiddlewareProvider = { useClass: null };
        let result = DinoParser.parseMiddlewareProvider(data);
        expect(result.data).toBeUndefined();
        expect(result.useClass).toBeNull();
    });
    it('parseMiddlewareProvider.return_undefined_when_useclass_undefined', () => {
        let data: IMiddlewareProvider = { useClass: undefined };
        let result = DinoParser.parseMiddlewareProvider(data);
        expect(result.data).toBeUndefined();
        expect(result.useClass).toBeUndefined();
    });
    it('parseMiddlewareProvider.return_Func_when_useclass_Func_and_data_undefined', () => {
        let result = DinoParser.parseMiddlewareProvider({ useClass: String });
        expect(result.data).toBeUndefined();
        expect(result.useClass).toBe(String);
    });
    it('parseMiddlewareProvider.return_String_when_has_useclass_and_data', () => {
        let result = DinoParser.parseMiddlewareProvider({
            useClass: String,
            data: 'test'
        });
        expect(result.data).toBe('test');
        expect(result.useClass).toBe(String);
    });
    it('parseMiddlewareProvider.return_null_when_has_data_but_useclass_null', () => {
        let data: IMiddlewareProvider = { useClass: null, data: 'test' };
        let result = DinoParser.parseMiddlewareProvider(data);
        expect(result.data).toBeUndefined();
        expect(result.useClass).toBeNull();
    });
    it('parseMiddlewareProvider.return_same_when_has_data_but_useclass_undefined', () => {
        let data: IMiddlewareProvider = { useClass: undefined, data: 'test' };
        let result = DinoParser.parseMiddlewareProvider(data);
        expect(result.data).toBeUndefined();
        expect(result.useClass).toBeUndefined();
    });
    it('parseMiddlewareProvider.return_same_when_has_data_useclass_NonFunc', () => {
        let data: IMiddlewareProvider = { useClass: Object(), data: 'test' };
        let result = DinoParser.parseMiddlewareProvider(data);
        expect(result.data).toBeUndefined();
        expect(result.useClass).toEqual(Object());
    });
});