import { DataUtility } from './data.utility';

let STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
let ARGUMENT_NAMES = /([^\s,]+)/g;

// returns only param names as string array
// refer: https://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically
export abstract class FunctionUtility {
    static getParamNames(func: Function): string[] {

        if (DataUtility.isUndefinedOrNull(func)) return [];

        let fnStr = func.toString().replace(STRIP_COMMENTS, '');
        let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
        if (result === null) {
            result = [];
        }

        return result;
    }
}