import { FunctionUtility } from '../../index';

describe('modules.utility.function.utility.spec', () => {
    it('getParamNames.return_[]_when_value_is_null', () => {
        expect(FunctionUtility.getParamNames(null)).toEqual([]);
    });
    it('getParamNames.return_[]_when_value_is_undefined', () => {
        expect(FunctionUtility.getParamNames(undefined)).toEqual([]);
    });
    it('getParamNames.return_[]_when_value_is_()', () => {
        let func = () => null;
        expect(FunctionUtility.getParamNames(func)).toEqual([]);
    });
    it('getParamNames.return_[]_when_value_is_String', () => {
        expect(FunctionUtility.getParamNames(String)).toEqual([]);
    });
    it('getParamNames.return_[a,b]_when_value_is_(a: number, b: boolean)', () => {
        let func = (a: number, b: boolean) => null;
        expect(FunctionUtility.getParamNames(func)).toEqual(['a', 'b']);
    });
    it('getParamNames.return_[e]_when_value_is_(e:number)', () => {
        let func = (e: number) => null;
        expect(FunctionUtility.getParamNames(func)).toEqual(['e']);
    });
    it('getParamNames.return_[e, d, c, a, b]_when_value_is_(e, d, c, a, b)', () => {
        let func = (e, d, c, a, b) => null;
        expect(FunctionUtility.getParamNames(func)).toEqual(['e', 'd', 'c', 'a', 'b']);
    });
});
