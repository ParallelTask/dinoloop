import { DataUtility } from '../../index';

describe('modules.utility.data.utility.spec', () => {
    it('isUndefined.return_true_when_undefined', () => {
        let result = DataUtility.isUndefined(undefined);
        expect(result).toBeTruthy();
    });
    it('isUndefined.return_false_when_primitive', () => {
        let result = DataUtility.isUndefined(45);
        expect(result).toBeFalsy();
    });
    it('isUndefined.return_false_when_object', () => {
        let result = DataUtility.isUndefined({});
        expect(result).toBeFalsy();
    });
    it('isUndefined.return_false_when_array', () => {
        let result = DataUtility.isUndefined([]);
        expect(result).toBeFalsy();
    });
    it('isUndefined.return_false_when_null', () => {
        let result = DataUtility.isUndefined(null);
        expect(result).toBeFalsy();
    });
    it('isUndefined.return_false_when_String', () => {
        let result = DataUtility.isUndefined(String);
        expect(result).toBeFalsy();
    });
    it('isUndefined.return_false_when_function', () => {
        let result = DataUtility.isUndefined(() => 45);
        expect(result).toBeFalsy();
    });
    it('isUndefinedOrNull.return_true_when_undefined', () => {
        let result = DataUtility.isUndefinedOrNull(undefined);
        expect(result).toBeTruthy();
    });
    it('isUndefinedOrNull.return_true_when_null', () => {
        let result = DataUtility.isUndefinedOrNull(null);
        expect(result).toBeTruthy();
    });
    it('isNull.return_false_when_undefined', () => {
        let result = DataUtility.isNull(undefined);
        expect(result).toBeFalsy();
    });
    it('isNull.return_false_when_primitive', () => {
        let result = DataUtility.isNull(45);
        expect(result).toBeFalsy();
    });
    it('isNull.return_false_when_object', () => {
        let result = DataUtility.isNull({});
        expect(result).toBeFalsy();
    });
    it('isNull.return_false_when_array', () => {
        let result = DataUtility.isNull([]);
        expect(result).toBeFalsy();
    });
    it('isNull.return_true_when_null', () => {
        let result = DataUtility.isNull(null);
        expect(result).toBeTruthy();
    });
    it('isNull.return_false_when_prototype', () => {
        let result = DataUtility.isNull(String);
        expect(result).toBeFalsy();
    });
    it('isNull.return_false_when_function', () => {
        let result = DataUtility.isNull(() => 45);
        expect(result).toBeFalsy();
    });
    it('isArray.return_false_when_undefined', () => {
        let result = DataUtility.isArray(undefined);
        expect(result).toBeFalsy();
    });
    it('isArray.return_false_when_primitive', () => {
        let result = DataUtility.isArray(45);
        expect(result).toBeFalsy();
    });
    it('isArray.return_false_when_object', () => {
        let result = DataUtility.isArray({});
        expect(result).toBeFalsy();
    });
    it('isArray.return_true_when_[]', () => {
        let result = DataUtility.isArray([]);
        expect(result).toBeTruthy();
    });
    it('isArray.return_true_when_new_Array()', () => {
        let result = DataUtility.isArray(new Array());
        expect(result).toBeTruthy();
    });
    it('isArray.return_true_when_Array()', () => {
        let result = DataUtility.isArray(Array());
        expect(result).toBeTruthy();
    });
    it('isArray.return_false_when_null', () => {
        let result = DataUtility.isArray(null);
        expect(result).toBeFalsy();
    });
    it('isArray.return_false_when_Array', () => {
        let result = DataUtility.isArray(Array);
        expect(result).toBeFalsy();
    });
    it('isArray.return_false_when_function', () => {
        let result = DataUtility.isArray(() => 45);
        expect(result).toBeFalsy();
    });
    it('isFunction.return_false_when_undefined', () => {
        let result = DataUtility.isFunction(undefined);
        expect(result).toBeFalsy();
    });
    it('isFunction.return_false_when_primitive', () => {
        let result = DataUtility.isFunction(45);
        expect(result).toBeFalsy();
    });
    it('isFunction.return_false_when_object', () => {
        let result = DataUtility.isFunction({});
        expect(result).toBeFalsy();
    });
    it('isFunction.return_false_when_[]', () => {
        let result = DataUtility.isFunction([]);
        expect(result).toBeFalsy();
    });
    it('isFunction.return_false_when_null', () => {
        let result = DataUtility.isFunction(null);
        expect(result).toBeFalsy();
    });
    it('isFunction.return_true_when_Function', () => {
        let result = DataUtility.isFunction(Function);
        expect(result).toBeTruthy();
    });
    it('isFunction.return_true_when_String', () => {
        let result = DataUtility.isFunction(String);
        expect(result).toBeTruthy();
    });
    it('isFunction.return_true_when_function', () => {
        let result = DataUtility.isFunction(() => 45);
        expect(result).toBeTruthy();
    });
    it('isString.return_false_when_undefined', () => {
        let result = DataUtility.isString(undefined);
        expect(result).toBeFalsy();
    });
    it('isString.return_false_when_primitive', () => {
        let result = DataUtility.isString(45);
        expect(result).toBeFalsy();
    });
    it('isString.return_false_when_object', () => {
        let result = DataUtility.isString({});
        expect(result).toBeFalsy();
    });
    it('isString.return_false_when_[]', () => {
        let result = DataUtility.isString([]);
        expect(result).toBeFalsy();
    });
    it('isString.return_false_when_null', () => {
        let result = DataUtility.isString(null);
        expect(result).toBeFalsy();
    });
    it('isString.return_false_when_Function', () => {
        let result = DataUtility.isString(Function);
        expect(result).toBeFalsy();
    });
    it('isString.return_false_when_StringObject', () => {
        let result = DataUtility.isString(String);
        expect(result).toBeFalsy();
    });
    it('isString.return_true_when_StringLiteral', () => {
        let result = DataUtility.isString('hello');
        expect(result).toBeTruthy();
    });
    it('isEmpty.return_true_when_undefined', () => {
        let result = DataUtility.isEmpty(undefined);
        expect(result).toBeTruthy();
    });
    it('isEmpty.return_false_when_primitive', () => {
        let result = DataUtility.isEmpty(45);
        expect(result).toBeFalsy();
    });
    it('isEmpty.return_false_when_object', () => {
        let result = DataUtility.isEmpty({});
        expect(result).toBeFalsy();
    });
    it('isEmpty.return_false_when_[]', () => {
        let result = DataUtility.isEmpty([]);
        expect(result).toBeFalsy();
    });
    it('isEmpty.return_true_when_null', () => {
        let result = DataUtility.isEmpty(null);
        expect(result).toBeTruthy();
    });
    it('isEmpty.return_false_when_Function', () => {
        let result = DataUtility.isEmpty(Function);
        expect(result).toBeFalsy();
    });
    it('isEmpty.return_false_when_StringLiteral', () => {
        let result = DataUtility.isEmpty('hello');
        expect(result).toBeFalsy();
    });
    it('isEmpty.return_true_when_""', () => {
        let result = DataUtility.isEmpty('');
        expect(result).toBeTruthy();
    });
});