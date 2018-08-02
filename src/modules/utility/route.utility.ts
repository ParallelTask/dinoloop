// Refer: https://github.com/pillarjs/path-to-regexp
// tslint:disable-next-line:no-require-imports
import pathToRegexp = require('path-to-regexp');
import { Key } from 'path-to-regexp';
import { FunctionUtility } from './function.utility';
import { ObjectUtility } from './object.utility';
import { DataUtility } from './data.utility';
import { IKeyValuePair } from '../types';

export abstract class RouteUtility {

    // @returns {} when no segmented values are matched
    // @returns { id: 45 } for the matched segments values
    static getNamedSegmentKeyValues(
        // holds the original url of place holders
        // ex: user/:id
        originalUri: string,
        // holds the requested url which has values
        // user/45
        requestedUri: string): any {

        let keys: Key[] = [];
        let route = pathToRegexp(originalUri, keys);
        let values = route.exec(requestedUri);

        if (!DataUtility.isArray(values)) {
            return {};
        }

        // According to "path-to-regexp" docs,
        // matched values start from index: 1
        let i = 1;
        let obj = {};

        for (const key of keys) {
            obj[key.name] = values[i];
            i++;
        }

        return obj;
    }

    // map the segmented values and query strings to action parameters.
    // if action parameter keys and variable segment / query string are matched,
    // it simply returns the array of values which are indexed to action parameter key
    static mapSegmentsAndQueryToActionArguments(
        originalUri: string,
        requestedUri: string,
        queryString: any,
        params: string[]): IKeyValuePair[] {

        let arr: string[] = [];

        if (params.length === 0) return [];

        let val = RouteUtility
            .getNamedSegmentKeyValues(originalUri, requestedUri);

        // If variable segment and query param have same keys
        // it overwrites with query string, since we are passing the query-keys 
        // which are explicitly set using @QueryParam
        let values = Object.assign(val, queryString);

        // find the index of action parameter and
        // insert the value from url at matched index
        ObjectUtility.keys(values).forEach(key => {
            let index = params.findIndex(e => e === key);
            arr[index] = values[key];
        });

        return params.map((val: string, index: number) => {
            return { key: val, value: arr[index] };
        });
    }
}
