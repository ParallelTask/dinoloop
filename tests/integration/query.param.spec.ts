import {
    Controller,
    ApiController,
    Dino,
    HttpGet,
    QueryParam,
    toInteger,
    toNumber,
    toBoolean,
    request,
    Parse,
    HttpPost
} from './index';
import { initializeTests } from './init';

@Controller('/test')
class TestController extends ApiController {
    @HttpGet('/toBoolean')
    toBoolean(@QueryParam(toBoolean) val: boolean): any {
        return { data: val };
    }
    @HttpGet('/toInteger')
    toInteger(@QueryParam(toInteger) val: number): any {
        return { data: val };
    }
    @HttpGet('/toNumber')
    toNumber(@QueryParam(toNumber) val: number): any {
        return { data: val };
    }
    // Verify without handler
    @HttpGet('/query')
    query(@QueryParam() search: string): any {
        return { data: search };
    }
    // Verify with, without parse and with, without handler in query-param
    @HttpGet('/:user/:id')
    userImg(
        @Parse(toNumber) id: number,
        user: string,
        @QueryParam() price: string,
        @QueryParam(toBoolean) old: boolean): any {
        return { id: id, user: user, price: price, old: old };
    }
    @HttpPost('/add/:user/:id')
    addParse(
        @Parse(() => 'test_body') body: any,
        @Parse(() => 'test_user') user: string,
        id: string,
        @QueryParam() price: string,
        @QueryParam(toBoolean) old: boolean): any {
        return {
            body: body,
            user: user,
            id: id,
            price: price,
            old: old
        };
    }
}
describe('@QueryParam.e2e.spec', () => {
    const baseRoute = '/api/test';

    function register(dino: Dino): void {
        dino.registerController(TestController);
        dino.bind();
    }

    it('queryParam.toBoolean.parses_boolean', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/toBoolean?val=true`)
            .expect('Content-Type', /json/)
            .expect(200, { data: true }, done);
    });
    it('queryParam.toInteger.parses_integer', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/toInteger?val=5`)
            .expect('Content-Type', /json/)
            .expect(200, { data: 5 }, done);
    });
    it('queryParam.toNumber.parses_number', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/toNumber?val=5.5`)
            .expect('Content-Type', /json/)
            .expect(200, { data: 5.5 }, done);
    });
    it('queryParam.injects_query_string_value_with_no_parse', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/query?search=test`)
            .expect('Content-Type', /json/)
            .expect(200, { data: 'test' }, done);
    });
    it('queryParam.with_without_parse_and_with_without_handler_in_query_param', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        const expected = {
            id: 45,
            user: 'john',
            price: '10',
            old: true
        };
        request(app)
            .get(`${baseRoute}/${expected.user}/${expected.id}?price=10&old=true`)
            .expect('Content-Type', /json/)
            .expect(200, expected, done);
    });
    it('queryParam.with_body_with_without_parse_and_with_without_handler_in_query_param',
        done => {
            const x = initializeTests();
            const app = x.app;
            const dino = x.dino;
            register(dino);
            const expected = {
                body: 'test_body',
                user: 'test_user',
                id: 45,
                price: '10',
                old: true
            };
            request(app)
                .post(`${baseRoute}/add/john/${expected.id}?price=10&old=true`)
                .send({ data: 'test' })
                .expect('Content-Type', /json/)
                .expect(200, expected, done);
        });
});
