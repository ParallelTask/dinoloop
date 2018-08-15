// tslint:disable-next-line:no-implicit-dependencies
import { Request, Response } from 'express';
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
    ResultFilterAsync,
    ExceptionFilter,
    ExceptionFilterAsync,
    ErrorMiddleware
} from './index';
import { initializeTests } from './init';

const testData = 'testData';
const testError = 'TestError';
const testResponse = 'hello';
const useMiddlewareOneTxt = 'useMiddlewareOne';
const useMiddlewareTwoTxt = 'useMiddlewareTwo';
const middlewareOneTxt = 'middlewareOne';
const middlewareOneAsyncTxt = 'middlewareOneAsync';
const actionFilterOneBeforeTxt = 'actionFilterOneBefore';
const actionFilterOneAfterTxt = 'actionFilterOneAfter';
const actionFilterOneAsyncBeforeTxt = 'actionFilterOneAsyncBefore';
const actionFilterOneAsyncAfterTxt = 'actionFilterOneAsyncAfter';
const resultOneTxt = 'resultOne';
const resultOneAsyncTxt = 'resultOneAsync';
const requestEndOneTxt = 'requestEndOne';
const exceptionOneTxt = 'exceptionOne';
const exceptionOneAsyncTxt = 'exceptionOneAsync';
const serverErrorOneTxt = 'serverErrorOne';

class MiddlewareOne extends Middleware {
    invoke(request, response: Response, next): void {
        response.locals.data.push(`${request.query.id}/${middlewareOneTxt}`);
        next();
    }
}

class MiddlewareOneData extends Middleware {
    invoke(request, response: Response, next, data): void {
        response.locals.data.push(`${data}/${middlewareOneTxt}`);
        next();
    }
}

class MiddlewareOneAsync extends MiddlewareAsync {
    async invoke(request, response: Response, next): Promise<void> {
        await Deferrer.run<any>((res, rej) => {
            setTimeout(() => {
                response.locals.data
                    .push(`${request.query.id}/${middlewareOneAsyncTxt}`);
                next();
            }, 2);
        });
    }
}

class MiddlewareOneDataAsync extends MiddlewareAsync {
    async invoke(request, response: Response, next, data): Promise<void> {
        await Deferrer.run<any>((res, rej) => {
            setTimeout(() => {
                response.locals.data
                    .push(`${data}/${middlewareOneAsyncTxt}`);
                next();
            }, 2);
        });
    }
}

class ActionFilterOne extends ActionFilter {
    beforeExecution(request: Request, response: Response, next): void {
        response.locals.data
            .push(`${request.query.id}/${actionFilterOneBeforeTxt}`);
        next();
    }
    afterExecution(request: Request, response: Response, next): void {
        response.locals.data
            .push(`${request.query.id}/${actionFilterOneAfterTxt}`);
        next();
    }
}

class ActionFilterOneData extends ActionFilter {
    beforeExecution(request, response, next, data): void {
        response.locals.data
            .push(`${data}/${actionFilterOneBeforeTxt}`);
        next();
    }
    afterExecution(request, response, next, result, data): void {
        response.locals.data
            .push(`${data}/${actionFilterOneAfterTxt}`);
        next();
    }
}

class ActionFilterOneAsync extends ActionFilterAsync {
    async beforeExecution(request: Request, response: Response, next): Promise<void> {
        await Deferrer.run<any>((res, rej) => {
            setTimeout(() => {
                response.locals.data
                    .push(`${request.query.id}/${actionFilterOneAsyncBeforeTxt}`);
                next();
            }, 2);
        });
    }
    async afterExecution(request: Request, response: Response, next): Promise<void> {
        await Deferrer.run<any>((res, rej) => {
            setTimeout(() => {
                response.locals.data
                    .push(`${request.query.id}/${actionFilterOneAsyncAfterTxt}`);
                next();
            }, 2);
        });
    }
}

class ActionFilterOneDataAsync extends ActionFilterAsync {
    async beforeExecution(request: Request, response: Response, next, data): Promise<void> {
        await Deferrer.run<any>((res, rej) => {
            setTimeout(() => {
                response.locals.data
                    .push(`${data}/${actionFilterOneAsyncBeforeTxt}`);
                next();
            }, 2);
        });
    }
    async afterExecution(request: Request, response: Response, next, result, data): Promise<void> {
        await Deferrer.run<any>((res, rej) => {
            setTimeout(() => {
                response.locals.data
                    .push(`${data}/${actionFilterOneAsyncAfterTxt}`);
                next();
            }, 2);
        });
    }
}

class ResultFilterOne extends ResultFilter {
    invoke(request, response: Response, next): void {
        response.locals.data.push(`${request.query.id}/${resultOneTxt}`);
        next();
    }
}

class ResultFilterOneData extends ResultFilter {
    invoke(request, response: Response, next, result, data): void {
        response.locals.data.push(`${data}/${resultOneTxt}`);
        next();
    }
}

class ResultFilterOneAsync extends ResultFilterAsync {
    async invoke(request, response: Response, next): Promise<void> {
        await Deferrer.run<any>((res, rej) => {
            setTimeout(() => {
                response.locals.data
                    .push(`${request.query.id}/${resultOneAsyncTxt}`);
                next();
            }, 2);
        });
    }
}

class ResultFilterOneDataAsync extends ResultFilterAsync {
    async invoke(request, response: Response, next, result, data): Promise<void> {
        await Deferrer.run<any>((res, rej) => {
            setTimeout(() => {
                response.locals.data
                    .push(`${data}/${resultOneAsyncTxt}`);
                response.status(200).json({
                    data: response.locals.data
                });
            }, 2);
        });
    }
}

