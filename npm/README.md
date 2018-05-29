[![npm version](https://img.shields.io/npm/v/dinoloop.svg)](https://www.npmjs.com/package/dinoloop)
[![dependencies](https://img.shields.io/david/paralleltask/dinoloop.svg)](https://david-dm.org/paralleltask/dinoloop)
[![node version](https://img.shields.io/node/v/dinoloop.svg)](https://www.npmjs.com/package/dinoloop)
[![downloads](https://img.shields.io/npm/dt/dinoloop.svg)](https://www.npmjs.com/package/dinoloop)


# Dinoloop

Dinoloop is a Nodejs framework, completely written in Typescript project designed to build REST APIs. Dinoloop adds syntactic sugar on top of expressjs enabling C#/Java programmers to easily write REST APIs with similar coding skills in node.

Dinoloop adds a layer on top of express but the express objects are still carried on to dinoloop. Whatever you might do in express can be done in dinoloop.

### Prerequisites

* node 8.10.x or higher 
* express 4.x.x or higher

### Install

```
npm install dinoloop
```

### Quickstart

```
git clone https://github.com/ParallelTask/dinoloop-starter.git
cd dinoloop-starter
npm install
npm start
```
Navigate to [http:localhost:8088/api/home/get](http:localhost:8088/api/home/get) in browser


## Features
* Super easy set-up.
* Isolation of controllers and services.
* Dependency injection support.
* Middlewares, ActionFilters, ExceptionFilters, ResultFilters at controller level.
* Robust Sync/Async middlewares to handle async-await pattern.  
* UserIdentity principal across request. 

## Philosophy 

Dinoloop lets user to freely upgrade/downgrade expressjs. <span style="text-decoration:underline">Installing dinoloop won't install express</span>. You can install your own version of express. All you have to provide is express app, express router instance to dinoloop.

## Community
Want to file a bug, contribute some code, or improve documentation? Excellent! Read up on our [CONTRIBUTING.md](https://github.com/ParallelTask/dinoloop/blob/master/CONTRIBUTING.md)

Join the dinoloop general discussion on [Gitter](https://gitter.im/dinoloop/Lobby).

## License
MIT
