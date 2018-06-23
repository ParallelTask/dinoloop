# ErrorMiddleware vs ErrorController
Dinoloop have support for multiple [ErrorMiddleware](https://github.com/ParallelTask/dinoloop/blob/master/wiki/application_middlewares.md#errormiddleware) and single [ErrorController](https://github.com/ParallelTask/dinoloop/blob/master/wiki/controllers.md#errorcontroller). This guide explains you the why.

### Why Multiple ErrorMiddlewares?
Express.js has robust [error handling](https://expressjs.com/en/guide/using-middleware.html#middleware.error-handling) using error middlewares. Dinoloop wants this great feature in its core. Awesome to have it :).

We do have a problem somehow. How do you figure out *this middleware* is global error handler. You have to walkthrough all the middlewares logic or *filename*.

Here comes the *ErrorController* to solve this problem.

### Why Single ErrorController?
To me/others know exactly where to put application error logic. 
```
import { ErroController } from 'dinoloop';

export class ApplicationErrorController extends ErrorController {
    internalServerError(): void {
        this.response.status(500).send('Internal server error occured');
    }
}
```
*ErrorController* is the last error handler in dinoloop, once the error goes out of its scope, it reaches to express. Now express can decide to crash container or handle it.
