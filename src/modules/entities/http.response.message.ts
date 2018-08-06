import { HttpStatusCode } from '../constants';

/**
 * Responds to client with HttpStatusCode and Content
 */
export class HttpResponseMessage<T> {
    statusCode: HttpStatusCode;
    content: T;

    constructor(
        { statusCode = HttpStatusCode.oK, content = undefined }:
            { statusCode?: HttpStatusCode, content?: T }
            = { statusCode: HttpStatusCode.oK, content: undefined }) {
        this.statusCode = statusCode;
        this.content = content;
    }
}
