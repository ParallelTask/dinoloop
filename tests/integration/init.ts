import {
    Dino,
    express
} from './index';
// tslint:disable-next-line:no-require-imports no-implicit-dependencies
import bodyParser = require('body-parser');
// tslint:disable-next-line:no-implicit-dependencies
import { Express } from 'express';

export interface InitTest {
    app: Express,
    dino: Dino
}

export function initializeTests(): InitTest {

    const app = express();
    const dino = new Dino(app, '/api');
    app.use(bodyParser.json());
    dino.useRouter(() => express.Router());

    return {
        app: app,
        dino: dino
    };
}
