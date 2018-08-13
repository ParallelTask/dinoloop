import { HttpStatusCode } from '../constants';

/**
 * Creates HttpResponseMessage with the specified status code and value
 */
export class HttpResponseMessage<T> {
    statusCode: HttpStatusCode;
    content: T;

    constructor(statusCode: HttpStatusCode, content?: T) {
        this.statusCode = statusCode;
        this.content = content;
    }
}
