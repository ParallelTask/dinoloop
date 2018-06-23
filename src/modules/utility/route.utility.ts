// Refer: https://github.com/rcs/route-parser
// tslint:disable-next-line:no-require-imports
// import Route = require('route-parser');
// Refer: https://github.com/snd/url-pattern
// tslint:disable-next-line:no-require-imports
// import UrlParser = require('url-pattern');
// Refer: https://github.com/pillarjs/path-to-regexp
// tslint:disable-next-line:no-require-imports
import pathToRegexp = require('path-to-regexp');
import { Key, Path } from 'path-to-regexp';
import { FunctionUtility } from './function.utility';
import { ObjectUtility } from './object.utility';
import { DataUtility } from './data.utility';

export abstract class RouteUtility {

    // @returns {} when no segmented values are matched
    // @returns { key1: value1, key2: value2 } for the matched segments values
    // parses the named segment values in the url
    static getNamedSegmentKeyValues(
        // the original url which has place holders i.e. named segments
        // ex: user/:id
        originalUri: string,
        // the requested url which has values
        // user/45
        requestedUrl: string): any {

        let keys: Key[] = [];
        let route = pathToRegexp(originalUri, keys);
        let values = route.exec(requestedUrl);

        if (!DataUtility.isArray(values)) {
            return {};
        }

        // matched values start from index: 1
        let i = 1;
        let obj = {};

        for (const key of keys) {
            obj[key.name] = values[i];
            i++;
        }

        return obj;
    }

    // map the segmented values and query strings to action arguments
    // if action arguments matches named segment or query string of the url
    // it simply returns the array of values indexed according to action arguments
    static mapSegmentsAndQueryToActionArguments(
        originalUri: string,
        requestedUri: string,
        queryString: any,
        fn: Function): string[] {
        let params = FunctionUtility.getParamNames(fn);
        let arr: string[] = [];

        // check if action has any arguments list to map to
        if (params.length > 0) {

            let val = RouteUtility.getNamedSegmentKeyValues(originalUri, requestedUri);

            if (!DataUtility.isUndefinedOrNull(val)) {
                let values = Object.assign(queryString, val);

                // map the action argument and its value from url
                ObjectUtility.keys(values).forEach(key => {
                    let index = params.findIndex(e => e === key);
                    arr[index] = values[key];
                });
            }
        }

        return arr;
    }
}
