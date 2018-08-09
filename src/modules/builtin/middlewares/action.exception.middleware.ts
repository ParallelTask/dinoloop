import { ErrorMiddleware } from '../../filter';
import { ActionParamException } from '../exceptions';
import { HttpStatusCode } from '../../constants';

/**
 * Built-in ActionParamException Handler
 */
export class ActionParamExceptionMiddleware extends ErrorMiddleware {
    invoke(err, request, response, next): void {
        if (err instanceof ActionParamException) {
            let ex: ActionParamException = err;
            response
                .status(HttpStatusCode.badRequest)
                .json({
                    value: ex.value,
                    message: ex.message
                });
        } else {
            next(err);
        }
    }
}
