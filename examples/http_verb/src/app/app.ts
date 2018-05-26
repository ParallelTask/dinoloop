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

// Basic setup for express to work
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Dino requires express app instance
// and the path on which dino app to be mounted
let dino = new Dino(app, '/api');

// Use express router
dino.useRouter(() => express.Router());
dino.registerController(HomeController);

// Set the angular di framework as Dependency injection resolver.
// the first argument is DI container instance where we register all our services.
// typically the DI container instance is specific to DI framework.
// the second argument is the callback to resolve service/controller from DI container
// The callback logic i.e resolving instance would be specific to DI framework
// Here, we have used angular DI framework, we could also use inversify-js
dino.dependencyInjectionResolver<ReflectiveInjector>(Container,
    (injector, type) => {
        let t = injector.get(type);
        if (t instanceof ApiController) {
            return clone(t);
        }

        return t;
    });

// Before starting express, make sure to bind the dino
dino.bind();

app.listen(8088, () => console.log('Server started on port 8088'));
