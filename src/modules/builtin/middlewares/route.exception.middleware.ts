import { ErrorMiddleware } from '../../filter';
import { RouteNotFoundException } from '../exceptions';
import { HttpStatusCode } from '../../constants';

/**
 * Handles RouteNotFoundException thrown by RouteNotFoundMiddleware
 */
export class RouteExceptionMiddleware extends ErrorMiddleware {
    invoke(err, request, response, next): void {
        if (err instanceof RouteNotFoundException) {
            let ex: RouteNotFoundException = err;
            response
                .status(HttpStatusCode.notFound)
                .json(`Cannot ${ex.httpVerb} ${ex.requestUrl}`);
        } else {
            next(err);
        }
    }
}
