# Attributes
Dinoloop attributes use [reflect-metadata](https://www.npmjs.com/package/reflect-metadata) behind the scenes.
### `@Async()`
When an action method has async modifier (`async-await`), then action method must be decorated with `@Async`.
```
    import { Controller, ApiController, HttpGet } from 'dinoloop';
    
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
### `@Controller(prefix: string, attr: IControllerAttribute)`
Defines a class as controller via `@Controller`.
##### `prefix: string`
Acts as base route for all actions.
##### `attr: IControllerAttribute`
Configures middlewares at controller-level.
* `use:` You can define native express middlewaares (express-wares). These native express middlewares are first to execute, before proceeding to other middlewares in the chain.
* `middlewares:` Provide an array of middlewares which are executed after `express-wares`.
* `filters:` Provide an array of action-filters which are executed after `middlewares`.
* `result:` Provide an array of result-filters which are executed after `action method`.
* `exceptions:` Provide an array of exception-filters which handles uncaught exceptions thrown by controller. 
###### basic controller
```
import { Controller, ApiController, HttpGet } from 'dinoloop';

// Define controller
@Controller('/home')
export class HomeController extends ApiController {
    
    // Define action method
    HttpGet('/get');
    get(): string {
        return 'Hello world!';
    }
}
```
###### using middlewares
```
import cors = require('cors');
import { Controller, ApiController, HttpGet } from 'dinoloop';

@Controller('/orders', {
    use: [
        // enable cors for this controller - native express-ware
        cors(), 
        
        // custom express-ware
        (req, res, next) => { 
            ... you can add own logic
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
        // Send XML response over JSON response
        XMLResult
    ],
    exceptions: [
        // When invalid order is placed
        InvalidOrderException
    ]
})
export class OrdersController extends ApiController {
    HttpGet('/get');
    get(): string {
        return 'Successfully placed your oders. Yay!';
    }
    
    HttpGet('/get/:id');
    getById(id: string): string {
        ....
        throw new InvalidOrderException();
    }
}
```
Middlewares are explained in detail [here]().
### `@HttpAll(route: string)`
Defines an action that responds to every `[HTTP-VERB]` request.
###### without named-segments
```
    @HttpAll('/all')
    all(): string {
        return 'all';
    }
```
###### with named-segments
```
    // GET: /all/6axty
    @HttpAll('/all/:id')
    all(id: string): string {
        return id; // 6axty
    }
    
    // GET: /all/john/images/xyza
    @HttpAll('/all/:user/images/:id')
    all(id: string, user: string): string {
        return id + '_' + user; // xyza_john
    }
```
`Note:` 
* Order of variables is not important, value injection is based on mapping `named-segment` to `func-args`.
* Named-segments are common to other http-verbs like `@HttpGet, @HttpPost ...`.
* Dinoloop uses [url-pattern](https://www.npmjs.com/package/url-pattern) to support named-segments You could have named-segments in routes based on [url-pattern-docs on github](https://github.com/snd/url-pattern)
### `@HttpDelete(route: string)`
Defines an action that responds to `DELETE` request.
```
    @HttpDelete('/delete')
    delete(): string {
        return 'delete';
    }
```
### `@HttpGet(route: string)`
Defines an action that responds to `GET` request.
```
    @HttpGet('/get')
    get(): string {
        return 'get';
    }
```
### `@HttpHead(route: string)`
Defines an action that responds to `HEAD` request.
```
    @HttpHead('/head')
    head(): string {
        return 'head';
    }
```
### `@HttpPost(route: string)`
Defines an action that responds to `POST` request.
```
    // RequestBody injects as first argument
    @HttpPost('/post')
    post(body: any): string {
        return 'post';
    }
    
    // RequestBody with named-segments
    @HttpPost('/post/:id')
    post(body: any, id: string): string {
        return id;
    }
    
    // Invalid: body must be first argument
    @HttpPost('/post/:id')
    post(id: string, body: any): string {
        return id;
    }
```
`Note:` HttpVerbs like `HttpPut, HttpPatch, HttpPost ...` which support request-body injects http-body as first argument into action method.
### `@HttpPatch(route: string)`
Defines an action that responds to `PATCH` request.
```
    @HttpPost('/patch')
    patch(body: any): string {
        return 'patch';
    }
```
### `@HttpPut(route: string)`
Defines an action that responds to `PUT` request.
```
    @HttpPut('/put')
    put(body: any): string {
        return 'put';
    }
```
### `@SendsResponse()`
If you would like to have your action responding to request, then decorate `@SendsResponse()` on action. 
Pretty useful in situations like `file downloads or uploads`. More details on [this.response]() 

`use case:` 
* When your action wants to send response using `expressjs response` object.
```
    @Controller('/home')
    export class HomeController extends ApiController {
    
        @HttpGet('/download')
        download(): void {
            // .download() is the express method
            this.response.download('path/to/file/');
        }
    }
```
* When you are dealing with callback pattern.
```
    @Controller('/home')
    export class HomeController extends ApiController {
    
        @HttpGet('/get')
        get(): void {
            // send response after 2 seconds delay
            // .json() is the express method
            setTimeout(() => this.response.json('response sent after 2 seconds!'), 2000);
        }
    }
```
`Note:` When an action is decorated with `@SendsResponse()`, its return value is ignored. So preferred to have `void` methods.
