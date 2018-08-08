// tslint:disable-next-line:no-implicit-dependencies
import { Request, Response, NextFunction } from 'express';
import {
    request,
    Dino,
    Controller,
    ApiController,
    HttpGet,
    SendsResponse,
    RequestEndMiddleware,
    ErrorMiddleware
} from './index';
import { initializeTests } from './init';

class JsonEnd extends RequestEndMiddleware {
    invoke(
        request: Request,
        response: Response,
        next: NextFunction,
        result: any): void {
        if (result === undefined) response.status(204).end();
        else response.status(200).json(result);
    }
}

class ErrEnd extends ErrorMiddleware {
    invoke(
        err: Error,
        request: Request,
        response: Response,
        next: NextFunction): void {
        response.status(500).json({ data: err.message });
    }
}

@Controller('/test')
class TestController extends ApiController {

    @SendsResponse()
    @HttpGet('/proceedCb')
    proceedCb(): void {
        setTimeout(() => {
            this.dino.proceed({ data: 'Response_End' });
        }, 20);
    }

    @SendsResponse()
    @HttpGet('/errCb')
    errCb(): void {
        setTimeout(() => {
            this.dino.throw(new Error('TestError'));
        }, 20);
    }

    @SendsResponse()
    @HttpGet('/nextCb')
    netWithCallback(): void {
        setTimeout(() => {
            return this.next();
        }, 20);
    }

    // GET ?id=42
    @HttpGet('/query')
    query(): any {
        return { data: this.request.query.id };
    }
}

describe('api.controller.e2e.spec', () => {
    const baseRoute = '/api/test';

    function register(dino: Dino): void {
        dino.registerController(TestController);
        dino.serverError(ErrEnd);
        dino.requestEnd(JsonEnd);
        dino.bind();
    }

    it('dino.proceed_with_cb_$Get_returns_200_and_data', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/proceedCb`)
            .expect('Content-Type', /json/)
            .expect(200, { data: 'Response_End' }, done);
    });
    it('dino.throw_with_cb_$Get_returns_500_and_data', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/errCb`)
            .expect('Content-Type', /json/)
            .expect(500, { data: 'TestError' }, done);
    });
    // Verifies if next property is mapped to dino
    it('this.next_with_cb_and_without_result_returns_204', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/nextCb`)
            .expect(204, done);
    });
    // Verifies if request property is mapped to dino
    it('this.request.query.id_with_query_string_returns_200', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/query?id=42`)
            .expect('Content-Type', /json/)
            .expect(200, { data: '42' }, done);
    });
});
