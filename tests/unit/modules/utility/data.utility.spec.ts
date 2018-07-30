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
    it('isRegExp.return_false_when_undefined', () => {
        let result = DataUtility.isRegExp(undefined);
        expect(result).toBeFalsy();
    });
    it('isRegExp.return_false_when_null', () => {
        let result = DataUtility.isRegExp(null);
        expect(result).toBeFalsy();
    });
    it('isRegExp.return_false_when_"get"', () => {
        let result = DataUtility.isRegExp('get');
        expect(result).toBeFalsy();
    });
    it('isRegExp.return_true_when_/45/', () => {
        let result = DataUtility.isRegExp(/45/);
        expect(result).toBeTruthy();
    });
    it('isRegExp.return_true_when_RegExp("hello")', () => {
        let result = DataUtility.isRegExp(RegExp('hello'));
        expect(result).toBeTruthy();
    });
    it('isBoolean.return_false_when_undefined', () => {
        let result = DataUtility.isBoolean(undefined);
        expect(result).toBeFalsy();
    });
    it('isBoolean.return_false_when_null', () => {
        let result = DataUtility.isBoolean(null);
        expect(result).toBeFalsy();
    });
    it('isBoolean.return_false_when_"get"', () => {
        let result = DataUtility.isBoolean('get');
        expect(result).toBeFalsy();
    });
    it('isBoolean.return_true_when_"true"', () => {
        let result = DataUtility.isBoolean('true');
        expect(result).toBeTruthy();
    });
    it('isBoolean.return_true_when_"false"', () => {
        let result = DataUtility.isBoolean('false');
        expect(result).toBeTruthy();
    });
    it('isBoolean.return_true_when_true', () => {
        let result = DataUtility.isBoolean(true);
        expect(result).toBeTruthy();
    });
    it('isBoolean.return_true_when_false', () => {
        let result = DataUtility.isBoolean(false);
        expect(result).toBeTruthy();
    });
    it('isStrictBoolean.return_false_when_undefined', () => {
        let result = DataUtility.isStrictBoolean(undefined);
        expect(result).toBeFalsy();
    });
    it('isStrictBoolean.return_false_when_null', () => {
        let result = DataUtility.isStrictBoolean(null);
        expect(result).toBeFalsy();
    });
    it('isStrictBoolean.return_false_when_"true"', () => {
        let result = DataUtility.isStrictBoolean('true');
        expect(result).toBeFalsy();
    });
    it('isStrictBoolean.return_false_when_"false"', () => {
        let result = DataUtility.isStrictBoolean('false');
        expect(result).toBeFalsy();
    });
    it('isStrictBoolean.return_true_when_true', () => {
        let result = DataUtility.isStrictBoolean(true);
        expect(result).toBeTruthy();
    });
    it('isStrictBoolean.return_true_when_false', () => {
        let result = DataUtility.isStrictBoolean(false);
        expect(result).toBeTruthy();
    });
    it('isNumber.return_false_when_undefined', () => {
        let result = DataUtility.isNumber(undefined);
        expect(result).toBeFalsy();
    });
    it('isNumber.return_false_when_null', () => {
        let result = DataUtility.isNumber(null);
        expect(result).toBeFalsy();
    });
    it('isNumber.return_false_when_"true"', () => {
        let result = DataUtility.isNumber('true');
        expect(result).toBeFalsy();
    });
    it('isNumber.return_true_when_41', () => {
        let result = DataUtility.isNumber(41);
        expect(result).toBeTruthy();
    });
    it('isNumber.return_true_when_"41"', () => {
        let result = DataUtility.isNumber('41');
        expect(result).toBeTruthy();
    });
    it('isNumber.return_false_when_"h41"', () => {
        let result = DataUtility.isNumber('h41');
        expect(result).toBeFalsy();
    });
    it('isStrictNumber.return_false_when_undefined', () => {
        let result = DataUtility.isStrictNumber(undefined);
        expect(result).toBeFalsy();
    });
    it('isStrictNumber.return_false_when_null', () => {
        let result = DataUtility.isStrictNumber(null);
        expect(result).toBeFalsy();
    });
    it('isStrictNumber.return_false_when_"true"', () => {
        let result = DataUtility.isStrictNumber('true');
        expect(result).toBeFalsy();
    });
    it('isStrictNumber.return_true_when_41', () => {
        let result = DataUtility.isStrictNumber(41);
        expect(result).toBeTruthy();
    });
    it('isStrictNumber.return_false_when_"41"', () => {
        let result = DataUtility.isStrictNumber('41');
        expect(result).toBeFalsy();
    });
    it('isStrictNumber.return_false_when_"h41"', () => {
        let result = DataUtility.isStrictNumber('h41');
        expect(result).toBeFalsy();
    });
    it('isInteger.return_false_when_undefined', () => {
        let result = DataUtility.isInteger(undefined);
        expect(result).toBeFalsy();
    });
    it('isInteger.return_false_when_null', () => {
        let result = DataUtility.isInteger(null);
        expect(result).toBeFalsy();
    });
    it('isInteger.return_false_when_"true"', () => {
        let result = DataUtility.isStrictNumber('true');
        expect(result).toBeFalsy();
    });
    it('isInteger.return_true_when_41', () => {
        let result = DataUtility.isInteger(41);
        expect(result).toBeTruthy();
    });
    it('isInteger.return_true_when_41.56', () => {
        let result = DataUtility.isInteger(41.56);
        expect(result).toBeFalsy();
    });
    it('isInteger.return_false_when_"41"', () => {
        let result = DataUtility.isInteger('41');
        expect(result).toBeTruthy();
    });
    it('isInteger.return_false_when_"41.56"', () => {
        let result = DataUtility.isInteger('41.56');
        expect(result).toBeFalsy();
    });
    it('isInteger.return_false_when_"h41"', () => {
        let result = DataUtility.isInteger('h41');
        expect(result).toBeFalsy();
    });
    it('toBoolean.when_undefined', () => {
        let result = DataUtility.toBoolean(undefined);
        expect(result.isValid).toBeFalsy();
        expect(result.value).toBe(undefined);
    });
    it('toBoolean.when_null', () => {
        let result = DataUtility.toBoolean(null);
        expect(result.isValid).toBeFalsy();
        expect(result.value).toBe(undefined);
    });
    it('toBoolean.when_"true"', () => {
        let result = DataUtility.toBoolean('true');
        expect(result.isValid).toBeTruthy();
        expect(result.value).toBeTruthy();
    });
    it('toBoolean.when_"false"', () => {
        let result = DataUtility.toBoolean('false');
        expect(result.isValid).toBeTruthy();
        expect(result.value).toBeFalsy();
    });
    it('toBoolean.when_true', () => {
        let result = DataUtility.toBoolean(true);
        expect(result.isValid).toBeTruthy();
        expect(result.value).toBeTruthy();
    });
    it('toBoolean.when_false', () => {
        let result = DataUtility.toBoolean(false);
        expect(result.isValid).toBeTruthy();
        expect(result.value).toBeFalsy();
    });
    it('toBoolean.when_"hello"', () => {
        let result = DataUtility.toBoolean('hello');
        expect(result.isValid).toBeFalsy();
        expect(result.value).toBe(undefined);
    });
    it('toBoolean.when_45', () => {
        let result = DataUtility.toBoolean(45);
        expect(result.isValid).toBeFalsy();
        expect(result.value).toBe(undefined);
    });
    it('toNumber.when_undefined', () => {
        let result = DataUtility.toNumber(undefined);
        expect(result.isValid).toBeFalsy();
        expect(result.value).toBe(undefined);
    });
    it('toNumber.when_null', () => {
        let result = DataUtility.toNumber(null);
        expect(result.isValid).toBeFalsy();
        expect(result.value).toBe(undefined);
    });
    it('toNumber.when_"41.56"', () => {
        let result = DataUtility.toNumber('41.56');
        expect(result.isValid).toBeTruthy();
        expect(result.value).toBe(41.56);
    });
    it('toNumber.when_41.56', () => {
        let result = DataUtility.toNumber(41.56);
        expect(result.isValid).toBeTruthy();
        expect(result.value).toBe(41.56);
    });
    it('toNumber.when_41"', () => {
        let result = DataUtility.toNumber(41);
        expect(result.isValid).toBeTruthy();
        expect(result.value).toBe(41);
    });
    it('toNumber.when_true', () => {
        let result = DataUtility.toNumber(true);
        expect(result.isValid).toBeFalsy();
        expect(result.value).toBe(undefined);
    });
    it('toNumber.when_"hello"', () => {
        let result = DataUtility.toNumber('hello');
        expect(result.isValid).toBeFalsy();
        expect(result.value).toBe(undefined);
    });
    it('toInteger.when_undefined', () => {
        let result = DataUtility.toInteger(undefined);
        expect(result.isValid).toBeFalsy();
        expect(result.value).toBe(undefined);
    });
    it('toInteger.when_null', () => {
        let result = DataUtility.toInteger(null);
        expect(result.isValid).toBeFalsy();
        expect(result.value).toBe(undefined);
    });
    it('toInteger.when_"41.56"', () => {
        let result = DataUtility.toInteger('41.56');
        expect(result.isValid).toBeFalsy();
        expect(result.value).toBe(undefined);
    });
    it('toInteger.when_41"', () => {
        let result = DataUtility.toInteger(41);
        expect(result.isValid).toBeTruthy();
        expect(result.value).toBe(41);
    });
    it('toInteger.when_41.56"', () => {
        let result = DataUtility.toInteger(41.56);
        expect(result.isValid).toBeTruthy();
        expect(result.value).toBe(41);
    });
    it('toInteger.when_true', () => {
        let result = DataUtility.toInteger(true);
        expect(result.isValid).toBeFalsy();
        expect(result.value).toBe(undefined);
    });
    it('toInteger.when_"hello"', () => {
        let result = DataUtility.toInteger('hello');
        expect(result.isValid).toBeFalsy();
        expect(result.value).toBe(undefined);
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
