// tslint:disable-next-line:no-require-imports
const express = require('express');
// tslint:disable-next-line:no-require-imports
import cors = require('cors');
// tslint:disable-next-line:no-require-imports
import bodyParser = require('body-parser');
import { Dino } from '../../../index';
import { HomeController } from './controllers/home.controller';
import { ServerParseErrorMiddleware } from './middlewares/filters';
import { AboutController } from './controllers/about.controller';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

let dino = new Dino(app, '/api');

dino.useRouter(() => express.Router());
dino.registerController(HomeController);
dino.registerController(AboutController);
dino.serverError(ServerParseErrorMiddleware);
dino.bind();
app.listen(8088, () => console.log('Server started on port 8088'));
