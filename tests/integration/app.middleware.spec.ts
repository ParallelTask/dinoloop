// tslint:disable-next-line:no-implicit-dependencies
import { Response } from 'express';
import {
    request,
    Dino,
    Controller,
    ApiController,
    HttpGet,
    AppStartMiddleware,
    RequestStartMiddleware,
    SendsResponse,
    RequestStartMiddlewareAsync,
    Deferrer,
    RequestEndMiddleware,
    RequestEndMiddlewareAsync,
    ErrorMiddleware,
    ErrorMiddlewareAsync
} from './index';
import { initializeTests } from './init';

const errMsgTxt = 'TestError';
const resultTxt = 'Result';
const reqStartResponseTxt = 'RequestStartEnd';
const reqStartResponseAsyncTxt = 'RequestStartEndAsync';
const reqStartOneTxt = 'RequestStartOne';
const reqStartOneAsyncTxt = 'RequestStartOneAsync';
const reqStartTwoTxt = 'RequestStartTwo';
const reqStartTwoAsyncTxt = 'RequestStartTwoAsync';
const reqEndDoneTxt = 'RequestEndDone';
const reqEndDoneAsyncTxt = 'RequestEndDoneAsync';
const reqEndOneTxt = 'RequestEndOne';
const reqEndOneAsyncTxt = 'RequestEndOneAsync';
const reqEndTwoTxt = 'RequestEndTwo';
const reqEndTwoAsyncTxt = 'RequestEndTwoAsync';
const serverErrOneTxt = 'ServerErrorOne';
const serverErrOneAsyncTxt = 'ServerErrorOneAsync';
const serverErrTwoTxt = 'ServerErrorTwo';
const serverErrTwoAsyncTxt = 'ServerErrorTwoAsync';

// Have default values to false
// DO NOT CHANGE THEM
const appConfig = {
    startOne: false,
    startTwo: false
};

class StartOne extends AppStartMiddleware {
    invoke(): void { appConfig.startOne = true; }
}

class StartTwo extends AppStartMiddleware {
    invoke(): void { appConfig.startTwo = true; }
}

class RequestStartEnd extends RequestStartMiddleware {
    invoke(request, response: Response, next): void {
        response.status(200).json({ data: reqStartResponseTxt });
    }
}

class RequestStartEndAsync extends RequestStartMiddlewareAsync {
    async invoke(request, response: Response, next): Promise<void> {
        await Deferrer.run<any>((res, rej) => {
            setTimeout(() => {
                response.status(200).json({
                    data: reqStartResponseAsyncTxt
                });
            }, 20);
        });
    }
}

class RequestStartOne extends RequestStartMiddleware {
    invoke(request, response: Response, next): void {
        response.locals.data = [];
        response.locals.data.push(reqStartOneTxt);
        next();
    }
}

class RequestStartOneAsync extends RequestStartMiddlewareAsync {
    async invoke(request, response: Response, next): Promise<void> {
        await Deferrer.run<any>((res, rej) => {
            setTimeout(() => {
                response.locals.data = [];
                response.locals.data.push(reqStartOneAsyncTxt);
                next();
            }, 20);
        });
    }
}

class RequestStartTwo extends RequestStartMiddleware {
    invoke(request, response: Response, next): void {
        response.locals.data.push(reqStartTwoTxt);
        next();
    }
}

class RequestStartTwoAsync extends RequestStartMiddlewareAsync {
    async invoke(request, response: Response, next): Promise<void> {
        await Deferrer.run<any>((res, rej) => {
            setTimeout(() => {
                response.locals.data.push(reqStartTwoAsyncTxt);
                next();
            }, 20);
        });
    }
}

class RequestEndDone extends RequestEndMiddleware {
    invoke(request, response: Response, next, result): void {
        result.push(reqEndDoneTxt);
        response.status(200).json(result);
    }
}

class RequestEndDoneAsync extends RequestEndMiddlewareAsync {
    async invoke(request, response: Response, next, result): Promise<void> {
        await Deferrer.run<any>((res, rej) => {
            setTimeout(() => {
                result.push(reqEndDoneAsyncTxt);
                response.status(200).json(result);
            }, 20);
        });
    }
}

class RequestEndOne extends RequestEndMiddleware {
    invoke(request, response: Response, next, result): void {
        result.push(reqEndOneTxt);
        next();
    }
}

class RequestEndOneAsync extends RequestEndMiddlewareAsync {
    async invoke(request, response: Response, next, result): Promise<void> {
        await Deferrer.run<any>((res, rej) => {
            setTimeout(() => {
                result.push(reqEndOneAsyncTxt);
                next();
            }, 20);
        });
    }
}