class RequestEndOne extends RequestEndMiddleware {
    invoke(request, response: Response, next, result: any): void {
        response.locals.data
            .push(`${request.query.id}/${requestEndOneTxt}`);
        response.status(200).json({
            data: response.locals.data,
            result: result
        });
    }
}

class ExceptionOne extends ExceptionFilter {
    invoke(err, request, response, next): void {
        response.locals.data
            .push(`${err.message}/${request.query.id}/${exceptionOneTxt}`);
        next(err);
    }
}

class ExceptionOneAsync extends ExceptionFilterAsync {
    async invoke(err, request, response, next): Promise<void> {
        response.locals.data
            .push(`${err.message}/${request.query.id}/${exceptionOneAsyncTxt}`);
        next(err);
    }
}

class ServerErrorOne extends ErrorMiddleware {
    invoke(err, request, response, next): void {
        response.locals.data
            .push(`${err.message}/${request.query.id}/${serverErrorOneTxt}`);
        response.status(500).json({
            data: response.locals.data
        });
    }
}

@Controller('/test', {
    use: [
        // Verify both req, res objects are properly mapped
        (req, res, next) => {
            res.locals.data = [];
            res.locals.data.push(`${req.query.id}/${useMiddlewareOneTxt}`);
            next();
        },
        (req, res, next) => {
            res.locals.data.push(`${req.query.id}/${useMiddlewareTwoTxt}`);
            next();
        }
    ],
    middlewares: [MiddlewareOne, MiddlewareOneAsync],
    filters: [ActionFilterOne, ActionFilterOneAsync],
    result: [ResultFilterOne, ResultFilterOneAsync]
})
class TestController extends ApiController {
    @HttpGet('/get')
    get(): string {
        return testResponse;
    }
}

@Controller('/ex', {
    use: [(req, res, next) => {
        res.locals.data = [];
        next();
    }],
    exceptions: [ExceptionOne, ExceptionOneAsync]
})
class ExceptionController extends ApiController {
    @HttpGet('/get')
    thro(): void {
        throw new Error(testError);
    }
}

@Controller('/data', {
    use: [
        (req, res, next) => {
            res.locals.data = [];
            next();
        }
    ],
    middlewares: [{
        useClass: MiddlewareOneData,
        data: testData
    }, {
        useClass: MiddlewareOneDataAsync,
        data: testData
    }],
    filters: [{
        useClass: ActionFilterOneData,
        data: testData
    }, {
        useClass: ActionFilterOneDataAsync,
        data: testData
    }],
    result: [{
        useClass: ResultFilterOneData,
        data: testData
    }, {
        useClass: ResultFilterOneDataAsync,
        data: testData
    }]
})
class DataController extends ApiController {
    @HttpGet('/get')
    get(): string {
        return 'hello';
    }
}

describe('dinowares.flow.e2e.spec', () => {
    it('controllerMiddlewares.verify_dinowares_flow', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        const id = 1;
        const data = [];
        data.push(`${id}/${useMiddlewareOneTxt}`);
        data.push(`${id}/${useMiddlewareTwoTxt}`);
        data.push(`${id}/${middlewareOneTxt}`);
        data.push(`${id}/${middlewareOneAsyncTxt}`);
        data.push(`${id}/${actionFilterOneBeforeTxt}`);
        data.push(`${id}/${actionFilterOneAsyncBeforeTxt}`);
        data.push(`${id}/${actionFilterOneAfterTxt}`);
        data.push(`${id}/${actionFilterOneAsyncAfterTxt}`);
        data.push(`${id}/${resultOneTxt}`);
        data.push(`${id}/${resultOneAsyncTxt}`);
        data.push(`${id}/${requestEndOneTxt}`);
        dino.registerController(TestController);
        dino.requestEnd(RequestEndOne);
        dino.bind();
        request(app)
            .get(`/api/test/get?id=${id}`)
            .expect('Content-Type', /json/)
            .expect(200, {
                data: data,
                result: testResponse
            }, done);
    });
    it('controllerExceptions.verify_dinowares_flow', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        const id = 1;
        const data = [];
        data.push(`${testError}/${id}/${exceptionOneTxt}`);
        data.push(`${testError}/${id}/${exceptionOneAsyncTxt}`);
        data.push(`${testError}/${id}/${serverErrorOneTxt}`);
        dino.registerController(ExceptionController);
        dino.serverError(ServerErrorOne);
        dino.bind();
        request(app)
            .get(`/api/ex/get?id=${id}`)
            .expect('Content-Type', /json/)
            .expect(500, { data: data }, done);
    });
    it('controllerMiddlewares.verify_dinowares_gets_injected_with_data', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        const data = [];
        data.push(`${testData}/${middlewareOneTxt}`);
        data.push(`${testData}/${middlewareOneAsyncTxt}`);
        data.push(`${testData}/${actionFilterOneBeforeTxt}`);
        data.push(`${testData}/${actionFilterOneAsyncBeforeTxt}`);
        data.push(`${testData}/${actionFilterOneAfterTxt}`);
        data.push(`${testData}/${actionFilterOneAsyncAfterTxt}`);
        data.push(`${testData}/${resultOneTxt}`);
        data.push(`${testData}/${resultOneAsyncTxt}`);
        dino.registerController(DataController);
        dino.bind();
        request(app)
            .get('/api/data/get')
            .expect('Content-Type', /json/)
            .expect(200, { data: data }, done);
    });
});
