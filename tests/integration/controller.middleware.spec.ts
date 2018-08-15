import {
    request,
    Controller,
    ApiController,
    HttpGet,
    Deferrer,
    ActionFilter,
    ActionFilterAsync,
    ResultFilter,
    ResultFilterAsync
} from './index';
import { initializeTests } from './init';

const testResponse = 'hello';
const actionFilterOneAfterTxt = 'actionFilterOneAfter';
const actionFilterOneAsyncAfterTxt = 'actionFilterOneAsyncAfter';
const resultOneTxt = 'resultOne';
const resultOneAsyncTxt = 'resultOneAsync';

class ActionFilterOne extends ActionFilter {
    beforeExecution(request, response, next): void {
        next();
    }
    afterExecution(request, response, next, result): void {
        response.locals.data.push(`${result}/${actionFilterOneAfterTxt}`);
        next();
    }
}

class ActionFilterOneAsync extends ActionFilterAsync {
    async beforeExecution(request, response, next): Promise<void> {
        next();
    }
    async afterExecution(request, response, next, result): Promise<void> {
        await Deferrer.run<any>((res, rej) => {
            setTimeout(() => {
                response.locals.data.push(`${result}/${actionFilterOneAsyncAfterTxt}`);
                next();
            }, 2);
        });
    }
}

class ResultFilterOne extends ResultFilter {
    invoke(request, response, next, result): void {
        response.locals.data.push(`${result}/${resultOneTxt}`);
        next();
    }
}

class ResultFilterOneAsync extends ResultFilterAsync {
    async invoke(request, response, next, result): Promise<void> {
        await Deferrer.run<any>((res, rej) => {
            setTimeout(() => {
                response.locals.data
                    .push(`${result}/${resultOneAsyncTxt}`);
                response.status(200).json({
                    data: response.locals.data
                });
            }, 2);
        });
    }
}

@Controller('/test', {
    use: [(req, res, next) => {
        res.locals.data = [];
        next();
    }],
    filters: [ActionFilterOne, ActionFilterOneAsync],
    result: [ResultFilterOne, ResultFilterOneAsync]
})
class TestController extends ApiController {
    @HttpGet('/get')
    get(): string {
        return testResponse;
    }
}

describe('controller.middleware.e2e.spec', () => {
    it('controllerMiddlewares.verify_dinowares_flow', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        const data = [];
        data.push(`${testResponse}/${actionFilterOneAfterTxt}`);
        data.push(`${testResponse}/${actionFilterOneAsyncAfterTxt}`);
        data.push(`${testResponse}/${resultOneTxt}`);
        data.push(`${testResponse}/${resultOneAsyncTxt}`);
        dino.registerController(TestController);
        dino.bind();
        request(app)
            .get('/api/test/get')
            .expect('Content-Type', /json/)
            .expect(200, { data: data }, done);
    });
});
