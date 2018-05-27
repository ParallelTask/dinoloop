import { RouteAttribute } from '../constants/constants';

export abstract class HttpUtility {

    static hasBody(httpVerb: string): boolean {
        return (httpVerb === RouteAttribute.httpPostAttribute ||
            httpVerb === RouteAttribute.httpPatchAttribute ||
            httpVerb === RouteAttribute.httpPutAttribute) ?
            true : false;
    }
}
