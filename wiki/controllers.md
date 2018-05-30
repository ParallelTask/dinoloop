# Controller
Dinoloop treats a class as controller when it extends [ApiController]() and [@Controller](https://github.com/ParallelTask/dinoloop/tree/master/wiki/attributes.md) attached to it.
### `ApiController`
Properties defined on ApiController.
##### `request: Express.Request`
Native express request object is mapped to this property. All the available properties of express request are available. 
##### `response: Express.Response`
Native express response object is mapped to this property.

`Note: ` The express request and response properties depends purely on the expressjs version you have installed.
##### `next: Express.NextFunction`
Native express next handler is mapped to this property.
##### `dino: DinoResponse`
dino property has two methods `throw() and proceed()` which are explained in detail in the bottom section.

`proceed(result: any) ` 
* You have received response after async operation, instead of sending data via express-response object, you would like to have your result available to the next middlewares in the chain, say your result filters.
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
            // ends response, would not pass on the result to next middlewares
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
            MongoClient.connect("mongodb://localhost:27017/mydb", (err, db) => {
                if (err) this.dino.throw(err);
                db.close();
            });
        }
    }
```
