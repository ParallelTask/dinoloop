# Application Structure
Clone the [dinoloop-starter](https://github.com/ParallelTask/dinoloop-starter) and install the dependencies. Here are few steps: 
```
git clone https://github.com/ParallelTask/dinoloop-starter.git
cd dinoloop-starter
npm install
```

## Files

Open project in your favorite editor (Recommended [VSCode](https://code.visualstudio.com/)). You will find bare minimum files in order to work with Dinoloop.

### app.ts

```
import express = require('express');
import bodyParser = require('body-parser');
import { Dino } from 'dinoloop';
import { HomeController } from './controllers/home.controller';

/**** basic express-setup ****/
const app = express();
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
