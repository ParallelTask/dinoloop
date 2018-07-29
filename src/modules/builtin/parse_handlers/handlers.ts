import { IParseHandler, IParseProps } from '../../types';
import { DataUtility } from '../../utility';
import { ParseParamException } from '../exceptions';
import { HandlerConstants } from './constants';

/**
 * Converts the parameter to integer
 * @Throws ParseParamException
 */
export const toInteger: IParseHandler = (props: IParseProps) => {
    const val = DataUtility.toInteger(props.value);

    if (!(val.isValid)) {
        throw new ParseParamException(
            props.value,
            props.key,
            props.action,
            props.controller.constructor.name,
            HandlerConstants.toInteger
        );
    }

    return val.value;
};

/**
 * Converts the parameter to number
 * @Throws ParseParamException
 */
export const toNumber: IParseHandler = (props: IParseProps) => {
    const val = DataUtility.toNumber(props.value);

    if (!(val.isValid)) {
        throw new ParseParamException(
            props.value,
            props.key,
            props.action,
            props.controller.constructor.name,
            HandlerConstants.toNumber
        );
    }

    return val.value;
};

/**
 * Converts the parameter to boolean
 * @Throws ParseParamException
 */
export const toBoolean: IParseHandler = (props: IParseProps) => {
    const val = DataUtility.toBoolean(props.value);

    if (!(val.isValid)) {
        throw new ParseParamException(
            props.value,
            props.key,
            props.action,
            props.controller.constructor.name,
            HandlerConstants.toBoolean
        );
    }

    return val.value;
};

/**
 * Does not perform any conversion or validation. Retrieves the original value.
 */
export const toValue: IParseHandler = (props: IParseProps) => {
    return props.value;
};
