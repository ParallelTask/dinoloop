import { Injectable } from 'injection-js';
import {
    RequestStartMiddleWare,
    Request,
    Response,
    NextFunction,
    RequestStartMiddleWareAsync,
    Deferrer,
    RequestEndMiddleWare,
    RequestEndMiddleWareAsync,
    ErrorMiddleware,
    RouteNotFoundException,
    ErrorMiddlewareAsync
} from '../../../../index';

@Injectable()
export class StartMiddlewareOne extends RequestStartMiddleWare {
    invoke(request: Request, response: Response, next: NextFunction): void {
        response.locals.data = [];
        response.locals.data.push('This is StartMiddleWareOne');
        next();
    }
}

@Injectable()
export class StartMiddlewareOneAsync extends RequestStartMiddleWareAsync {
    async invoke(request: Request, response: Response, next: NextFunction): Promise<void> {
        let data = await Deferrer.run((resolve, reject) => {
            setTimeout(() => resolve('This is StartMiddleWareOneAsync'), 10);
        });
        response.locals.data.push(data);
        next();
    }
}

@Injectable()
export class StartMiddlewareTwo extends RequestStartMiddleWare {
    invoke(request: Request, response: Response, next: NextFunction): void {
        response.locals.data.push('This is StartMiddleWareTwo');
        next();
    }
}

@Injectable()
export class StartMiddlewareTwoAsync extends RequestStartMiddleWareAsync {
    async invoke(request: Request, response: Response, next: NextFunction): Promise<void> {
        let data = await Deferrer.run((resolve, reject) => {
            setTimeout(() => resolve('This is StartMiddleWareTwoAsync'), 10);
        });
        response.locals.data.push(data);
        next();
    }
}

@Injectable()
export class ResponseMiddleware extends RequestEndMiddleWare {
    invoke(request: Request, response: Response, next: NextFunction, result: any): void {
        response.json(result);
    }
}

@Injectable()
export class ErrorMiddlewareOne extends ErrorMiddleware {
    invoke(err: Error, request: Request, response: Response, next: NextFunction): void {
        if (err.message === 'SyncTestExceptionOne is thrown') {
            response.json({
                errMsg: 'ErrorMiddlewareOne: Ending the response',
                data: response.locals.data
            });
        }
        response.locals.data.push('This is ErrorMiddlewareOne');
        next(err);
    }
}

@Injectable()
export class ErrorMiddlewareOneAsync extends ErrorMiddlewareAsync {
    async invoke(err: Error, request: Request, response: Response, next: NextFunction): Promise<void> {
        let data = await Deferrer.run((resolve, reject) => {
            setTimeout(() => resolve('This is ErrorMiddlewareOneAsync'), 10);
        });
        response.locals.data.push(data);
        next(err);
    }
}

@Injectable()
export class ErrorMiddlewareTwo extends ErrorMiddleware {
    invoke(err: Error, request: Request, response: Response, next: NextFunction): void {
        if (err.message === 'SyncTestExceptionTwo is thrown') {
            response.json({
                errMsg: 'ErrorMiddlewareTwo: Ending the response',
                data: response.locals.data
            });
        }
        response.locals.data.push('This is ErrorMiddlewareTwo');
        next(err);
    }
}

@Injectable()
export class RouteNotFoundErrorMiddleware extends ErrorMiddleware {
    invoke(err: Error, request: Request, response: Response, next: NextFunction): void {
        if (err instanceof RouteNotFoundException) {
            response.json({
                errMsg: 'Link has been moved or broken',
                status: false,
                statusCode: 404
            });
        } else {
            response.locals.data.push('This is RouteNotFoundErrorMiddleware');
            next(err);
        }
    }
}
