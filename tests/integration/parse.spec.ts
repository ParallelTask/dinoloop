// tslint:disable-next-line:no-require-imports no-implicit-dependencies
import express = require('express');

import {
    Controller,
    ApiController,
    Dino,
    HttpGet,
    Parse,
    toInteger,
    toNumber,
    toBoolean,
    request
} from '../index';

@Controller('/testcontroller')
class TestControllerFake extends ApiController {
    @HttpGet('/toBoolean/:val')
    toBoolean(@Parse(toBoolean) val: boolean): any {
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
}

describe('parse_handlers', () => {
    it('parse.toBoolean.parses_boolean', done => {
        let app = express();
        let dino = new Dino(app, '/api');

        dino.registerController(TestControllerFake);
        dino.useRouter(() => express.Router());
        dino.bind();

        request(app)
            .get('/api/testcontroller/toBoolean/true')
            .expect('Content-Type', /json/)
            .expect(200, { data: true }, done);
    });

    it('parse.toInteger.parses_integer', done => {
        let app = express();
        let dino = new Dino(app, '/api');

        dino.registerController(TestControllerFake);
        dino.useRouter(() => express.Router());
        dino.bind();

        request(app)
            .get('/api/testcontroller/toInteger/5')
            .expect('Content-Type', /json/)
            .expect(200, { data: 5 }, done);
    });

    it('parse.toNumber.parses_number', done => {
        let app = express();
        let dino = new Dino(app, '/api');

        dino.registerController(TestControllerFake);
        dino.useRouter(() => express.Router());
        dino.bind();

        request(app)
            .get('/api/testcontroller/toNumber/-5.5')
            .expect('Content-Type', /json/)
            .expect(200, { data: -5.5 }, done);
    });
    it('parse.pathParam_when_identical_queryParam_provided', done => {
        let app = express();
        let dino = new Dino(app, '/api');
        dino.registerController(TestControllerFake);
        dino.useRouter(() => express.Router());
        dino.bind();
        request(app)
            .get('/api/testcontroller/toBoolean/true?val=false')
            .expect('Content-Type', /json/)
            .expect(200, { data: true }, done);
    });
});
