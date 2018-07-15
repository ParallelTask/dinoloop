import { ErrorMiddleware } from '../../filter';
import { ParseParamException } from '../exceptions';
import { HttpStatusCode } from '../../constants';

/**
 * Built-in ParseParamException Handler
 */
export class ParseParamExceptionMiddleware extends ErrorMiddleware {
    invoke(err, request, response, next): void {
        if (err instanceof ParseParamException) {
            let ex: ParseParamException = err;
            response
                .status(HttpStatusCode.badRequest)
                .json(`Value: ${ex.value}, Message: ${ex.message}`);
        } else {
            next(err);
        }
    }
}
