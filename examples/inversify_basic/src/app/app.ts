// tslint:disable-next-line:no-require-imports
import express = require('express');
// tslint:disable-next-line:no-require-imports
import cors = require('cors');
// tslint:disable-next-line:no-require-imports
import bodyParser = require('body-parser');
import { Container } from 'inversify';
import { ApiController, Dino } from '../../../index';
import { HomeController } from './controllers/home.controller';
import { InversifyContainer } from './container/container';
import { StartMiddleware, ResponseMiddleware } from './services/middleware';

const app = express();

// Basic setup for express to work
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Dino requires express app instance
// and the path on which dino app to be mounted
let dino = new Dino(app, '/api');

// Use express router
dino.useRouter(() => express.Router());
dino.requestStart(StartMiddleware);
dino.requestEnd(ResponseMiddleware);
dino.registerController(HomeController);

dino.dependencyInjectionResolver<Container>(InversifyContainer,
    (injector, type) => {
        return injector.resolve(type);
    });

dino.bind();
app.listen(8088, () => console.log('Server started on port 8088'));
