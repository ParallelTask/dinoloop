
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

    static isArray(data: any): boolean {
        return Array.isArray(data);
    }
}
