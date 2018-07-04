[![build status](https://api.travis-ci.org/ParallelTask/dinoloop.svg?branch=master)](https://travis-ci.org/ParallelTask/dinoloop/)
[![npm version](https://img.shields.io/npm/v/dinoloop.svg)](https://www.npmjs.com/package/dinoloop)
[![dependencies](https://img.shields.io/david/paralleltask/dinoloop.svg)](https://david-dm.org/paralleltask/dinoloop)
[![downloads](https://img.shields.io/npm/dt/dinoloop.svg)](https://www.npmjs.com/package/dinoloop)
# Dinoloop
[![join chat](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/dinoloop/Lobby)

Dinoloop is a Nodejs library, completely written in Typescript project designed to build REST APIs. Dinoloop adds syntactic sugar on top of expressjs enabling C#/Java programmers to easily write REST APIs with similar coding skills in node. Dinoloop adds a layer on top of express but the express objects are still carried on to dinoloop. Whatever you might do in express can be done in dinoloop.

### Prerequisites
* node 8.10.x or higher 
* express 4.x.x or higher

### Install
```
npm install dinoloop
```

### Quickstart
Without Dependency Injection framework

```
git clone https://github.com/ParallelTask/dinoloop-starter.git
cd dinoloop-starter
npm install
npm start
```
With Dependency Injection framework

```
git clone https://github.com/ParallelTask/dinoloop-inversify-starter.git
cd dinoloop-inversify-starter
npm install
npm start
```
Navigate to [http:localhost:8088/api/home/get](http:localhost:8088/api/home/get) in browser

## Features
* Super easy set-up.
* Supports express middlewares, completely express compatible.
* Heavily influenced by MVC pattern.
* Dependency injection support.
* Proper isolation of controllers and services.
* Middlewares, ActionFilters, ExceptionFilters, ResultFilters at controller level.
* Robust Sync/Async middlewares to handle es6 async-await pattern.  
* UserIdentity principal across request. 

## Documentation
* Visit the [Wiki](https://github.com/ParallelTask/dinoloop/tree/master/wiki)

## Principles
Dinoloop has been designed from the start for gradual adoption, and you can use as little or as much dinoloop as you need. Perhaps you only want to develop some "REST APIs" using dinoloop and other REST APIs can be developed using [expressjs](https://expressjs.com/). In this section, we will show how to create dinoloop REST API to an existing express app.

#### Step 1: Add HomeController (file: home.controller.ts)

```
import { ApiController, Controller, HttpGet } from 'dinoloop';

@Controller('/home')
export class HomeController extends ApiController {

    @HttpGet('/get')
    get(): string {
        return 'Hello World!';
    }
}
```
#### Step 2: Mount dinoloop and bind to express instance (file: app.ts)

```
const app = express();
app.use(bodyParser.json());

// Dino requires express instance and base-uri to which dino will be mounted
const dino = new Dino(app, '/api');

// Dino requires express router too
dino.useRouter(() => express.Router());

// Register controller
dino.registerController(HomeController);

// Bind dino to express
dino.bind();

// These are your normal express endpoints
app.get('/home', (req, res, next) => {
 res.status(200).json('Hello World!');
});

app.get('/about', (req, res, next) => {
 res.status(200).json('Hello World!');
});

// Start your express app
app.listen(8088, () => console.log('Server started on port 8088'));
```
Dinoloop is mounted on `/api` and all of its controller routes/endpoints which are registered with dinoloop are also mounted on `/api`. Dinoloop will handle those requests which are mounted on `/api` i.e. `/api/home/get`, the other end points `/home` and `/about` which are created by expressjs are not handled by dinoloop, this way you can slowly migrate your existing express app to dinoloop or you can start writing your new REST APIs using dinoloop. 

## Philosophy 
Dinoloop lets user to freely upgrade/downgrade expressjs. Installing dinoloop won't install express. You can install your own version of express. All you have to provide is express app, express router instance to dinoloop.

## Motivation
Typescript (*Javascript now*) supports object oriented programming, these features are great with SOLID design principles. Dinoloop has simple motto, to apply SOLID principles and reuse similar coding skills of Java and C# in Nodejs.

## Contribute
Want to file a bug, contribute some code, or improve documentation? Excellent! Read up on our [CONTRIBUTING.md](https://github.com/ParallelTask/dinoloop/blob/master/CONTRIBUTING.md)

Join the dinoloop general discussion on [Gitter](https://gitter.im/dinoloop/Lobby).

## Contact
 Send your queries/questions on [Gitter](https://gitter.im/dinoloop/Lobby).

 ## Planned Releases
 * Middlewares at action level.
 * @ModelBinder on action level for auto binding model from http-request body.