class RequestEndTwo extends RequestEndMiddleware {
    invoke(request, response: Response, next, result): void {
        result.push(reqEndTwoTxt);
        response.status(200).json(result);
    }
}

class RequestEndTwoAsync extends RequestEndMiddlewareAsync {
    async invoke(request, response: Response, next, result): Promise<void> {
        await Deferrer.run<any>((res, rej) => {
            setTimeout(() => {
                result.push(reqEndTwoAsyncTxt);
                response.status(200).json(result);
            }, 20);
        });
    }
}

class ServerErrorEnd extends ErrorMiddleware {
    invoke(err, request, response: Response, next): void {
        response.status(500).json({
            data: errMsgTxt
        });
    }
}

class ServerErrorEndAsync extends ErrorMiddlewareAsync {
    async invoke(err, request, response: Response, next): Promise<void> {
        await Deferrer.run<any>((res, rej) => {
            setTimeout(() => {
                response.status(500).json({
                    data: errMsgTxt
                });
            }, 20);
        });
    }
}

class ServerErrorOne extends ErrorMiddleware {
    invoke(err: Error, request, response: Response, next): void {
        response.locals.data = [];
        response.locals.data.push(serverErrOneTxt);
        response.locals.data.push(err.message);
        next(err);
    }
}

class ServerErrorOneAsync extends ErrorMiddlewareAsync {
    async invoke(err: Error, request, response: Response, next): Promise<void> {
        await Deferrer.run<any>((res, rej) => {
            setTimeout(() => {
                response.locals.data = [];
                response.locals.data.push(serverErrOneAsyncTxt);
                response.locals.data.push(err.message);
                next(err);
            }, 20);
        });
    }
}

class ServerErrorTwo extends ErrorMiddleware {
    invoke(err: Error, request, response: Response, next): void {
        response.locals.data.push(serverErrTwoTxt);
        response.locals.data.push(err.message);
        response.status(500).json(response.locals.data);
    }
}

class ServerErrorTwoAsync extends ErrorMiddlewareAsync {
    async invoke(err: Error, request, response: Response, next): Promise<void> {
        await Deferrer.run<any>((res, rej) => {
            setTimeout(() => {
                response.locals.data.push(serverErrTwoAsyncTxt);
                response.locals.data.push(err.message);
                response.status(500).json(response.locals.data);
            }, 20);
        });
    }
}

@Controller('/test')
class TestController extends ApiController {

    @HttpGet('/appConfig')
    appConfig(): any {
        return {
            one: appConfig.startOne,
            two: appConfig.startTwo
        };
    }

    @SendsResponse()
    @HttpGet('/start')
    start(): any {
        this.response.status(200)
            .json(this.response.locals.data);
    }

    @HttpGet('/result')
    result(): string[] {
        return [resultTxt];
    }

    @HttpGet('/err')
    err(): any {
        throw new Error(errMsgTxt);
    }
}

