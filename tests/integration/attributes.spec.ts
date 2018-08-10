import {
    request,
    Dino,
    Controller,
    ApiController,
    HttpGet,
    HttpPost,
    HttpHead,
    HttpDelete,
    SendsResponse,
    Async,
    Deferrer
} from './index';
import { initializeTests } from './init';

@Controller('/test')
class TestController extends ApiController {

    @HttpGet('/get')
    get(): any {
        return { data: 'Get' };
    }

    @HttpGet('/getWithoutData')
    getWithoutDate(): void {
        return;
    }

    @HttpGet(/^\d+$/)
    acceptsNumbers(): any {
        return { data: 'Numbers' };
    }

    @HttpPost('/post')
    post(): any {
        return { data: 'Post' };
    }

    @HttpHead('/head')
    head(): any {
        return { data: 'Head' };
    }

    @HttpDelete('/delete')
    del(): any {
        return { data: 'Delete' };
    }

    @HttpGet('/both')
    @HttpPost('/both')
    both(): any {
        return { data: 'Both' };
    }

    @SendsResponse()
    @HttpGet('/sendsResponse')
    sendsResp(): void {
        setTimeout(() => {
            this.response.status(200)
                .json({ data: 'SendsResponse' });
        }, 20);
    }

    @Async()
    @HttpGet('/async')
    async getAsync(): Promise<any> {
        return await Deferrer.run<any>((res, rej) => {
            setTimeout(() => {
                res({ data: 'Async' });
            }, 20);
        });
    }
}

describe('attributes.e2e.spec', () => {
    const baseRoute = '/api/test';

    function register(dino: Dino): void {
        dino.registerController(TestController);
        dino.bind();
    }

    it('In_/get_data_is_returned_$Get_returns_200_and_data', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/get`)
            .expect('Content-Type', /json/)
            .expect(200, { data: 'Get' }, done);
    });
    it('In_/get_data_is_returned_$Post_returns_404', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .post(`${baseRoute}/get`)
            .expect('Content-Type', /json/)
            // Format for 404: 
            // Refer modules.builtin.middlewares.RouteExceptionMiddleware
            .expect(404, '"Cannot POST /api/test/get"', done);
    });
    it('In_/getDummy_endpoint_not_defined_returns_404', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/getDummy`)
            .expect('Content-Type', /json/)
            // Format for 404: 
            // Refer modules.builtin.middlewares.RouteExceptionMiddleware
            .expect(404, '"Cannot GET /api/test/getDummy"', done);
    });
    it('In_/getWithoutData_data_not_returned_$Get_returns_204', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/getWithoutData`)
            .expect(204, done);
    });
    it('In_/acceptsNumbers_data_is_returned_$Get_returns_404_data', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/456789`)
            .expect(404, '"Cannot GET /api/test/456789"', done);
    });
    it('In_/post_data_is_returned_$Post_returns_200_and_data', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .post(`${baseRoute}/post`)
            .expect('Content-Type', /json/)
            .expect(200, { data: 'Post' }, done);
    });
    it('In_/post_data_is_returned_$Get_returns_404', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/post`)
            .expect('Content-Type', /json/)
            // Format for 404: 
            // Refer modules.builtin.middlewares.RouteExceptionMiddleware
            .expect(404, '"Cannot GET /api/test/post"', done);
    });
    it('In_/head_data_is_returned_$Head_returns_200_data_undefined', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .head(`${baseRoute}/head`)
            .expect('Content-Type', /json/)
            .expect(200, undefined, done);
    });
    it('In_/both_data_is_returned_$Get_returns_200_and_data', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/both`)
            .expect('Content-Type', /json/)
            .expect(200, { data: 'Both' }, done);
    });
    it('In_/both_data_is_returned_$Post_returns_200_and_data', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .post(`${baseRoute}/both`)
            .expect('Content-Type', /json/)
            .expect(200, { data: 'Both' }, done);
    });
    it('In_/both_data_is_returned_$Put_returns_404', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .put(`${baseRoute}/both`)
            .expect('Content-Type', /json/)
            // Format for 404: 
            // Refer modules.builtin.middlewares.RouteExceptionMiddleware
            .expect(404, '"Cannot PUT /api/test/both"', done);
    });
    it('In_/sendsResponse_data_is_returned_$Get_returns_200_data', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/sendsResponse`)
            .expect('Content-Type', /json/)
            .expect(200, { data: 'SendsResponse' }, done);
    });
    it('In_/async_await_data_is_returned_$Get_returns_200_data', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/async`)
            .expect('Content-Type', /json/)
            .expect(200, { data: 'Async' }, done);
    });
});
