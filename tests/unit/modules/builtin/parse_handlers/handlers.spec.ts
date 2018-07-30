import {
    toValue,
    IParseProps,
    toInteger,
    ParseParamException,
    HandlerConstants,
    toBoolean,
    toNumber
} from '../../../index';

describe('modules.builtin.parse_handlers.handlers.spec', () => {
    it('toValue.returns_45_when_value_is_45', () => {
        let props: IParseProps = { value: '45' };
        expect(toValue(props)).toBe('45');
    });
    it('toInteger.returns_45_when_45', () => {
        let props: IParseProps = { value: 45 };
        expect(toInteger(props)).toBe(45);
    });
    it('toInteger.returns_45_when_45.67', () => {
        let props: IParseProps = { value: 45.67 };
        expect(toInteger(props)).toBe(45);
    });
    it('toInteger.returns_45_when_"45"', () => {
        let props: IParseProps = { value: '45' };
        expect(toInteger(props)).toBe(45);
    });
    it('toInteger.throws_error_when_"45.67"', () => {
        let props: IParseProps = { value: '45.67', controller: String };
        let err = new ParseParamException(
            props.value,
            props.key,
            props.action,
            props.controller.constructor.name,
            HandlerConstants.toInteger
        );
        expect(() => toInteger(props)).toThrow(err);
    });
    it('toInteger.throws_error_when_"hello"', () => {
        let props: IParseProps = { value: 'hello', controller: String };
        let err = new ParseParamException(
            props.value,
            props.key,
            props.action,
            props.controller.constructor.name,
            HandlerConstants.toInteger
        );
        expect(() => toInteger(props)).toThrow(err);
    });
    it('toNumber.returns_45_when_45', () => {
        let props: IParseProps = { value: 45 };
        expect(toNumber(props)).toBe(45);
    });
    it('toNumber.returns_45.67_when_45.67', () => {
        let props: IParseProps = { value: 45.67 };
        expect(toNumber(props)).toBe(45.67);
    });
    it('toNumber.returns_45_when_"45"', () => {
        let props: IParseProps = { value: '45' };
        expect(toNumber(props)).toBe(45);
    });
    it('toNumber.returns_45.67_when_"45.67"', () => {
        let props: IParseProps = { value: '45.67', controller: String };
        expect(toNumber(props)).toBe(45.67);
    });
    it('toNumber.throws_error_when_"hello"', () => {
        let props: IParseProps = { value: 'hello', controller: String };
        let err = new ParseParamException(
            props.value,
            props.key,
            props.action,
            props.controller.constructor.name,
            HandlerConstants.toNumber
        );
        expect(() => toNumber(props)).toThrow(err);
    });
    it('toBoolean.returns_true_when_"true"', () => {
        let props: IParseProps = { value: 'true' };
        expect(toBoolean(props)).toBeTruthy();
    });
    it('toBoolean.returns_false_when_"false"', () => {
        let props: IParseProps = { value: 'false' };
        expect(toBoolean(props)).toBeFalsy();
    });
    it('toBoolean.returns_true_when_true', () => {
        let props: IParseProps = { value: true };
        expect(toBoolean(props)).toBeTruthy();
    });
    it('toBoolean.returns_false_when_false', () => {
        let props: IParseProps = { value: false };
        expect(toBoolean(props)).toBeFalsy();
    });
    it('toBoolean.throws_error_when_invalid_string', () => {
        let props: IParseProps = { value: 'hello', controller: String };
        let err = new ParseParamException(
            props.value,
            props.key,
            props.action,
            props.controller.constructor.name,
            HandlerConstants.toBoolean
        );
        expect(() => toBoolean(props)).toThrow(err);
    });
    it('toBoolean.throws_error_when_number', () => {
        let props: IParseProps = { value: 45, controller: String };
        let err = new ParseParamException(
            props.value,
            props.key,
            props.action,
            props.controller.constructor.name,
            HandlerConstants.toBoolean
        );
        expect(() => toBoolean(props)).toThrow(err);
    });
});
