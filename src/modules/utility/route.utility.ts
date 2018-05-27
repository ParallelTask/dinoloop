// Refer: https://github.com/rcs/route-parser
// tslint:disable-next-line:no-require-imports
// import Route = require('route-parser');
// Refer: https://github.com/snd/url-pattern
// tslint:disable-next-line:no-require-imports
import UrlParser = require('url-pattern');
import { FunctionUtility } from './function.utility';
import { ObjectUtility } from './object.utility';

export abstract class RouteUtility {

    // parses the named segment values in the url
    static getNamedSegmentKeyValues(
        // the original url which has place holders i.e. named segments
        // ex: user/:id
        originalUri: string,
        // the requested url which has values
        // user/45
        requestedUrl: string): any {

        let route = new UrlParser(originalUri);
        let values = route.match(requestedUrl);

        return values;
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

            if (val) {
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
