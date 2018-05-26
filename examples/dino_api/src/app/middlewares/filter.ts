import { Injectable } from 'injection-js';
import {
    Middleware,
    Request,
    Response,
    NextFunction,
    MiddlewareAsync,
    ActionFilter,
    ActionFilterAsync,
    ExceptionFilter,
    ExceptionFilterAsync,
    ResultFilter,
    ResultFilterAsync
} from '../../../../index';
import { IAboutService } from '../services/about.service';

@Injectable()
export class RequestMiddleware extends Middleware {
    invoke(request: Request, response: Response, next: NextFunction, data?: any): void {
        if (data !== undefined) {
            response.locals.data.push(`This is RequestMiddleWare with data ${JSON.stringify(data)}`);
        } else {
            response.locals.data.push('This is RequestMiddleWare');
        }
        next();
    }
}

@Injectable()
export class RequestMiddlewareAsync extends MiddlewareAsync {
    constructor(private aboutService: IAboutService) {
        super();
    }

    async invoke(request: Request, response: Response, next: NextFunction, data?: any): Promise<void> {
        if (data !== undefined) {
            response.locals.data.push(`This is RequestMiddleWareAsync with data ${JSON.stringify(data)}`);
        } else {
            response.locals.data.push('This is RequestMiddleWareAsync');
        }
        let result = await this.aboutService.getViaPromise();
        next();
    }
}

@Injectable()
export class RequestFilter extends ActionFilter {
    beforeExecution(request: Request, response: Response, next: NextFunction, data?: any): void {
        if (data !== undefined) {
            response.locals.data.push(`This is RequestFilterBeforeExecution with data ${JSON.stringify(data)}`);
        } else {
            response.locals.data.push('This is RequestFilterBeforeExecution');
        }
        next();
    }
    afterExecution(request: Request, response: Response, next: NextFunction, result: any, data?: any): void {
        if (data !== undefined) {
            response.locals.data.push(`This is RequestFilterAfterExecution with data ${JSON.stringify(data)}`);
        } else {
            response.locals.data.push('This is RequestFilterAfterExecution');
        }
        response.locals.data.push(`RequestFilterAfterExecution Result: ${JSON.stringify(result)}`);
        next();
    }
}

@Injectable()
export class LogFilterAsync extends ActionFilterAsync {
    constructor(private aboutService: IAboutService) {
        super();
    }

    async beforeExecution(request: Request, response: Response, next: NextFunction, data?: any): Promise<void> {
        if (data !== undefined) {
            response.locals
                .data.push(`This is LogFilterAsyncBeforeExecution with data ${JSON.stringify(data)}`);
        } else {
            response.locals
                .data.push('This is LogFilterAsyncBeforeExecution');
        }
        let result = await this.aboutService.getViaPromise();
        next();
    }
    async afterExecution(
        request: Request,
        response: Response,
        next: NextFunction,
        result: any,
        data?: any): Promise<void> {
        if (data !== undefined) {
            response.locals
                .data.push(`This is LogFilterAsyncAfterExecution with data ${JSON.stringify(data)}`);
        } else {
            response.locals.data.push('This is LogFilterAsyncAfterExecution');
        }
        let s = await this.aboutService.getViaPromise();
        response.locals.data.push(`LogFilterAsyncAfterExecution Result: ${JSON.stringify(result)}`);
        next();
    }
}

@Injectable()
export class NExceptionFilter extends ExceptionFilter {
    invoke(err: Error, request: Request, response: Response, next: NextFunction): void {
        if (err.message === 'NExceptionFilter thrown') {
            response.json({
                errMsg: 'NExceptionFilter: Ending the response',
                data: response.locals.data
            });
        }
        response.locals.data.push('This is NExceptionFilter');
        next(err);
    }
}

@Injectable()
export class NExceptionFilterAsync extends ExceptionFilterAsync {
    constructor(private aboutService: IAboutService) {
        super();
    }

    async invoke(err: Error, request: Request, response: Response, next: NextFunction): Promise<void> {
        if (err.message === 'NExceptionFilterAsync thrown') {
            response.json({
                errMsg: 'NExceptionFilterAsync: Ending the response',
                data: response.locals.data
            });
        }
        response.locals.data.push('This is NExceptionFilterAsync');
        let result = await this.aboutService.getViaPromise();
        next(err);
    }
}

@Injectable()
export class ResultFilterOne extends ResultFilter {
    invoke(request: Request, response: Response, next: NextFunction, result: any, data?: any): void {
        if (data !== undefined) {
            response.locals.data.push(`This is ResultFilterOne with data ${JSON.stringify(data)}`);
        } else {
            response.locals.data.push('This is ResultFilterOne');
        }
        response.locals.data.push(`ResultFilterOne Result: ${JSON.stringify(result)}`);
        next();
    }
}

@Injectable()
export class ResultFilterOneAsync extends ResultFilterAsync {
    async invoke(request: Request, response: Response, next: NextFunction, result: any, data?: any): Promise<void> {
        if (data !== undefined) {
            response.locals.data.push(`This is ResultFilterOneAsync with data ${JSON.stringify(data)}`);
        } else {
            response.locals.data.push('This is ResultFilterOneAsync');
        }
        response.locals.data.push(`ResultFilterOneAsync Result: ${JSON.stringify(result)}`);
        next();
    }
}
