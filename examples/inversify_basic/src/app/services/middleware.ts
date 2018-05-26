import { injectable } from 'inversify';
import { RequestStartMiddleWare, Request, Response, NextFunction, RequestEndMiddleWare } from '../../../../index';

@injectable()
export class StartMiddleware extends RequestStartMiddleWare {
    invoke(request: Request, response: Response, next: NextFunction): void {
        response.locals.data = [];
        response.locals.data.push('This is StartMiddleWareOne');
        next();
    }
}

@injectable()
export class ResponseMiddleware extends RequestEndMiddleWare {
    invoke(request: Request, response: Response, next: NextFunction, result: any): void {
        response.locals.data.push('This is ResponseMiddleWare');
        response.json({
            result: result,
            locals: response.locals.data
        });
    }
}
