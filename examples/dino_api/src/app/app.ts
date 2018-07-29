// tslint:disable-next-line:no-require-imports
import express = require('express');
// tslint:disable-next-line:no-require-imports
import cors = require('cors');
// tslint:disable-next-line:no-require-imports
import bodyParser = require('body-parser');
import { ReflectiveInjector } from 'injection-js';
import * as clone from 'lodash.clone';
import { ApiController, Dino } from '../../../index';
import { HomeController } from './controllers/home.controller';
import { Container } from './container/container';
import {
    StartMiddlewareOne,
    StartMiddlewareOneAsync,
    StartMiddlewareTwo,
    ResponseMiddleware,
    StartMiddlewareTwoAsync,
    RouteNotFoundErrorMiddleware,
    ErrorMiddlewareOne,
    ErrorMiddlewareTwo,
    ErrorMiddlewareOneAsync
} from './middlewares/middleware';
import { ServerErrorController } from './controllers/server.controller';
import { IndexController } from './controllers/index.controller';
import { ExceptionController } from './controllers/exception.controller';
import { ChildController } from './controllers/child.controller';
import { ChildExceptionController } from './controllers/child.exception.controller';

const app = express();
const port = process.env.PORT || 8088;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

let dino = new Dino(app, '/api');

dino.useRouter(() => express.Router());
dino.requestStart(StartMiddlewareOne);
dino.requestStart(StartMiddlewareOneAsync);
dino.requestStart(StartMiddlewareTwo);
dino.requestStart(StartMiddlewareTwoAsync);
dino.requestEnd(ResponseMiddleware);
dino.registerController(HomeController);
dino.registerController(IndexController);
dino.registerController(ExceptionController);
dino.registerController(ChildController);
dino.registerController(ChildExceptionController);
dino.serverError(RouteNotFoundErrorMiddleware);
dino.serverError(ErrorMiddlewareOne);
dino.serverError(ErrorMiddlewareOneAsync);
dino.serverError(ErrorMiddlewareTwo);
dino.registerApplicationError(ServerErrorController);

dino.dependencyResolver<ReflectiveInjector>(Container,
    (injector, type) => {
        let t = injector.get(type);
        if (t instanceof ApiController) {
            return clone(t);
        }

        return t;
    });

dino.bind();
app.listen(port, () => console.log(`Server started on port ${port}`));
