// tslint:disable-next-line:no-implicit-dependencies
import { Response } from 'express';
import {
    request,
    Dino,
    Controller,
    ApiController,
    HttpGet,
    ErrorController
} from './index';
import { initializeTests } from './init';

const nextError = 'NextError';
const testErr = 'TestError';

@Controller('/test')
class TestController extends ApiController {

    // GET ?id=32
    @HttpGet('/get')
    query(): any {
        throw new Error(testErr);
    }

    // GET ?id=32
    @HttpGet('/next')
    nextErr(): any {
        throw new Error(nextError);
    }
}

class AppError extends ErrorController {
    internalServerError(): void {
        if (this.error.message === nextError) {
            this.next(this.error);
        } else {
            this.response.status(500).json({
                data: this.error.message,
                id: this.request.query.id
            });
        }
    }
}

describe('error.controller.e2e.spec', () => {
    const baseRoute = '/api/test';

    function register(dino: Dino): void {
        dino.registerController(TestController);
        dino.registerApplicationError(AppError);
        dino.bind();
    }

    // Verifies request, response and err property is mapped to dino
    it('/get_throws_error_returns_500_and_data', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/get?id=42`)
            .expect('Content-Type', /json/)
            .expect(500, {
                data: testErr,
                id: 42
            }, done);
    });
    // Verifies next handler
    it('/next_throws_error_to_registered_express_err_when_app.use_after_dino.bind', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        app.use((err, req, res: Response, next) => {
            res.status(500).json({
                data: 'From_Express',
                error: nextError
            });
        });
        request(app)
            .get(`${baseRoute}/next`)
            .expect('Content-Type', /json/)
            .expect(500, {
                data: 'From_Express',
                error: nextError
            }, done);
    });

    // Following test is not essential because it basically tests expressjs code
    // However, do not remove it. This test keeps track of expressjs behavior.
    // Reason to comment: Error is written to console by expressjs,
    // we do not want to pollute the console by writing these errors by expressjs
    // it('/next_throws_error_to_built_express_err_when_app.use_after_dino.bind', done => {
    //     const x = initializeTests();
    //     const app = x.app;
    //     const dino = x.dino;
    //     // This function is not invoked.
    //     // We actually get response handled by builtin error middleware
    //     // Refer: https://expressjs.com/en/guide/error-handling.html
    //     app.use((err, req, res: Response, next) => {
    //         res.status(500).json({
    //             data: 'From_Express',
    //             error: nextError
    //         });
    //     });
    //     register(dino);
    //     request(app)
    //         .get(`${baseRoute}/next`)
    //         // Here we got response text/html 
    //         // sent by expressjs builtin middleware
    //         // Note: error is written to console by expressjs
    //         .expect('Content-Type', 'text/html; charset=utf-8')
    //         .expect(500, done);
    // });
});
