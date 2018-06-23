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

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

let dino = new Dino(app, '/api');

dino.useRouter(() => express.Router());
dino.registerController(HomeController);

dino.dependencyResolver<ReflectiveInjector>(Container,
    (injector, type) => {
        let t = injector.get(type);
        if (t instanceof ApiController) {
            return clone(t);
        }

        return t;
    });

dino.bind();
app.listen(8088, () => console.log('Server started on port 8088'));
