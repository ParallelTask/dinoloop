import { RouteAttribute } from '../constants/constants';

/**
 * HttpUtility Methods
 */
export abstract class HttpUtility {

    /**
     * Tests if the given httpverb has support for request body
     */
    static hasBody(httpVerb: string): boolean {
        return (httpVerb === RouteAttribute.httpPostAttribute ||
            httpVerb === RouteAttribute.httpPatchAttribute ||
            httpVerb === RouteAttribute.httpPutAttribute) ?
            true : false;
    }
}
