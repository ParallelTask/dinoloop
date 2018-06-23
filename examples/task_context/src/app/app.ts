// tslint:disable-next-line:no-require-imports
import express = require('express');
// tslint:disable-next-line:no-require-imports
import cors = require('cors');
// tslint:disable-next-line:no-require-imports
import bodyParser = require('body-parser');
import { ApiController, Dino } from '../../../index';
import { HomeController } from './controllers/home.controller';
import { InversifyContainer } from './container/container';
import { TokenStartMiddleware, ResponseMiddleware } from './services/middleware';
import { Container } from 'inversify';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

let dino = new Dino(app, '/api');
dino.useRouter(() => express.Router());
dino.requestStart(TokenStartMiddleware);
dino.registerController(HomeController);
dino.requestEnd(ResponseMiddleware);
dino.enableUserIdentity();

dino.dependencyResolver<Container>(InversifyContainer,
    (injector, type) => injector.resolve(type));

dino.bind();
app.listen(8088, () => console.log('Server started on port 8088'));
