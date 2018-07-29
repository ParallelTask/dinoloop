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
const port = process.env.PORT || 8088;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

let dino = new Dino(app, '/api');

dino.useRouter(() => express.Router());
dino.requestStart(StartMiddleware);
dino.requestEnd(ResponseMiddleware);
dino.registerController(HomeController);

dino.dependencyResolver<Container>(InversifyContainer,
    (injector, type) => {
        return injector.resolve(type);
    });

dino.bind();
app.listen(port, () => console.log(`Server started on port ${port}`));
