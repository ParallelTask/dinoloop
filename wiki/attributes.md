# Attributes
Dinoloop attributes use [reflect-metadata](https://www.npmjs.com/package/reflect-metadata) behind the scenes.
## @Async()
When an action method has async modifier, it must be decorated with `@Async`. This is required to notify dinoloop to setup asynchronous execution model with express. 
```
import { Controller, ApiController, HttpGet, Async } from 'dinoloop';
    
@Controller('/home')
export class HomeController extends ApiController {
                
    // Async methods must be decorated with @Async
    @Async()
    @HttpGet('/get');
    async get(): string {
        return await ...;
    }
}
```
## @Controller(prefix: string, attr: IControllerAttribute)
Defines a class as controller.
#### prefix: string
Acts as base route for all actions.
#### attr: IControllerAttribute
Configures middlewares at controller-level.
* **use:** Provide an array of express middlewares (express-wares). These express middlewares are first to execute, and then proceeds to dinoloop middlewares.
* **middlewares:** Provide an array of dinoloop middlewares which are executed after *express-wares* and proceeds to *filters*.
* **filters:** Provide an array of action-filters which are executed before/after *action-method*.
* **result:** Provide an array of result-filters which captures return values received from *action method* and proceeds to *request-end middlewares*.
* **exceptions:** Provide an array of exception-filters which handles uncaught exceptions thrown by controller. 
#### Without Middlewares
```
import { Controller, ApiController, HttpGet } from 'dinoloop';

@Controller('/home')
export class HomeController extends ApiController {
    
    HttpGet('/get');
    get(): string {
        return 'Hello world!';
    }
}
```
#### With Middlewares
```
import cors = require('cors');
import { Controller, ApiController, HttpGet } from 'dinoloop';

@Controller('/orders', {
    use: [
        // enable cors for this controller - it's an express-ware
        cors(), 
        
        // or have a custom express-ware
        (req, res, next) => { 
            ... add logic
            next(); 
        }
    ],
    middlewares: [
        // Authorization logic
        AuthorizeMiddlewareAsync
    ],
    filters: [
        // Log request and response
        LogActionFilter
    ],
    results: [
        // Send XML response
        XMLResult
    ],
    exceptions: [
        // When invalid order is placed
        InvalidOrderException
    ]
})
export class OrdersController extends ApiController {
    @HttpGet('/get');
    get(): string {
        return 'Successfully placed your oders. Yay!';
    }
    
    @HttpGet('/get/:id');
    getById(id: string): string {
        ....
        throw new InvalidOrderException();
    }
}
```
Dinowares are explained in detail [here](https://github.com/ParallelTask/dinoloop/blob/master/wiki/controller_middlewares.md).
## @HttpAll(route: string)
Defines an action that responds to every `[HTTP-VERB]` request.
```
@HttpAll('/all')
all(): string {
    return 'all';
}
```
#### With Named-Segments
```
@HttpAll('/all/:id')
all(id: string): string {
    return id; // 6a - GET /all/6a
}
    
@HttpAll('/all/:user/images/:id')
all(id: string, user: string): string {
    return id + '_' + user; // xy_john - GET /all/john/images/xy
}
```
* Order of variables is not important. Value injection framework maps `placeholders` to `func-args`.
* Dinoloop also uses [path-to-regexp](https://github.com/pillarjs/path-to-regexp) (*express uses internally*) to implement named-segments. Have placeholders in your route patterns based on [path-to-regexp on github](https://github.com/pillarjs/path-to-regexp)
## @HttpDelete(route: string)
Defines an action that responds to `DELETE` request.
```
@HttpDelete('/delete')
delete(): string {
    return 'delete';
}
```
## @HttpGet(route: string)
Defines an action that responds to `GET` request.
```
@HttpGet('/get')
get(): string {
    return 'get';
}
```
## @HttpHead(route: string)
Defines an action that responds to `HEAD` request.
```
@HttpHead('/head')
head(): string {
    return 'head';
}
```
## @HttpPost(route: string)
Defines an action that responds to `POST` request.
```
// Injects http-body as first argument
@HttpPost('/post')
post(body: any): string {
    return 'post';
}
    
// With named-segments
@HttpPost('/post/:id')
post(body: any, id: string): string {
    return id;
}
    
// Wrong: body must be first argument.
// This would not throw error but http-body is injected to id.
@HttpPost('/post/:id')
post(id: string, body: any): string {
    return id;
}
```
HttpVerbs like `HttpPut, HttpPatch, HttpPost ...` that have request-body, dino injects http-body as first argument into action method.
## @HttpPatch(route: string)
Defines an action that responds to `PATCH` request.
```
@HttpPost('/patch')
patch(body: any): string {
    return 'patch';
}
```
## @HttpPut(route: string)
Defines an action that responds to `PUT` request.
```
@HttpPut('/put')
put(body: any): string {
    return 'put';
}
```

### Having multiple http verbs
You can also have multiple http verbs on the same action.

```
@Controller('/home')
export class HomeController extends ApiController {
    
    // Responds to GET and POST.
    @HttpGet('/name')
    @HttpPost('/name)
    name(): string {
        return 'received';
    }
}
```

## @SendsResponse()
If you would like to have action method responding to request, then decorate `@SendsResponse()`. 
Pretty useful in situations like *file downloads/uploads or more ...*

* When action wants to send response using `response`.
```
@Controller('/home')
export class HomeController extends ApiController {
    
    @SendsResponse()
    @HttpGet('/download')
    download(): void {
        // .download() is the express method
        this.response.download('path/to/file/');
    }
}
```
* When dealing with callback pattern.
```
@Controller('/home')
export class HomeController extends ApiController {
    
    @SendsResponse()
    @HttpGet('/get')
    get(): void {
        // Send response after 2 seconds.
        setTimeout(() => {
            this.response
            .json('response sent after 2 seconds!');
        }, 2000);
    }
}
```
When an action is decorated with `@SendsResponse()`, it's return value is ignored. Preferred to have `void` methods.
