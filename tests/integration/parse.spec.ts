import {
    Controller,
    ApiController,
    Dino,
    HttpGet,
    HttpPost,
    Parse,
    QueryParam,
    BindBoolean,
    BindInteger,
    BindNumber,
    BindRegExp,
    toInteger,
    toNumber,
    toBoolean,
    request,
    HandlerConstants,
    IParseHandler,
    IParseProps,
    DinoModel
} from './index';
import { initializeTests } from './init';

const customHandler: IParseHandler = (props: IParseProps): any => {
    const data = props.data === undefined ? 'test_data' : props.data;

    return {
        value: props.value,
        key: props.key,
        data: data,
        action: props.action,
        controller: props.controller.constructor.name
    };
};

const modelHandler: IParseHandler = (props: IParseProps, model: DinoModel): any => {
    model.isValid = false;
    model.values.push({
        key: props.key,
        value: props.value
    });
    model.errors.push({
        key: props.key,
        value: [`${props.value}TestError`]
    });
};

@Controller('/test')
class TestController extends ApiController {
    @HttpGet('/toBoolean/:val')
    toBoolean(@Parse(toBoolean) val: boolean): any {
        return { data: val };
    }
    @HttpGet('/toBooleanQuery/:val')
    toBooleanQuery(@QueryParam(toBoolean) val: boolean): any {
        return { data: val };
    }
    @HttpGet('/toInteger/:val')
    toInteger(@Parse(toInteger) val: number): any {
        return { data: val };
    }
    @HttpGet('/toNumber/:val')
    toNumber(@Parse(toNumber) val: number): any {
        return { data: val };
    }
    @HttpGet('/bindNumber/:val')
    bindNumber(@BindNumber() val: number): any {
        return { data: val };
    }
    @HttpGet('/bindBoolean/:val')
    bindBoolean(@BindBoolean() val: boolean): any {
        return { data: val };
    }
    @HttpGet('/bindInteger/:val')
    bindInteger(@BindInteger() val: number): any {
        return { data: val };
    }
    @HttpGet('/bindRegexp/:val')
    bindRegExp(@BindRegExp(/^[0-9]+$/) val: string): any {
        return { data: val };
    }
    // Verify with and without parse
    @HttpGet('/user/:id/:user/:old')
    userImg(
        @Parse(toNumber) id: number,
        user: string,
        @Parse(toBoolean) old: boolean): any {
        return { id: id, user: user, old: old };
    }
    // Verify with, without parse and without parsed-body
    @HttpPost('/add/:user/:op')
    add(
        body: any,
        user: string,
        @Parse(toNumber) op: number): any {
        return {
            body: body,
            user: user,
            op: op
        };
    }
    @HttpPost('/addParse/:user/:op')
    addParse(
        @Parse(() => 'test_body') body: any,
        @Parse(() => 'test_user') user: string): any {
        return {
            body: body,
            user: user
        };
    }
    @HttpGet('/handler/:id')
    handler(@Parse(customHandler) id: any): any {
        return id;
    }
    @HttpGet('/handlerData/:id')
    handlerData(@Parse(customHandler, 'custom_data') id: any): any {
        return id;
    }
    @HttpGet('/model/:user/:id')
    modelHandler(
        @Parse(modelHandler) id: any,
        @Parse(modelHandler) user: any): any {
        return {
            valid: this.model.isValid,
            values: this.model.values,
            errors: this.model.errors.filter(x => x.key === 'id')[0].value
        };
    }
}

