import { RequestEndMiddleware } from '../../filter';
import { HttpResponseMessage } from '../../entities';
import { Response } from '../../types';

/**
 * Built-in HttpResponseMessage Handler
 */
export class HttpResponseMessageMiddleware extends RequestEndMiddleware {
    invoke(request, response: Response, next, result: any): void {
        if (result instanceof HttpResponseMessage) {
            response
                .status(result.statusCode)
                .json(result.content);
        } else {
            next();
        }
    }
}
