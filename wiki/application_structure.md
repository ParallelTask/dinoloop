# Application Structure

## Quickstart

```
git clone https://github.com/ParallelTask/dinoloop-starter.git
cd dinoloop-starter
npm install
```

## Files

Open project in editor (Recommended VSCode)

### app.ts

```
import express = require('express');
import bodyParser = require('body-parser');
import { Dino } from 'dinoloop';
import { HomeController } from './controllers/home.controller';

const app = express();

/**** basic express-setup ****/
app.use(bodyParser.json());

// Dino requires express instance
// and base-uri to which dino will be mounted
const dino = new Dino(app, '/api');

// Dino requires express router too
dino.useRouter(() => express.Router());

// Register controller
dino.registerController(HomeController);

// Binds dino to express
dino.bind();

// Start listening
app.listen(8088, () => console.log('Server started on port 8088'));
```

### home.controller.ts

```
import { ApiController, Controller, HttpGet } from 'dinoloop';

// Set baseUri for all action methods
@Controller('/home')
export class HomeController extends ApiController {

    // Responds to HttpGet request
    @HttpGet('/get')
    get(): string {
        return 'Hello World!';
    }
}
```
