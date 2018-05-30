# Installation and Setup

## Prerequisites

* node 8.10.x or higher 
* express 4.x.x or higher

## Install

```
npm install dinoloop --save
```

## Quickstart

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
            "es2017",
            "es2015"
        ]
    }
}
```
