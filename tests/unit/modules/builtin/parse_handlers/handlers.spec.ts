import {
    toValue,
    IParseProps,
    toInteger,
    ActionParamException,
    HandlerConstants,
    toBoolean,
    toNumber,
    ActionParamExceptionCode
} from '../../../index';
import { toRegExp } from '../../../../../src';

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
        let err = new ActionParamException(
            props.value,
            props.key,
            props.action,
            props.controller.constructor.name,
            ActionParamExceptionCode.integer,
            HandlerConstants.toInteger
        );
        expect(() => toInteger(props)).toThrow(err);
    });
    it('toInteger.throws_error_when_"hello"', () => {
        let props: IParseProps = { value: 'hello', controller: String };
        let err = new ActionParamException(
            props.value,
            props.key,
            props.action,
            props.controller.constructor.name,
            ActionParamExceptionCode.integer,
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
        let err = new ActionParamException(
            props.value,
            props.key,
            props.action,
            props.controller.constructor.name,
            ActionParamExceptionCode.number,
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
        let err = new ActionParamException(
            props.value,
            props.key,
            props.action,
            props.controller.constructor.name,
            ActionParamExceptionCode.boolean,
            HandlerConstants.toBoolean
        );
        expect(() => toBoolean(props)).toThrow(err);
    });
    it('toBoolean.throws_error_when_number', () => {
        let props: IParseProps = { value: 45, controller: String };
        let err = new ActionParamException(
            props.value,
            props.key,
            props.action,
            props.controller.constructor.name,
            ActionParamExceptionCode.boolean,
            HandlerConstants.toBoolean
        );
        expect(() => toBoolean(props)).toThrow(err);
    });
    it('toRegExp.returns_value_when_regex_is_matched', () => {
        // Following regex is valid, if it has only 0-9 digits
        let props: IParseProps = { value: '45', data: /^[0-9]+$/ };
        expect(toRegExp(props)).toBe('45');
    });
    it('toRegExp.throws_error_when_regex_is_not_matched', () => {
        // Following regex is valid, if it has only 0-9 digits
        let props: IParseProps = {
            value: '45.67',
            data: /^[0-9]+$/,
            controller: String
        };
        let err = new ActionParamException(
            props.value,
            props.key,
            props.action,
            props.controller.constructor.name,
            ActionParamExceptionCode.regexp,
            `${HandlerConstants.toRegExp} ${props.data}`
        );
        expect(() => toRegExp(props)).toThrow(err);
    });
});
