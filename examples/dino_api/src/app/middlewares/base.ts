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
import { Injectable } from 'injection-js';
import { IAboutService } from '../services/about.service';

@Injectable()
export class BaseRequestMiddleware extends Middleware {
    invoke(request: Request, response: Response, next: NextFunction, data?: any): void {
        if (data !== undefined) {
            response.locals.data.push(`This is BaseRequestMiddleware with data ${JSON.stringify(data)}`);
        } else {
            response.locals.data.push('This is BaseRequestMiddleware');
        }
        next();
    }
}

@Injectable()
export class BaseRequestMiddlewareAsync extends MiddlewareAsync {
    constructor(private aboutService: IAboutService) {
        super();
    }

    async invoke(request: Request, response: Response, next: NextFunction, data?: any): Promise<void> {
        if (data !== undefined) {
            response.locals.data.push(`This is BaseRequestMiddlewareAsync with data ${JSON.stringify(data)}`);
        } else {
            response.locals.data.push('This is BaseRequestMiddlewareAsync');
        }
        let result = await this.aboutService.getViaPromise();
        next();
    }
}

@Injectable()
export class BaseRequestFilter extends ActionFilter {
    beforeExecution(request: Request, response: Response, next: NextFunction, data?: any): void {
        if (data !== undefined) {
            response.locals
                .data.push(`This is BaseRequestFilterBeforeExecution with data ${JSON.stringify(data)}`);
        } else {
            response.locals.data.push('This is BaseRequestFilterBeforeExecution');
        }
        next();
    }
    afterExecution(request: Request, response: Response, next: NextFunction, result: any, data?: any): void {
        if (data !== undefined) {
            response.locals
                .data.push(`This is BaseRequestFilterAfterExecution with data ${JSON.stringify(data)}`);
        } else {
            response.locals.data.push('This is BaseRequestFilterAfterExecution');
        }
        response.locals.data.push(`BaseRequestFilterAfterExecution Result: ${JSON.stringify(result)}`);
        next();
    }
}

@Injectable()
export class BaseRequestFilterAsync extends ActionFilterAsync {
    constructor(private aboutService: IAboutService) {
        super();
    }

    async beforeExecution(
        request: Request,
        response: Response,
        next: NextFunction,
        data?: any): Promise<void> {
        if (data !== undefined) {
            response.locals
                .data.push(`This is BaseRequestFilterAsyncBeforeExecution with data ${JSON.stringify(data)}`);
        } else {
            response.locals
                .data.push('This is BaseRequestFilterAsyncBeforeExecution');
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
                .data.push(`This is BaseRequestFilterAsyncAfterExecution with data ${JSON.stringify(data)}`);
        } else {
            response.locals.data.push('This is BaseRequestFilterAsyncAfterExecution');
        }
        let s = await this.aboutService.getViaPromise();
        response.locals.data.push(`BaseRequestFilterAsyncAfterExecution Result: ${JSON.stringify(result)}`);
        next();
    }
}

@Injectable()
export class BaseExceptionFilter extends ExceptionFilter {
    invoke(err: Error, request: Request, response: Response, next: NextFunction): void {
        if (err.message === 'BaseExceptionFilter thrown') {
            response.json({
                errMsg: 'BaseExceptionFilter: Ending the response',
                data: response.locals.data
            });
        }
        response.locals.data.push('This is BaseExceptionFilter');
        next(err);
    }
}

@Injectable()
export class BaseExceptionFilterAsync extends ExceptionFilterAsync {
    constructor(private aboutService: IAboutService) {
        super();
    }

    async invoke(err: Error, request: Request, response: Response, next: NextFunction): Promise<void> {
        if (err.message === 'BaseExceptionFilterAsync thrown') {
            response.json({
                errMsg: 'BaseExceptionFilterAsync: Ending the response',
                data: response.locals.data
            });
        }
        response.locals.data.push('This is BaseExceptionFilterAsync');
        let result = await this.aboutService.getViaPromise();
        next(err);
    }
}

@Injectable()
export class BaseResultFilterOne extends ResultFilter {
    invoke(request: Request, response: Response, next: NextFunction, result: any, data?: any): void {
        if (data !== undefined) {
            response.locals.data.push(`This is BaseResultFilterOne with data ${JSON.stringify(data)}`);
        } else {
            response.locals.data.push('This is BaseResultFilterOne');
        }
        response.locals.data.push(`BaseResultFilterOne Result: ${JSON.stringify(result)}`);
        next();
    }
}

@Injectable()
export class BaseResultFilterOneAsync extends ResultFilterAsync {
    async invoke(request: Request, response: Response, next: NextFunction, result: any, data?: any): Promise<void> {
        if (data !== undefined) {
            response.locals.data.push(`This is BaseResultFilterOneAsync with data ${JSON.stringify(data)}`);
        } else {
            response.locals.data.push('This is BaseResultFilterOneAsync');
        }
        response.locals.data.push(`BaseResultFilterOneAsync Result: ${JSON.stringify(result)}`);
        next();
    }
}
