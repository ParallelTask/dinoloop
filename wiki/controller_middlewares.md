# Controller Middlewares
Controller middlewares are configured at controller-level (which run for every request handled by controller).
### Expresswares at controller-level
These are the express-middlewares run for every request handled by controller. These are original [express middlewares](https://expressjs.com/en/guide/using-middleware.html).
```
@Controller('/home',{
    use: [
        // Native express-wares
        cors(),
        bodyParser(),

        // Have your own express-ware
        // Do not forget to invoke next()
        (req, res, next) => {
            ... add logic
        }
    ]
})
export class HomeController extends ApiController {
    ... add action methods
}
```
* **use:** Provide an array of express-wares.

Following are the list of classes which helps to create controller dinowares:
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
You can even provide custom data to your middlewares. Here is an example to provide custom data:
#### Middleware with metadata
```
import { Middleware } from 'dinoloop';
import { Request, Response, NextFunction } from 'express';

export class LogMiddleware extends Middleware {
    
    invoke(request: Request, response: Response, next: NextFunction, data?: any): void {
        // If user holds admin role
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
### MiddlewareAsync
Asnyc version of Middleware.
```
import { MiddlewareAsync } from 'dinoloop';
import { Request, Response, NextFunction } from 'express';

export class LogMiddlewareAsync extends MiddlewareAsync {
    
    async invoke(request: Request, response: Response, next: NextFunction): Promise<void> {
        await ...operation; 
        next();
    }
}
```
### ActionFilter
Action filters have two abstract methods to implement `beforeExecution()` and `afterExecution()`.
#### beforeExecution(request: Request, response: Response, next: NextFunction, data?: any)
This method executes just before executing the action-method. `data` is the placeholder for custom data.
#### afterExecution(request: Request, response: Response, next: NextFunction, data?: any)
This method executes right after executing the action-method. `data` is the placeholder for custom data.

This example shows how to create action-filters. 
```
import { ActionFilter } from 'dinoloop';
import { Request, Response, NextFunction } from 'express';

export class LogFilter extends ActionFilter {
    
    beforeExecution(request: Request, response: Response, next: NextFunction): void {
        ... log request headers
        // proceed to action-method
        next();
    }

    afterExecution(request: Request, response: Response, next: NextFunction, result: any): void {
        ... log(result)
        // proceed to next middleware
        next();
    }
}

@Controller('/home',{
    filters: [LogFilter]
})
... add controller and action-methods
```
* As explained [Middleware with metadata](https://github.com/ParallelTask/dinoloop/blob/master/wiki/controller_middlewares.md#middleware-with-metadata), custom `data` can be provided to action filters also.
* `result` is the placeholder for return-value of action methods.
### ActionFilterAsync
Asnyc version of ActionFilterAsync.

```
import { ActionFilterAsync } from 'dinoloop';
import { Request, Response, NextFunction } from 'express';

export class LogFilterAsync extends ActionFilterAsync {
    async beforeExecution(request: Request, response: Response, next: NextFunction, data?: any): Promise<void> {
        ... log request headers
        // proceed to action-method
        next();
    }

    async afterExecution(request: Request, response: Response, next: NextFunction, result: any, data?:any): Promise<void> {
        ... log(result)
        // proceed to next middleware
        next();
    }
}

@Controller('/home',{
    filters: [{ 
        useClass: LogFilterAsync,
        data: { role: 'admin' }
    }]
})
... add controller and action-methods
```
### ResultFilter
This example shows how to create result-filter which handles return value of action-method.
```
import { ResultFilter } from 'dinoloop';
import { Request, Response, NextFunction } from 'express';

export class XmlResultFilter extends ResultFilter  {

    invoke(request: Request, response: Response, next: NextFunction, result: any): void {
        // return Xml response instead of Json
        // inject this into controllers that needs XML response.
        response.send(xml(result));
    }
}

@Controller('/home', {
    result: [XmlResultFilter]
})
export class HomeController extends ApiController {
    ... add action methods
}
```
### ResultFilterAsync
Asnyc version of ResultFilterAsync.
```
import { ResultFilterAsync } from 'dinoloop';
import { Request, Response, NextFunction } from 'express';

export class XmlFilterAsync extends ResultFilterAsync  {

    async invoke(request: Request, response: Response, next: NextFunction, result: any, data?: any): Promise<void> {
        await ...;
        response.send(xml(result));
    }
}

@Controller('/home', {
    result: [{
        useClass: XmlFilterAsync,
        data: {}
    }]
})
export class HomeController extends ApiController {
    ... add action methods
}
```
### ExceptionFilter
This example shows how to create exception-filters that handles uncaught exceptions thrown by controller. If any of the action-method throws exception, it would first pass on to exception-filters registered at controller.
```
import { ExceptionFilter } from 'dinoloop';
import { Request, Response, NextFunction } from 'express';

export class InvalidOrderExceptionFilter extends ExceptionFilter {
    
    invoke(err: Error, request: Request, response: Response, next: NextFunction): void {
        
        if(err instanceof InvalidOrderExceptionFilter) {
            ... perform some operation
            this.response.json('InvalidRequest');
        } else {
            // pass on to next error middleware
            next(err);
        }
    }
}

@Controller('/orders',{
    exceptions: [InvalidOrderExceptionFilter]
})
```
* `err` is the palceholder for original Error that occured.
* Please read [express docs](https://expressjs.com/en/guide/error-handling.html) for robust error handling.
* Unlike other middlewares at controller-level, `ExceptionFilter` do not have support for custom data.
### ExceptionFilterAsync
Asnyc version of ExceptionFilter.

```
import { ExceptionFilterAsync } from 'dinoloop';
import { Request, Response, NextFunction } from 'express';

export class InvalidOrderExceptionFilterAsync extends ExceptionFilterAsync {
    
    async invoke(err: Error, request: Request, response: Response, next: NextFunction): Promise<void> {
        
        if(err instanceof InvalidOrderExceptionFilter) {
            ... perform some operation
            this.response.json('InvalidRequest');
        } else {
            // pass on to next error middleware
            next(err);
        }
    }
}
```
## Notes
* It is recommended to have Async in name for asynchronous middlewares to recognize easily.
* You have to invoke *next()* to pass on to next middlewares in chain.
