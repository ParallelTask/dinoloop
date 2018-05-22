import { DataUtility } from './data.utility';

/**
 * Wrapper methods for native js Object
 * Just to make sure not to inject native js functions into the api
 * This increases to support older versions that dont support the latest Object api
 */
export abstract class ObjectUtility {

    private static _replaceObjectReferences(obj: any, objToReplace: any, className: Function): void {
        ObjectUtility.keys(obj).forEach(key => {
            if (obj[key] instanceof className) {
                obj[key] = objToReplace;
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                ObjectUtility._replaceObjectReferences(obj[key], objToReplace, className);
            }
        });
    }

    static create(obj: any): any {
        return Object.create(obj);
    }

    static keys(obj: any): string[] {
        return Object.keys(obj);
    }

    static getPrototypeOf(obj: any): any {
        return Object.getPrototypeOf(obj);
    }

    static replaceObjectReferences(obj: any, objToReplace: any, className: Function): any {

        if (DataUtility.isUndefinedOrNull(obj) || DataUtility.isString(obj)) return obj;
        if (!DataUtility.isFunction(className)) return obj;

        ObjectUtility._replaceObjectReferences(obj, objToReplace, className);

        return obj;
    }
}
