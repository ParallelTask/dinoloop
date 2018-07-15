import {
    ErrorMiddleware,
    ExceptionFilter,
    ParseParamException
} from '../../../../index';

export class ServerParseErrorMiddleware extends ErrorMiddleware {
    invoke(err: Error, request, response, next): void {
        if (err instanceof ParseParamException) next(err);
        else {
            response.json(`${err.message} - Ended by Server level middleware`);
        }
    }
}

export class ControllerParseErrorMiddleware extends ExceptionFilter {
    invoke(err: Error, request, response, next): void {
        if (err instanceof ParseParamException) next(err);
        else {
            response.json(`${err.message} - Ended by Controller Exception Filter`);
        }
    }
}