describe('app.middleware.e2e.spec', () => {
    const baseRoute = '/api/test';

    function register(dino: Dino): void {
        dino.registerController(TestController);
    }

    it('dino.applicationStart_verify_starts_invoked', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        dino.applicationStart(StartOne);
        dino.applicationStart(StartTwo);
        dino.bind();
        request(app)
            .get(`${baseRoute}/appConfig`)
            .expect('Content-Type', /json/)
            .expect(200, {
                one: true,
                two: true
            }, done);
    });
    it('dino.requestStart_ends_response', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        dino.requestStart(RequestStartEnd);
        dino.bind();
        request(app)
            .get(`${baseRoute}/appConfig`)
            .expect('Content-Type', /json/)
            .expect(200, { data: reqStartResponseTxt }, done);
    });
    it('dino.requestStartAsync_ends_response', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        dino.requestStart(RequestStartEndAsync);
        dino.bind();
        request(app)
            .get(`${baseRoute}/appConfig`)
            .expect('Content-Type', /json/)
            .expect(200, { data: reqStartResponseAsyncTxt }, done);
    });
    it('dino.requestStart_2_middlewares_returns_response', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        dino.requestStart(RequestStartOne);
        dino.requestStart(RequestStartTwo);
        dino.bind();
        request(app)
            .get(`${baseRoute}/start`)
            .expect('Content-Type', /json/)
            .expect(200, [reqStartOneTxt, reqStartTwoTxt], done);
    });
    it('dino.requestStartAsync_2_middlewares_returns_response', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        dino.requestStart(RequestStartOneAsync);
        dino.requestStart(RequestStartTwoAsync);
        dino.bind();
        request(app)
            .get(`${baseRoute}/start`)
            .expect('Content-Type', /json/)
            .expect(200, [reqStartOneAsyncTxt, reqStartTwoAsyncTxt], done);
    });
    it('dino.requestStart_Sync_and_Async_middlewares_returns_response', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        dino.requestStart(RequestStartOneAsync);
        dino.requestStart(RequestStartTwo);
        dino.bind();
        request(app)
            .get(`${baseRoute}/start`)
            .expect('Content-Type', /json/)
            .expect(200, [reqStartOneAsyncTxt, reqStartTwoTxt], done);
    });
    it('dino.requestEnd_ends_response', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        dino.requestEnd(RequestEndDone);
        dino.bind();
        request(app)
            .get(`${baseRoute}/result`)
            .expect('Content-Type', /json/)
            .expect(200, [resultTxt, reqEndDoneTxt], done);
    });
    it('dino.requestEndAsync_ends_response', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        dino.requestEnd(RequestEndDoneAsync);
        dino.bind();
        request(app)
            .get(`${baseRoute}/result`)
            .expect('Content-Type', /json/)
            .expect(200, [resultTxt, reqEndDoneAsyncTxt], done);
    });
    it('dino.requestEnd_2_middlewares_returns_response', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        dino.requestEnd(RequestEndOne);
        dino.requestEnd(RequestEndTwo);
        dino.bind();
        request(app)
            .get(`${baseRoute}/result`)
            .expect('Content-Type', /json/)
            .expect(200, [resultTxt, reqEndOneTxt, reqEndTwoTxt], done);
    });
    it('dino.requestEndAsync_2_middlewares_returns_response', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        dino.requestEnd(RequestEndOneAsync);
        dino.requestEnd(RequestEndTwoAsync);
        dino.bind();
        request(app)
            .get(`${baseRoute}/result`)
            .expect('Content-Type', /json/)
            .expect(200, [resultTxt, reqEndOneAsyncTxt, reqEndTwoAsyncTxt], done);
    });
    it('dino.requestEnd_Sync_and_Async_middlewares_returns_response', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        dino.requestEnd(RequestEndOneAsync);
        dino.requestEnd(RequestEndTwo);
        dino.bind();
        request(app)
            .get(`${baseRoute}/result`)
            .expect('Content-Type', /json/)
            .expect(200, [resultTxt, reqEndOneAsyncTxt, reqEndTwoTxt], done);
    });
    it('dino.serverError_ends_response', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        dino.serverError(ServerErrorEnd);
        dino.bind();
        request(app)
            .get(`${baseRoute}/err`)
            .expect('Content-Type', /json/)
            .expect(500, { data: errMsgTxt }, done);
    });
    it('dino.serverErrorAsync_ends_response', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        dino.serverError(ServerErrorEndAsync);
        dino.bind();
        request(app)
            .get(`${baseRoute}/err`)
            .expect('Content-Type', /json/)
            .expect(500, { data: errMsgTxt }, done);
    });
    it('dino.serverError_2_middlewares_returns_response', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        dino.serverError(ServerErrorOne);
        dino.serverError(ServerErrorTwo);
        dino.bind();
        request(app)
            .get(`${baseRoute}/err`)
            .expect('Content-Type', /json/)
            .expect(500, [
                serverErrOneTxt, errMsgTxt, serverErrTwoTxt, errMsgTxt
            ], done);
    });
    it('dino.serverErrorAsync_2_middlewares_returns_response', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        dino.serverError(ServerErrorOneAsync);
        dino.serverError(ServerErrorTwoAsync);
        dino.bind();
        request(app)
            .get(`${baseRoute}/err`)
            .expect('Content-Type', /json/)
            .expect(500, [
                serverErrOneAsyncTxt, errMsgTxt,
                serverErrTwoAsyncTxt, errMsgTxt
            ], done);
    });
    it('dino.serverError_Sync_and_Async_middlewares_returns_response', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        dino.serverError(ServerErrorOneAsync);
        dino.serverError(ServerErrorTwo);
        dino.bind();
        request(app)
            .get(`${baseRoute}/err`)
            .expect('Content-Type', /json/)
            .expect(500, [
                serverErrOneAsyncTxt, errMsgTxt,
                serverErrTwoTxt, errMsgTxt
            ], done);
    });
});
