import { ErrorMiddleware } from '../../filter/filter';
import { RouteNotFoundException } from '../exceptions/exceptions';

/**
 * Handles RouteNotFoundException thrown by RouteNotFoundMiddleware
 */
export class RouteExceptionMiddleware extends ErrorMiddleware {
    invoke(err, request, response, next): void {
        if (err instanceof RouteNotFoundException) {
            let ex: RouteNotFoundException = err;
            response.json(`Cannot ${ex.httpVerb} ${ex.requestUrl}`);
        } else {
            next(err);
        }
    }
}
