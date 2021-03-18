[![build status](https://api.travis-ci.org/ParallelTask/dinoloop.svg?branch=master)](https://travis-ci.org/ParallelTask/dinoloop/)
[![npm version](https://img.shields.io/npm/v/dinoloop.svg)](https://www.npmjs.com/package/dinoloop)
[![downloads](https://img.shields.io/npm/dm/dinoloop.svg)](https://www.npmjs.com/package/dinoloop)
[![Known Vulnerabilities](https://snyk.io/test/github/ParallelTask/dinoloop/badge.svg)](https://snyk.io/test/github/ParallelTask/dinoloop)

### Important
Please direct the issues and feature requests to [Github](https://github.com/ParallelTask/dinoloop/issues).

### Projects built using dinoloop
* [dinache](https://github.com/dinoloop/dinache)

# Dinoloop
Dinoloop is a REST API library for building scalable Node.js server-side applications powered by TypeScript. Dinoloop uses [Expressjs](https://expressjs.com/) and has been designed with a simple motto - to reuse similar design patterns of C#/JAVA (OOP practices, SOLID principles and MVC architecture) in Node.js. Dinoloop adds syntactic sugar to Expressjs empowering OOP programmers to easily switch to Node.js without the steep learning curve. 

## Why Dinoloop?
In the same way express.js does not abstract you from Node.js, Dinoloop does not abstract you from express.js (you have complete access to Node.js and express.js). You are free to use/mix the Node.js and express.js API in your development. Dinoloop is a library more than a framework. You can develop an entire application in Dinoloop, part of an application, or gradually migrate an existing express.js application to Dinoloop. The first principle of Dinoloop is to provide an architecture to developers and not to create a complete bundled framework.

## Prerequisites
* Node 8.10.x or higher 
* Express 4.3.x or higher
* Typescript 2.2.x or higher

## Install
```
npm install dinoloop
```

## Quickstart
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

## Principles
Dinoloop has been designed from the start to support gradual adoption so you can use as little or as much you need. Perhaps you only want to develop some REST APIs using Dinoloop and others with Expressjs. In this section, we show how to create a Dinoloop REST API with an existing or newly created Express app.

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
Dinoloop is mounted on `/api` and all of its controller routes/endpoints which are registered with dinoloop are also mounted on `/api`. Dinoloop will handle those requests which are mounted on `/api` i.e. `/api/home/get`, the other end points `/home` and `/about` which are created by expressjs are not handled by dinoloop, this way you can slowly migrate your existing express app to dinoloop or you can start writing your new REST APIs using dinoloop in combination with expressjs. 

## Features
* Super easy set-up. The Dinoloop team provides a recommended starter project so you can start building right away. We want our developers to have the freedom to choose DI or not. You can develop APIs without using DI framework.

    * Without DI framework [dinoloop-starter-without-DI](https://github.com/ParallelTask/dinoloop-starter)
    * With DI framework [dinoloop-starter-with-DI](https://github.com/ParallelTask/dinoloop-inversify-starter)
* Supports Expressjs middlewares with a completely Expressjs driven library.
* Heavily influenced by MVC pattern.
* Configurable Dependency injection framework. Choose your favorite DI framework [InversifyJs](http://inversify.io/) and [more](https://www.npmjs.com/search?q=DI) or build one of your own.
* Proper isolation of controllers and services for better unit-testing. 
* Controller middlewares - ActionFilters, ExceptionFilters, ResultFilters with Robust sync/async (handles async/await pattern)
* Application middlewares - AppStart, RequestStart, RequestEnd and ServerError with Robust sync/async (handles async/await pattern).  
* UserIdentity principal across requests. Still an experimental feature. 

## Documentation
* Visit the [docs](https://unpkg.com/dinoloop-docs@0.0.6/index.html)

## Philosophy 
Dinoloop lets users freely upgrade/downgrade Expressjs. Installing Dinoloop won't install Expressjs. You can install your own version of 
Express. All you have to provide is the Express app and router instances to Dinoloop.

#### Why Expressjs is not bundled as dependency? 
Dinoloop is an Expressjs library with the core principles centered around being a light-weight and pluggable architecture. We use the same principles of libraries to work with targeted versions. Here is a page that describes [version compatibility](http://dinoloop.com/#/docs/versions).

## Motivation
Typescript (*Javascript now*) supports object oriented programming, these features are great with SOLID design principles. Dinoloop has simple motto, to apply SOLID principles and reuse similar coding skills of Java and C# in Nodejs.

## Contribute
Want to file a bug, contribute some code, or improve documentation? Excellent! Read up on our [CONTRIBUTING.md](https://github.com/ParallelTask/dinoloop/blob/master/CONTRIBUTING.md)
