// tslint:disable-next-line:no-require-imports no-implicit-dependencies
import express = require('express');

import {
    Controller,
    ApiController,
    Dino,
    HttpGet,
    request
} from '../index';

@Controller('/testcontroller')
class TestControllerFake extends ApiController {
    @HttpGet('/sample')
    sample(): any {
        return { data: 'testcontroller' };
    }
}

describe('attribute.spec', () => {
    it('sit.registerController.throws_error_when_router_not_configured', done => {
        let app = express();
        let dino = new Dino(app, '/api');

        dino.registerController(TestControllerFake);
        dino.useRouter(() => express.Router());
        dino.bind();

        request(app)
            .get('/api/testcontroller/sample')
            .expect('Content-Type', /json/)
            .expect(200, { data: 'testcontroller' });
        done();
    });
});
