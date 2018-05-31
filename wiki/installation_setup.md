# Installation and Setup

This guide gets you started with Dinoloop. By the end of this guide, you will have a working web server.

## Prerequisites
Dinoloop is built on top of [ES2017 async functions](https://blog.risingstack.com/mastering-async-await-in-nodejs/), please make sure Node.js installed that support [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) and [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). Dinoloop uses [express.Router](https://expressjs.com/en/guide/routing.html) extensively for API routing, install Express version that support express.Router.

* Node 8.10.x or higher 
* Express 4.x.x or higher

## Install

```
npm install dinoloop --save
```

## Quickstart
Setting up dinoloop project is quick and easy. Here are few steps:

```
git clone https://github.com/ParallelTask/dinoloop-starter.git
cd dinoloop-starter
npm install
npm start
```
Navigate to [http:localhost:8088/api/home/get](http:localhost:8088/api/home/get) in browser

## Typescript Configuration
Dinoloop requires the compilation options in your tsconfig.json file.

```
{
    "compilerOptions": {
        "target": "es5",
        "module": "commonjs",
        "moduleResolution": "node",
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        "lib": [
            "es2017"
        ]
    }
}
```
