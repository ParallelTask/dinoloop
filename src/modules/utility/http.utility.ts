import { RouteAttribute } from '../constants';

export abstract class HttpUtility {

    static hasBody(httpVerb: string): boolean {
        return (httpVerb === RouteAttribute.httpPost_ActionAttribute ||
            httpVerb === RouteAttribute.httpPatch_ActionAttribute ||
            httpVerb === RouteAttribute.httpPut_ActionAttribute) ?
            true : false;
    }
}
