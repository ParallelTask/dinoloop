import { IConversionValidation } from '../types';

/**
 * Wrapper methods to test the datatype of the given value
 */
export abstract class DataUtility {

    static isUndefined(data: any): boolean {
        return data === undefined;
    }

    static isUndefinedOrNull(data: any): boolean {
        return DataUtility.isUndefined(data) || data === null;
    }

    static isNull(data: any): boolean {
        return data === null;
    }

    static isEmpty(data: any): boolean {
        return DataUtility.isUndefinedOrNull(data) || data === '';
    }

    static isFunction(data: any): boolean {
        return typeof data === 'function';
    }

    static isString(data: any): boolean {
        return typeof data === 'string';
    }

    static isRegExp(data: any): boolean {
        return data instanceof RegExp;
    }

    static isBoolean(data: any): boolean {
        const val = DataUtility.isString(data) &&
            (data.toLowerCase() === 'false' || data.toLowerCase() === 'true');

        return val ? true : DataUtility.isStrictBoolean(data);
    }

    static isStrictBoolean(data: any): boolean {
        return typeof data === 'boolean';
    }

    static isNumber(data: any): boolean {
        return DataUtility.isString(data) ?
            Number.isFinite(Number(data)) : DataUtility.isStrictNumber(data);
    }

    /**
     * Strict - does not use string conversion
     */
    static isStrictNumber(data: any): boolean {
        return typeof data === 'number';
    }

    static isArray(data: any): boolean {
        return Array.isArray(data);
    }

    static isInteger(data: any): boolean {
        return DataUtility.isStrictNumber(data) || DataUtility.isString(data)
            ? Number.isInteger(Number(data)) : false;
    }

    static toNumber(data: any): IConversionValidation<number> {
        let valid = false;
        let value: number;

        if (DataUtility.isNumber(data)) {
            value = Number.parseFloat(data);
            valid = true;
        }

        return {
            isValid: valid,
            value: value
        };
    }

    static toInteger(data: any): IConversionValidation<number> {
        let valid = false;
        let value: number;

        if (DataUtility.isStrictNumber(data) ||
            (DataUtility.isString(data) && Number.isInteger(Number(data)))) {
            value = Number.parseInt(data);
            valid = true;
        }

        return {
            isValid: valid,
            value: value
        };
    }

    static toBoolean(data: any): IConversionValidation<boolean> {
        let valid = false;
        let value: boolean;

        if (DataUtility.isStrictBoolean(data)) {
            valid = true;
            value = data;
        } else if (DataUtility.isString(data)) {
            if (data.toLowerCase() === 'true') {
                valid = true;
                value = true;
            } else if (data.toLowerCase() === 'false') {
                valid = true;
                value = false;
            }
        }

        return {
            isValid: valid,
            value: value
        };
    }
}
