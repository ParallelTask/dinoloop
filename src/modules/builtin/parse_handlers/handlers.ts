import { IParseHandler, IParseProps } from '../../types';
import { DataUtility } from '../../utility';
import { ActionParamException } from '../exceptions';
import { HandlerConstants, ActionParamExceptionCode } from './constants';

/**
 * Converts the parameter to integer
 * @Throws ActionParamException
 */
export const toInteger: IParseHandler = (props: IParseProps) => {
    const val = DataUtility.toInteger(props.value);

    if (!(val.isValid)) {
        throw new ActionParamException(
            props.value,
            props.key,
            props.action,
            props.controller.constructor.name,
            ActionParamExceptionCode.integer,
            HandlerConstants.toInteger
        );
    }

    return val.value;
};

/**
 * Converts the parameter to number
 * @Throws ActionParamException
 */
export const toNumber: IParseHandler = (props: IParseProps) => {
    const val = DataUtility.toNumber(props.value);

    if (!(val.isValid)) {
        throw new ActionParamException(
            props.value,
            props.key,
            props.action,
            props.controller.constructor.name,
            ActionParamExceptionCode.number,
            HandlerConstants.toNumber
        );
    }

    return val.value;
};

/**
 * Converts the parameter to boolean
 * @Throws ActionParamException
 */
export const toBoolean: IParseHandler = (props: IParseProps) => {
    const val = DataUtility.toBoolean(props.value);

    if (!(val.isValid)) {
        throw new ActionParamException(
            props.value,
            props.key,
            props.action,
            props.controller.constructor.name,
            ActionParamExceptionCode.boolean,
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

/**
 * Validates the parameter with RegExp 
 * @Throws ActionParamException
 */
export const toRegExp: IParseHandler = (props: IParseProps) => {
    const regex: RegExp = props.data;
    if (regex.test(props.value)) return props.value;
    throw new ActionParamException(
        props.value,
        props.key,
        props.action,
        props.controller.constructor.name,
        ActionParamExceptionCode.regexp,
        `${HandlerConstants.toRegExp} ${props.data}`
    );
};
