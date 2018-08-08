import {
    request,
    Dino,
    Controller,
    ApiController,
    HttpGet,
    HttpPost
} from './index';
import { initializeTests } from './init';

@Controller('/test')
class TestController extends ApiController {

    @HttpGet('/:id')
    get(id: string): any {
        return { data: id };
    }

    @HttpGet('/:user/images/:img')
    getImg(img: string, user: string): any {
        return { img: img, user: user };
    }

    @HttpPost('/post')
    post(body: any): any {
        return body;
    }

    @HttpPost('/add/:id')
    add(body: any, id: string): any {
        return { body: body, id: id };
    }

    @HttpGet('/optional/:id?')
    optional(id: string): any {
        // reason to return "undefined"
        // because json stringify will remove elements
        // which are undefined
        if (id === undefined) return { data: 'undefined' };

        return { data: id };
    }
}

describe('segments.e2e.spec', () => {
    const baseRoute = '/api/test';

    function register(dino: Dino): void {
        dino.registerController(TestController);
        dino.bind();
    }

    it('/:id.returns_data', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/22`)
            .expect('Content-Type', /json/)
            .expect(200, { data: '22' }, done);
    });
    it('/:user/images/:img.returns_data', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/john/images/45`)
            .expect('Content-Type', /json/)
            .expect(200, { img: '45', user: 'john' }, done);
    });
    it('/post.returns_data', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .post(`${baseRoute}/post`)
            .send({ name: 'john' })
            .expect('Content-Type', /json/)
            .expect(200, { name: 'john' }, done);
    });
    it('/add/:id.returns_data', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .post(`${baseRoute}/add/45`)
            .send({ name: 'john' })
            .expect('Content-Type', /json/)
            .expect(200, { body: { name: 'john' }, id: '45' }, done);
    });
    // Refer: For optional params
    // https://stackoverflow.com/questions/10020099/express-js-routing-optional-spat-param
    it('/optional/:id?.returns_data', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/optional/22`)
            .expect('Content-Type', /json/)
            .expect(200, { data: '22' }, done);
    });
    it('/optional/:id?.returns_undefined', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/optional`)
            .expect('Content-Type', /json/)
            .expect(200, { data: 'undefined' }, done);
    });
});
