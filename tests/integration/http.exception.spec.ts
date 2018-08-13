import {
    request,
    Dino,
    Controller,
    ApiController,
    HttpGet,
    HttpResponseException,
    HttpStatusCode,
    BadRequestException,
    Async,
    ErrorMiddleware
} from './index';
import { initializeTests } from './init';

class JsonError extends ErrorMiddleware {
    invoke(err, request, response, next): void {
        if (err instanceof HttpResponseException) {
            response.status(HttpStatusCode.oK)
                .json({ data: 'JsonErrorMiddleware' });
        } else {
            next(err);
        }
    }
}

@Controller('/test')
class TestController extends ApiController {
    @HttpGet('/throwSync')
    throwSync(): any {
        throw new HttpResponseException(HttpStatusCode.internalServerError,
            { data: 'InternalServerError' });
    }

    @Async()
    @HttpGet('/throwAsync')
    async throwAsync(): Promise<void> {
        throw new HttpResponseException(HttpStatusCode.unauthorized,
            { data: 'Unauthorized' });
    }

    @HttpGet('/badRequest')
    requestEx(): Promise<void> {
        throw new BadRequestException({ data: 'BadRequest' });
    }
}

describe('http.exception.e2e.spec', () => {
    const baseRoute = '/api/test';

    function register(dino: Dino): void {
        dino.registerController(TestController);
        dino.bind();
    }

    it('throwSync.returns_HttpResponseException_with_internalServerError', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/throwSync`)
            .expect('Content-Type', /json/)
            .expect(500, { data: 'InternalServerError' }, done);
    });
    it('throwASync.returns_HttpResponseException_with_unauthorized', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/throwAsync`)
            .expect('Content-Type', /json/)
            .expect(401, { data: 'Unauthorized' }, done);
    });
    it('badRequest.returns_HttpResponseException_with_badRequest', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/badRequest`)
            .expect('Content-Type', /json/)
            .expect(400, { data: 'BadRequest' }, done);
    });
    it('JsonError.custom_server_error_middleware_handles_HttpResponseException', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        dino.registerController(TestController);
        dino.serverError(JsonError);
        dino.bind();
        request(app)
            .get(`${baseRoute}/throwSync`)
            .expect('Content-Type', /json/)
            .expect(200, { data: 'JsonErrorMiddleware' }, done);
    });
});
