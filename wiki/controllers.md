# Controllers
## ApiController
Every controller must extend this class. Properties defined on ApiController.
##### request: Express.Request
Native express request object is mapped to this property.
##### response: Express.Response
Native express response object is mapped to this property.

`Note: ` The express request and response properties depends purely on the expressjs version you have installed.
##### next: Express.NextFunction
Native express next handler is mapped to this property.
##### dino: DinoResponse
dino property has two methods `throw() and proceed()` explained in the bottom section.

`proceed(result: any)`  
* Received response after async operation, instead of sending data via express-response object, you would like to have your result available to the next middlewares in the chain, say your result filters. Here is how you can do it,
```
    @Controller('/home', {
        result: JsonResult
    })
    export class HomeController extends ApiController {
        
        @HttpGet('/get')
        get(): void {
            // proceed passes on result to the next middleware i.e. JsonResult
            setTimeout(() => this.dino.proceed('response sent after 2 seconds!'), 2000);
        }
        
        @HttpGet('/noproceed')
        noproceed(): void {
            // ends response, would not pass on the result to next middleware
            setTimeout(() => this.response.json('response sent after 2 seconds!'), 2000);
        }
    }
```
`throw(err: Error)`
* Gives ability to pass on error to next error middlewares when error is encountered in async operation. Following example explains mongo connection error.
```
    @Controller('/home', {
        result: JsonResult
    })
    export class HomeController extends ApiController {
        
        @HttpGet('/get')
        get(): void {
            MongoClient.connect("mongodb://localhost:27017/mydb", (err, db) =>  {
                if (err) this.dino.throw(err);
                db.close();
            });
        }
    }
```
## Controller
Dinoloop treats a class as controller when it extends [ApiController](https://github.com/ParallelTask/dinoloop/blob/wiki-folder/wiki/controllers.md#apicontroller) and [@Controller](https://github.com/ParallelTask/dinoloop/blob/wiki-folder/wiki/attributes.md#controllerprefix-string-attr-icontrollerattributed) attached to it.
```
    @Controller('/home')
    export class HomeController extends ApiController {
        @HttpGet('/get');
        get(): string {
            return 'Hello World!';
        }
    }
```
#### Inheritance (base-child controllers)
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
            return 'Home Page!';
        }
    }
    
    @Controller('/about')
    export class AboutController extends AuthorizeController {
        @HttpGet('/get')
        get(): string {
            return 'About Page';
        }
    }
    
    // This controller would not go through authorization
    @Controller('/contact')
    export class ContactController extends ApiController {
        @HttpGet('/get')
        get(): string {
            return 'Contact Page';
        }
    }
```
`Note:` Make sure to have empty route on base controller `@Controller('')`, If you have a route-url then the route is prefixed to all child controllers as well as `/base/child/get/`.
## ErrorController
Extend this class to handle application errors. Unlike controllers (where you register multiple controllers), you can register only one instance of ErrorController. Properties defined on ErrorController.
##### request: Express.Request
Native express request object is mapped to this property.
##### response: Express.Response
Native express response object is mapped to this property.
##### next: Express.NextFunction
Native express next handler is mapped to this property.
##### error: Error
Placeholder of unhandled error thrown by application.
##### write()
Gets executed when any unhandled error thrown by application.
```
export class ApplicationError extends ErrorController {

    write(): void {
        logToDatabase(this.error);
        
        // Need to crash container
        if(this.error instanceof SystemFaultedException) {
            next(this.error);
        } else {
            this.response.status(500).send('Internal server error occured');
        }
    }
}
```
