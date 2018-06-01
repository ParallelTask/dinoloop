# Controller Middlewares
Controller middlewares are configured at controller-level (which run for every request handled by controller).

Following are the list of classes which helps to create controller dinowares:
### Native express-wares
These are the express-middlewares run for every request at controller-level. These are part of [express middlewares](https://expressjs.com/en/guide/using-middleware.html).
```
    @Controller('/home',{
        use: [
            // These are some native express-wares
            cors(),
            bodyParser(),

            // Have your own express-ware
            // Do not forget to invoke next()
            (req, res, next) => {
                ... add logic
            }
        ]
    })
```
* Provide an array of express-wares.
### Middleware
This example shows how to create Middleware. `invoke()` is executed everytime the controller receives a request.
```
import { Middleware } from 'dinoloop';
import { Request, Response, NextFunction } from 'express';

export class LogMiddleware extends Middleware {
    invoke(request: Request, response: Response, next: NextFunction): void {
        ... add logic 
        // pass on to next middleware
        next();
    }
}

@Controller('/home', {
    middlewares: [LogMiddleware]
})
export class HomeController extends ApiController {
    ... add action methods
}
```
You can even provide custom data to your middlewares. Here is an example to provide custom data to your middlewares:
#### Middleware with metadata
```
import { Middleware } from 'dinoloop';
import { Request, Response, NextFunction } from 'express';

export class LogMiddleware extends Middleware {
    invoke(request: Request, response: Response, next: NextFunction, data?: any): void {
        // if user holds admin role
        if(data.role === request.locals.role){
            next();
        } else {
            next(new InvalidRoleException());
        }
    }
}

@Controller('/home', {  
    middlewares: [{
        useClass: LogMiddleware,
        data: { role: 'admin' }
    }]
})
export class HomeController extends ApiController {
    ... add action methods
}
```
* `data` is placeholder for custom data provided to middleware.
### RequestStartMiddlewareAsync
Asnyc version of RequestStart middleware.

```
import { RequestStartMiddlewareAsync } from 'dinoloop';
import { Request, Response, NextFunction } from 'express';

export class RequestLogMiddlewareAsync extends RequestStartMiddlewareAsync {
    async invoke(request: Request, response: Response, next: NextFunction): Promise<void> {
        await ...operation; validate headers
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
        await ...operation; validate headers
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
* `err` is the palceholder for original Error that occured.
* Please read [express docs](https://expressjs.com/en/guide/error-handling.html) for robust error handling.
### ErrorMiddlewareAsync
Asnyc version of Error middleware.

```
import { ErrorMiddlewareAsync } from 'dinoloop';
import { Request, Response, NextFunction } from 'express';

export class InvalidHeaderMiddlewareAsync extends ErrorMiddlewareAsync {
    async invoke(err: Error, request: Request, response: Response, next: NextFunction): Promise<void> {
        await ...operation; validate headers
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

* You can register multiple *RequestStartMiddlewares*, *RequestEndMiddlewares* and *ErrorMiddlewares*. Their order of execution depends on the order of registration. 
* `ResponseEndMiddleware` is a built-in RequestEndMiddleware, which ends every API response with Json content-type default. To override this, have your own response by creating [RequestEndMiddleware](https://github.com/ParallelTask/dinoloop/blob/wiki-folder/wiki/application_middlewares.md#requestendmiddleware).
