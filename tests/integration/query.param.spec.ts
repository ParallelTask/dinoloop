// tslint:disable-next-line:no-require-imports no-implicit-dependencies
import express = require('express');
import {
    Controller,
    ApiController,
    Dino,
    HttpGet,
    QueryParam,
    toInteger,
    toNumber,
    toBoolean,
    request
} from '../index';
@Controller('/testcontroller')
class TestControllerFake extends ApiController {
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
    @HttpGet('/toBooleanPathAndQuery/:val')
    toBooleanPathAndQuery(@QueryParam(toBoolean) val: number): any {
        return { data: val };
    }
    @HttpGet('/toIntegerPathAndQuery/:val')
    toIntegerPathAndQuery(@QueryParam(toInteger) val: number): any {
        return { data: val };
    }
    @HttpGet('/toNumberPathAndQuery/:val')
    toNumberPathAndQuery(@QueryParam(toNumber) val: number): any {
        return { data: val };
    }
}
describe('queryParam.spec', () => {
    it('queryParam.toBoolean.parses_boolean', done => {
        let app = express();
        let dino = new Dino(app, '/api');
        dino.registerController(TestControllerFake);
        dino.useRouter(() => express.Router());
        dino.bind();
        request(app)
            .get('/api/testcontroller/toBoolean?val=true')
            .expect('Content-Type', /json/)
            .expect(200, { data: true }, done);
    });
    it('queryParam.toInteger.parses_integer', done => {
        let app = express();
        let dino = new Dino(app, '/api');
        dino.registerController(TestControllerFake);
        dino.useRouter(() => express.Router());
        dino.bind();
        request(app)
            .get('/api/testcontroller/toInteger?val=5')
            .expect('Content-Type', /json/)
            .expect(200, { data: 5 }, done);
    });
    it('queryParam.toNumber.parses_number', done => {
        let app = express();
        let dino = new Dino(app, '/api');
        dino.registerController(TestControllerFake);
        dino.useRouter(() => express.Router());
        dino.bind();
        request(app)
            .get('/api/testcontroller/toNumber?val=5.5')
            .expect('Content-Type', /json/)
            .expect(200, { data: 5.5 }, done);
    });
    it('queryParam.overrides_pathParam_with_same_keyName', done => {
        let app = express();
        let dino = new Dino(app, '/api');
        dino.registerController(TestControllerFake);
        dino.useRouter(() => express.Router());
        dino.bind();
        request(app)
            .get('/api/testcontroller/toBooleanPathAndQuery/FALSE?val=TRUE')
            .expect('Content-Type', /json/)
            .expect(200, { data: true }, done);
    });
});
