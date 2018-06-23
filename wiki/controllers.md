# Controllers
This guide gets you started with Controllers and their properties.
## ApiController
Every controller must extend this class.
### model: DinoModel
Reserved for future use.
### request: Express.Request
Express request object is mapped to this property.
### response: Express.Response
Express response object is mapped to this property.

`Note: ` The request and response properties depends purely on express.js version you have installed.
### next: Express.NextFunction
Express next handler is mapped to this property.
### dino: DinoResponse
dino property has two methods `proceed()` and `throw()` explained in the bottom section.
#### proceed(result: any)  
* Typically used when you receive response after async-callback operation, you would then like to have your result available to the next middlewares in the chain, say your result filters. Here is how you do it:
```
@Controller('/home', {
    result: [JsonResult]
})
export class HomeController extends ApiController {
        
    @HttpGet('/get')
    get(): void {
        // proceed passes on result to next middleware i.e. JsonResult
        setTimeout(() => this.dino.proceed('response sent after 2 seconds!'), 2000);
    }
        
    @HttpGet('/no-proceed')
    noproceed(): void {
        // ends response, would not pass on result to next middleware
        setTimeout(() => this.response.json('response sent after 2 seconds!'), 2000);
    }
}
```
#### throw(err: Error)
* Gives ability to pass on error to next error middlewares when error is encountered in async-callback operation. Following example explains mongo connection error.
```
@Controller('/home', {
    exceptions: [MongoConnectException]
})
export class HomeController extends ApiController {
        
    @HttpGet('/get')
    get(): void {
        MongoClient.connect("mongodb://localhost:27017/mydb", (err, db) => {
            if (err) this.dino.throw(new MongoConnectException());
            db.close();
        });
    }
}
```
## Controller
Dinoloop treats a class as controller when it extends [ApiController](https://github.com/ParallelTask/dinoloop/blob/master/wiki/controllers.md#apicontroller) and [@Controller](https://github.com/ParallelTask/dinoloop/blob/master/wiki/attributes.md#controllerprefix-string-attr-icontrollerattributed) attached to it.
```
@Controller('/home')
export class HomeController extends ApiController {
        
    @HttpGet('/get');
    get(): string {
         return 'Hello World!';
    }
}
```
### Inheritance (base-child controllers)
Controllers can be inherited by other controllers, this allows to have base-child controller relationship where in the properties of base controller are extended/inherited by child controllers.
* You want to have authorization enabled for few controllers, this is how you do it
```
@Controller('', {
    middlewares: [AuthorizeMiddleware]
})
export class AuthorizeController extends ApiController{ }

@Controller('/home')
export class HomeController extends AuthorizeController {
    
    @HttpGet('/get')
    get(): string {
        return 'Home Page';
    }
}
    
@Controller('/about')
export class AboutController extends AuthorizeController {
    
    @HttpGet('/get')
    get(): string {
        return 'About Page';
    }
}
    
// No Authorization
@Controller('/contact')
export class ContactController extends ApiController {
        
    @HttpGet('/get')
    get(): string {
        return 'Contact Page';
    }
}
```
Have an empty route on base controller `@Controller('')`, if you have a route-url `@Controller('/base')` then the base controller route is prefixed to all child controllers, example: `/base/child1/get` and `/base/child2/get`.
## ErrorController
Extend this class to handle application-level errors. Unlike controllers (where you register multiple), you can register only one class extending ErrorController.
### request: Express.Request
Express request object is mapped to this property.
### response: Express.Response
Express response object is mapped to this property.
### next: Express.NextFunction
Express next handler is mapped to this property.
### error: Error
Placeholder of unhandled error thrown by application.
### internalServerError()
Gets executed when any unhandled error thrown by application.
```
export class ApplicationError extends ErrorController {

    internalServerError(): void {
        logToDatabase(this.error);
        
        // Need to crash container ??
        if(this.error instanceof SystemFaultedException) {
            // This error is now gone out of dino's control.
            // If you have err handlers on express they might handle or 
            // simply crash container
            next(this.error);
        } else {
            // If error is not fatal 
            this.response.status(500).send('Internal server error occured');
        }
    }
}
```
* `internalServerError()` is an abstract method on ErrorController which has to be implemented.
