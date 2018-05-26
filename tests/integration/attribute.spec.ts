// tslint:disable-next-line:no-require-imports
import express = require('express');

import {
    Controller,
    ApiController,
    Dino,
    HttpGet,
    bodyParser,
    request
} from '../index';

@Controller('/testcontroller')
class TestControllerFake extends ApiController {
    @HttpGet('/sample')
    sample(): string {
        return 'testcontroller';
    }
}

describe('attribute.spec', () => {
    it('sit.registerController.throws_error_when_router_not_configured', done => {
        let app = express();
        let dino = new Dino(app, '/api');

        dino.registerController(TestControllerFake);
        dino.bind();

        request(app)
            .get('/user')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});
