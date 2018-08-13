import { HttpResponseMessage } from '../../entities';
import { HttpStatusCode } from '../../constants';

/**
 * Creates HttpResponseMessage with HttpStatusCode.ok (200)
 */
export const Ok = (content?: any) => {
    return new HttpResponseMessage<any>(HttpStatusCode.oK, content);
};

/**
 * Creates HttpResponseMessage with HttpStatusCode.noContent (204)
 */
export const NoContent = () => {
    return new HttpResponseMessage<any>(HttpStatusCode.noContent, undefined);
};

/**
 * Creates HttpResponseMessage with HttpStatusCode.badRequest (400)
 */
export const BadRequest = (content?: any) => {
    return new HttpResponseMessage<any>(HttpStatusCode.badRequest, content);
};

/**
 * Creates HttpResponseMessage with HttpStatusCode.unauthorized (401)
 */
export const Unauthorized = (content?: any) => {
    return new HttpResponseMessage<any>(HttpStatusCode.unauthorized, content);
};

/**
 * Creates HttpResponseMessage with HttpStatusCode.notFound (404)
 */
export const NotFound = (content?: any) => {
    return new HttpResponseMessage<any>(HttpStatusCode.notFound, content);
};
