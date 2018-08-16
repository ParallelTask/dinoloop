// tslint:disable-next-line:no-implicit-dependencies
import { Response } from 'express';
import {
    request,
    Controller,
    ApiController,
    HttpGet,
    Deferrer,
    RequestEndMiddleware,
    Middleware,
    MiddlewareAsync,
    ActionFilter,
    ActionFilterAsync,
    ResultFilter,
    ExceptionFilter,
    ExceptionFilterAsync,
    ErrorMiddleware
} from './index';
import { initializeTests } from './init';

const testError = 'testError';
const testResponse = 'hello';
const useMiddlewareOneTxt = 'useMiddlewareOne';
const useMiddlewareOneBaseTxt = 'useMiddlewareOneBase';
const middlewareOneBaseTxt = 'middlewareOneBase';
const middlewareOneAsyncTxt = 'middlewareOneAsync';
const actionFilterOneBeforeTxt = 'actionFilterOneBefore';
const actionFilterOneAfterTxt = 'actionFilterOneAfter';
const actionFilterOneBaseAsyncBeforeTxt = 'actionFilterOneBaseAsyncBefore';
const actionFilterOneBaseAsyncAfterTxt = 'actionFilterOneBaseAsyncAfter';
const resultOneTxt = 'resultOne';
const resultOneBaseTxt = 'resultOneBase';
const exceptionOneTxt = 'exceptionOne';
const exceptionOneBaseTxt = 'exceptionOneBase';

class MiddlewareOneBase extends Middleware {
    invoke(request, response, next, data): void {
        response.locals.data.push(`${middlewareOneBaseTxt}`);
        next();
    }
}

class MiddlewareOneAsync extends MiddlewareAsync {
    async invoke(request, response, next): Promise<void> {
        await Deferrer.run<any>((res, rej) => {
            setTimeout(() => {
                response.locals.data
                    .push(`${middlewareOneAsyncTxt}`);
                next();
            }, 2);
        });
    }
}

class ActionFilterOne extends ActionFilter {
    beforeExecution(request, response, next): void {
        response.locals.data
            .push(`${actionFilterOneBeforeTxt}`);
        next();
    }
    afterExecution(request, response, next): void {
        response.locals.data
            .push(`${actionFilterOneAfterTxt}`);
        next();
    }
}

class ActionFilterOneBaseAsync extends ActionFilterAsync {
    async beforeExecution(request, response, next, data): Promise<void> {
        await Deferrer.run<any>((res, rej) => {
            setTimeout(() => {
                response.locals.data
                    .push(`${actionFilterOneBaseAsyncBeforeTxt}`);
                next();
            }, 2);
        });
    }
    async afterExecution(request, response, next, result, data): Promise<void> {
        await Deferrer.run<any>((res, rej) => {
            setTimeout(() => {
                response.locals.data
                    .push(`${actionFilterOneBaseAsyncAfterTxt}`);
                next();
            }, 2);
        });
    }
}

class ResultFilterOne extends ResultFilter {
    invoke(request, response, next): void {
        response.locals.data.push(`${resultOneTxt}`);
        next();
    }
}

class ResultFilterOneBase extends ResultFilter {
    invoke(request, response, next, result, data): void {
        response.locals.data.push(`${resultOneBaseTxt}`);
        next();
    }
}

class RequestEndOne extends RequestEndMiddleware {
    invoke(request, response: Response, next, result): void {
        response.status(200).json({
            data: response.locals.data
        });
    }
}

class ExceptionOne extends ExceptionFilter {
    invoke(err, request, response, next): void {
        response.locals.data
            .push(`${exceptionOneTxt}`);
        next(err);
    }
}

class ExceptionOneBase extends ExceptionFilterAsync {
    async invoke(err, request, response, next): Promise<void> {
        response.locals.data
            .push(`${exceptionOneBaseTxt}`);
        next(err);
    }
}

class ServerErrorOne extends ErrorMiddleware {
    invoke(err, request, response, next): void {
        response.status(500).json({
            data: response.locals.data
        });
    }
}

@Controller('', {
    use: [
        (req, res, next) => {
            res.locals.data = [];
            res.locals.data.push(`${useMiddlewareOneBaseTxt}`);
            next();
        }
    ],
    middlewares: [MiddlewareOneBase],
    filters: [ActionFilterOneBaseAsync],
    result: [ResultFilterOneBase]
})
class BaseController extends ApiController { }

@Controller('/child', {
    use: [
        (req, res, next) => {
            res.locals.data.push(`${useMiddlewareOneTxt}`);
            next();
        }
    ],
    middlewares: [MiddlewareOneAsync],
    filters: [ActionFilterOne],
    result: [ResultFilterOne]
})
class ChildController extends BaseController {
    @HttpGet('/get')
    get(): string {
        return testResponse;
    }
}

@Controller('', {
    use: [(req, res, next) => {
        res.locals.data = [];
        next();
    }],
    exceptions: [ExceptionOneBase]
})
class BaseExController extends ApiController { }

@Controller('/child', {
    exceptions: [ExceptionOne]
})
class ChildExController extends BaseExController {
    @HttpGet('/get')
    get(): void {
        throw new Error(testError);
    }
}

@Controller('/base')
class BaseEndController extends ApiController {
    @HttpGet('/end')
    end(): any { return { data: 'BaseEndPoint' }; }
}

@Controller('/child')
class ChildEndController extends BaseEndController { }

describe('controller.inheritance.e2e.spec', () => {
    it('controllerMiddlewares.verify_derived_dinowares_flow', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        const data = [];
        data.push(`${useMiddlewareOneBaseTxt}`);
        data.push(`${useMiddlewareOneTxt}`);
        data.push(`${middlewareOneBaseTxt}`);
        data.push(`${middlewareOneAsyncTxt}`);
        data.push(`${actionFilterOneBaseAsyncBeforeTxt}`);
        data.push(`${actionFilterOneBeforeTxt}`);
        data.push(`${actionFilterOneAfterTxt}`);
        data.push(`${actionFilterOneBaseAsyncAfterTxt}`);
        data.push(`${resultOneTxt}`);
        data.push(`${resultOneBaseTxt}`);
        dino.registerController(ChildController);
        dino.requestEnd(RequestEndOne);
        dino.bind();
        request(app)
            .get('/api/child/get')
            .expect('Content-Type', /json/)
            .expect(200, { data: data }, done);
    });
    it('controllerMiddlewares.verify_derived_dinowares_flow_when_exception_occurred', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        const data = [];
        data.push(`${exceptionOneTxt}`);
        data.push(`${exceptionOneBaseTxt}`);
        dino.registerController(ChildExController);
        dino.serverError(ServerErrorOne);
        dino.bind();
        request(app)
            .get('/api/child/get')
            .expect('Content-Type', /json/)
            .expect(500, { data: data }, done);
    });
    it('controllerMiddlewares.verify_base_controller_endpoint_is_derived', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        dino.registerController(ChildEndController);
        dino.bind();
        request(app)
            .get('/api/base/child/end')
            .expect('Content-Type', /json/)
            .expect(200, { data: 'BaseEndPoint' }, done);
    });
});
