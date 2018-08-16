import {
    request,
    Dino,
    Controller,
    ApiController,
    HttpGet,
    HttpResponseMessage,
    HttpStatusCode,
    RequestEndMiddleware,
    Ok
} from './index';
import { initializeTests } from './init';

class JsonEnd extends RequestEndMiddleware {
    invoke(request, response, next, result): void {
        if (result instanceof HttpResponseMessage) {
            response.status(HttpStatusCode.oK)
                .json({ data: 'JsonEndMiddleware' });
        } else {
            next();
        }
    }
}

@Controller('/test')
class TestController extends ApiController {
    @HttpGet('/result')
    result(): any {
        return new HttpResponseMessage(HttpStatusCode.oK,
            { data: 'JsonResult' });
    }

    @HttpGet('/ok')
    ok(): any {
        return Ok({ data: 'OkResult' });
    }
}

describe('http.response.e2e.spec', () => {
    const baseRoute = '/api/test';

    function register(dino: Dino): void {
        dino.registerController(TestController);
        dino.bind();
    }

    it('result.returns_HttpResponseMessage_with_ok', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/result`)
            .expect('Content-Type', /json/)
            .expect(200, { data: 'JsonResult' }, done);
    });
    it('ok.returns_HttpResponseMessage_with_ok', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/ok`)
            .expect('Content-Type', /json/)
            .expect(200, { data: 'OkResult' }, done);
    });
    it('JsonEnd.custom_request_end_middleware_handles_HttpResponseMessage', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        dino.registerController(TestController);
        dino.requestEnd(JsonEnd);
        dino.bind();
        request(app)
            .get(`${baseRoute}/result`)
            .expect('Content-Type', /json/)
            .expect(200, { data: 'JsonEndMiddleware' }, done);
    });
});