describe('parse.e2e.spec', () => {
    const baseRoute = '/api/test';

    function register(dino: Dino): void {
        dino.registerController(TestController);
        dino.bind();
    }

    it('parse.toBoolean.parses_boolean', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/toBoolean/true`)
            .expect('Content-Type', /json/)
            .expect(200, { data: true }, done);
    });
    it('parse.toBoolean.fails_parsing_"hello"_verify_ActionParamException', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/toBoolean/hello`)
            .expect('Content-Type', /json/)
            // For message format
            // Refer: builtin.middlewares.ActionParamExceptionMiddleware
            .expect(400, {
                value: 'hello',
                message: HandlerConstants.toBoolean
            }, done);
    });
    it('parse.toInteger.parses_integer', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/toInteger/5`)
            .expect('Content-Type', /json/)
            .expect(200, { data: 5 }, done);
    });
    it('parse.toNumber.parses_number', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/toNumber/-5.5`)
            .expect('Content-Type', /json/)
            .expect(200, { data: -5.5 }, done);
    });
    it('BindNumber.parses_number', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/bindNumber/75.5`)
            .expect('Content-Type', /json/)
            .expect(200, { data: 75.5 }, done);
    });
    it('BindBoolean.parses_boolean', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/bindBoolean/true`)
            .expect('Content-Type', /json/)
            .expect(200, { data: true }, done);
    });
    it('BindInteger.parses_integer', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/bindInteger/85`)
            .expect('Content-Type', /json/)
            .expect(200, { data: 85 }, done);
    });
    it('BindRegexp.parses_against_regexp', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/bindRegexp/85`)
            .expect('Content-Type', /json/)
            .expect(200, { data: '85' }, done);
    });
    it('parse.when_pathParam_and_querystring_are_same_has_no_@QueryParam_injects_pathParam',
        done => {
            const x = initializeTests();
            const app = x.app;
            const dino = x.dino;
            register(dino);
            request(app)
                .get(`${baseRoute}/toBoolean/true?val=false`)
                .expect('Content-Type', /json/)
                .expect(200, { data: true }, done);
        });
    it('parse.when_pathParam_and_querystring_are_same_has_@QueryParam_injects_queryParam',
        done => {
            const x = initializeTests();
            const app = x.app;
            const dino = x.dino;
            register(dino);
            request(app)
                .get(`${baseRoute}/toBooleanQuery/true?val=false`)
                .expect('Content-Type', /json/)
                .expect(200, { data: false }, done);
        });
    it('parse.with_and_without_parse', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        register(dino);
        request(app)
            .get(`${baseRoute}/user/45/john/false`)
            .expect('Content-Type', /json/)
            .expect(200, { id: 45, user: 'john', old: false }, done);
    });
    it('parse.with_and_without_parse_and_without_parsed_body', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        const body = { msg: 'test' };
        register(dino);
        request(app)
            .post(`${baseRoute}/add/john/45`)
            .send(body)
            .expect('Content-Type', /json/)
            .expect(200, { body: body, user: 'john', op: 45 }, done);
    });
    it('parse.with_and_without_parse_and_with_parsed_body', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        const body = { msg: 'test' };
        register(dino);
        request(app)
            .post(`${baseRoute}/addParse/john/45`)
            .send(body)
            .expect('Content-Type', /json/)
            .expect(200, { body: 'test_body', user: 'test_user' }, done);
    });
    it('parse.custom_handler_without_custom_data', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        const expected = {
            value: 45,
            key: 'id',
            data: 'test_data',
            action: 'handler',
            controller: 'TestController'
        };
        register(dino);
        request(app)
            .get(`${baseRoute}/${expected.action}/${expected.value}`)
            .expect('Content-Type', /json/)
            .expect(200, expected, done);
    });
    it('parse.custom_handler_with_custom_data', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        const expected = {
            value: 45,
            key: 'id',
            data: 'custom_data',
            action: 'handlerData',
            controller: 'TestController'
        };
        register(dino);
        request(app)
            .get(`${baseRoute}/${expected.action}/${expected.value}`)
            .expect('Content-Type', /json/)
            .expect(200, expected, done);
    });
    it('parse.model_validations_handler', done => {
        const x = initializeTests();
        const app = x.app;
        const dino = x.dino;
        const expected = {
            valid: false,
            values: [{
                key: 'user',
                value: 'john'
            }, {
                key: 'id',
                value: '45'
            }],
            errors: ['45TestError']
        };
        register(dino);
        request(app)
            .get(`${baseRoute}/model/john/45`)
            .expect('Content-Type', /json/)
            .expect(200, expected, done);
    });
});
