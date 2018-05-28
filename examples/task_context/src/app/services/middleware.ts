import {
    RequestStartMiddleware,
    RequestEndMiddleware,
    Middleware,
    ActionFilter,
    ResultFilter,
    ExceptionFilter,
    IUserIdentity
} from '../../../../index';
import { injectable } from 'inversify';

@injectable()
export class TokenStartMiddleware extends RequestStartMiddleware {
    constructor(private userIdentity: IUserIdentity) {
        super();
    }
    invoke(request: any, response: any, next: any): void {
        setTimeout(() => {
            this.userIdentity.set('role', `admin - ${request.body.name}`);
            next();
        }, 20000);
    }
}

@injectable()
export class ResponseMiddleware extends RequestEndMiddleware {
    constructor(private userIdentity: IUserIdentity) {
        super();
    }
    invoke(request: any, response: any, next: any, result: any): void {
        this.userIdentity.set('FinalResponseFilter', `executed - ${request.body.name}`);
        response.json({
            result: result,
            data: this.userIdentity
        });
    }
}

@injectable()
export class LogMiddleware extends Middleware {
    constructor(private userIdentity: IUserIdentity) {
        super();
    }
    invoke(request: any, response: any, next: any, data?: any): void {
        this.userIdentity.set('loggedIn', {
            yesterday: true,
            name: request.body.name
        });
        next();
    }
}

@injectable()
export class RequestFilter extends ActionFilter {
    constructor(private userIdentity: IUserIdentity) {
        super();
    }
    beforeExecution(request: any, response: any, next: any, data?: any): void {
        this.userIdentity.set('allow', true);
        next();
    }
    afterExecution(request: any, response: any, next: any, result: any, data?: any): void {
        this.userIdentity.set('afterFilter', `executed - ${request.body.name}`);
        next();
    }
}

@injectable()
export class JsonFilter extends ResultFilter {
    constructor(private userIdentity: IUserIdentity) {
        super();
    }
    invoke(request: any, response: any, next: any, result: any, data?: any): void {
        this.userIdentity.set('JsonFilter', `executed - ${request.body.name}`);
        next();
    }
}

@injectable()
export class NException extends ExceptionFilter {
    constructor(private userIdentity: IUserIdentity) {
        super();
    }
    invoke(err: Error, request: any, response: any, next: any): void {

    }
}
