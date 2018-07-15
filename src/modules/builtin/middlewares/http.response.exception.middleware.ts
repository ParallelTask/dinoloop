import { ErrorMiddleware } from '../../filter';
import { HttpResponseException } from '../exceptions';
import { HttpStatusCode } from '../../constants';

/**
 * Built-in HttpResponseException Handler
 */
export class HttpResponseExceptionMiddleware extends ErrorMiddleware {
    invoke(err, request, response, next): void {
        if (err instanceof HttpResponseException) {
            let ex: HttpResponseException<any> = err;
            response
                .status(ex.statusCode)
                .json(ex.content);
        } else {
            next(err);
        }
    }
}
