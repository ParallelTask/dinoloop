[![npm version](https://img.shields.io/npm/v/dinoloop.svg)](https://www.npmjs.com/package/dinoloop)
[![dependencies](https://img.shields.io/david/paralleltask/dinoloop.svg)](https://david-dm.org/paralleltask/dinoloop)
[![node version](https://img.shields.io/node/v/dinoloop.svg)](https://www.npmjs.com/package/dinoloop)
[![downloads](https://img.shields.io/npm/dm/dinoloop.svg)](https://www.npmjs.com/package/dinoloop)

# Dinoloop
Dinoloop is a REST API library for building scalable Node.js server-side applications powered by TypeScript. Dinoloop uses <a href="https://expressjs.com">Expressjs</a> and has been designed with a simple motto - to reuse similar design patterns of C#/JAVA/OOP minded programmers (OOP practices, SOLID principles and MVC architecture) in Node.js. Dinoloop adds syntactic sugar to Expressjs empowering OOP programmers to easily switch to Node.js without the steep learning curve.

### Prerequisites

* Node 8.10.x or higher 
* Express 4.x.x or higher
* Typescript 2.4.x or higher

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
*  Super easy set-up. The Dinoloop team provides a recommended starter project so you can start building right away. We want our developers to have the freedom to choose DI or not. You can develop APIs without using DI framework.
* Supports Expressjs middlewares with a completely Expressjs driven library.
* Heavily influenced by MVC pattern.
* Configurable Dependency Injection framework. Choose your favorite DI framework <a href="http://inversify.io/">InversifyJs</a> or build one of your own.
* Proper isolation of controllers and services for better unit-testing.
* Controller middlewares - ActionFilters, ExceptionFilters ResultFilters with Robust sync/async (handles es6 async/await pattern).
* Application middlewares - AppStart, RequestStart, RequestEnd and ServerError with Robust sync/async (handles es6 async/await pattern).
* UserIdentity principal across requests. Still an experimental feature.

## Documentation

* Visit the [documentation](https://dinoloop.com)

## Principles

Dinoloop has been designed from the start to support gradual adoption so you can use as little or as much as you need. Perhaps you only want to develop some REST APIs using Dinoloop and others with Expressjs. 

## Motivation
TypeScript (a superset of Javascript) supports object oriented programming (which pairs great with SOLID design principles). Dinoloop has simple motto - to apply SOLID principles and reuse Java and C# design patterns in Node.js. 

## Community
Join the dinoloop general discussion on [Gitter](https://gitter.im/dinoloop/Lobby).

## License
MIT
