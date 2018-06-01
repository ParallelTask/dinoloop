# Application Middlewares
Application middlewares are configured at application-level (which run for every request handled by dino).

* Dino supports both synchronous/asynchronous versions of middlewares.

Following are the list of classes which helps to create dinowares at application-level:
### RequestStartMiddleware
This example shows how to create request-start middleware. `invoke()` is executed everytime the dino receives a request. 
```
import { RequestStartMiddleware } from 'dinoloop';
import { Request, Response, NextFunction } from 'express';

export class RequestLogMiddleware extends RequestStartMiddleware {
    invoke(request: Request, response: Response, next: NextFunction): void {
        ... validate headers
        // pass on to next middleware
        next();
        // invalid headers
        if(invalid) next(new Error('InvalidHeadersException');
    }
}
```
* RequestStart middlewares are the first to run when dino receives a request. Please read [Flow of dinowares]().
* You have to extend `RequestStartMiddleware` and implement `invoke()` method.
* Request, Response, NextFunction are the express types, whatever you can do with express might get done with dino.
* You can read *next(err)*  [on express](https://expressjs.com/en/guide/error-handling.html).
* RequestStart middlewares are similar to [express middlewares](https://expressjs.com/en/guide/using-middleware.html) in functioning. However, they provide class-based approach with Dependency Injection support as explained below.
```
import { RequestStartMiddleware } from 'dinoloop';
import { Request, Response, NextFunction } from 'express';

export class RequestLogMiddleware extends RequestStartMiddleware {
    
    constructor(authService: IAuthService) { }

    invoke(request: Request, response: Response, next: NextFunction): void {
        ... validate headers
        authService.validate();
        next();
    }
}

```
### RequestStartMiddlewareAsync
Asnyc version of RequestStart middleware.

```
import { RequestStartMiddlewareAsync } from 'dinoloop';
import { Request, Response, NextFunction } from 'express';

export class RequestLogMiddlewareAsync extends RequestStartMiddlewareAsync {
    async invoke(request: Request, response: Response, next: NextFunction): Promise<void> {
        await ...operation;
        next();
        // invalid headers
        if(invalid) next(new InvalidHeadersException());
    }
}
```
### RequestEndMiddleware
This example shows how to create request-end middleware. 
```
import { RequestEndMiddleware } from 'dinoloop';
import { Request, Response, NextFunction } from 'express';

export class JsonResult extends RequestEndMiddleware {
    invoke(request: Request, response: Response, next: NextFunction, result: any): void {
        // It is super easy to have common response
        response.json({
            status: 200,
            data: result,
            errors: []
        });
    }
}
```
* RequestEnd middlewares are the last to run in the chain of middlewares. Please read [Flow of dinowares]().
* `result` is the palceholder for return-value of action methods.
### RequestEndMiddlewareAsync
Asnyc version of RequestEnd middleware.

```
import { RequestEndMiddlewareAsync } from 'dinoloop';
import { Request, Response, NextFunction } from 'express';

export class JsonResultAsync extends RequestEndMiddlewareAsync {
    async invoke(request: Request, response: Response, next: NextFunction, result: any): Promise<void> {
        await ...operation;
        response.json({
            status: 200,
            data: result,
            errors: []
        });
    }
}
```
### ErrorMiddleware
This example shows how to create error middleware that handles uncaught exceptions thrown by application (dino). 
```
import { ErrorMiddleware } from 'dinoloop';
import { Request, Response, NextFunction } from 'express';

export class InvalidHeaderMiddleware extends ErrorMiddleware {
    invoke(err: Error, request: Request, response: Response, next: NextFunction): void {
        // handle it
        if(err instanceof InvalidHeaderException) {
            logToQueue(err);
            this.response.json('InvalidRequest');
        } else {
            // pass on to next error middleware
            next(err);
        }
    }
}
```
* `err` is the placeholder for original Error that occured.
* Please read [express docs](https://expressjs.com/en/guide/error-handling.html) for robust error handling.
### ErrorMiddlewareAsync
Asnyc version of Error middleware.

```
import { ErrorMiddlewareAsync } from 'dinoloop';
import { Request, Response, NextFunction } from 'express';

export class InvalidHeaderMiddlewareAsync extends ErrorMiddlewareAsync {
    async invoke(err: Error, request: Request, response: Response, next: NextFunction): Promise<void> {
        await ...operation;
        // handle it
        if(err instanceof InvalidHeaderException) {
            logToQueue(err);
            this.response.json('InvalidRequest');
        } else {
            // pass on to next error middleware
            next(err);
        }
    }
}
```
## Notes
* This is how you register RequestStartMiddleware and RequestStartMiddlewareAsync
```
dino.requestStart(RequestLogMiddleware);
dino.requestStart(RequestLogMiddlewareAsync);
``` 
* This is how you register RequestEndMiddleware and RequestEndMiddlewareAsync
```
dino.requestEnd(JsonResult);
dino.requestEnd(JsonResultAsync);
``` 
* This is how you register ErrorMiddleware and ErrorMiddlewareAsync
```
dino.serverError(InvalidHeaderMiddleware);
dino.serverError(InvalidHeaderMiddlewareAsync);
``` 
* It is recommended to have Async in name for asynchronous middlewares to recognize easily.

* You can register multiple *RequestStartMiddlewares*, *RequestEndMiddlewares* and *ErrorMiddlewares*, order of execution depends on the order of registration. 
* `ResponseEndMiddleware` is a built-in RequestEndMiddleware, which ends every API response with Json content-type default. To override this, have your own response middleware by creating [RequestEndMiddleware](https://github.com/ParallelTask/dinoloop/blob/wiki-folder/wiki/application_middlewares.md#requestendmiddleware).
