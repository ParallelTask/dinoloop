import { IParseHandler, IParseProps } from '../../types';
import { DataUtility } from '../../utility';
import { ActionParamException } from '../exceptions';
import { HandlerConstants } from './constants';

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
