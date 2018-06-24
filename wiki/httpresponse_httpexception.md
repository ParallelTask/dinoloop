# HttpResponseMessage and HttpResponseException
This guide explains you how to create custom *HttpResponseMessage* and *HttpResponseException* and advantages of using them.

## HttpResponseMessage
Dinoloop recommends you to create your version of HttpResponseMessage object to send common response through [RequestEnd](https://github.com/ParallelTask/dinoloop/blob/master/wiki/application_middlewares.md#requestendmiddleware) middleware. Here is how you do it:

```
// http.response.message.ts
import { HttpStatusCode } from 'dinoloop';

export class HttpResponseMessage {
    statusCode: HttpStatusCode;
    content: any;
    // you can also add headers if you want to
}

// home.controller.ts
import { Controller, ApiController, HttpGet, HttpStatusCode } from 'dinoloop';

@Controll er('/home')
export class HomeController extends ApiController {
    
    @HttpGet('/name')
    name(): HttpResponseMessage {
        let response = new HttpResponseMessage();
        response.statusCode = HttpStatusCode.Ok;
        response.content = 'Hello World!';
        return response;
    }

    @HttpGet('/list')
    list(): HttpResponseMessage {
        let response = new HttpResponseMessage()
        response.statusCode = HttpStatusCode.Unauthorized;
        response.content = 'Unauthorized';
        return response;
    }
}

// json.result.ts
import { RequestEndMiddleware } from 'dinoloop';
import { Request, Response, NextFunction } from 'express';

export class JsonResult extends RequestEndMiddleware {
    invoke(request: Request, response: Response, next: NextFunction, result: any): void {

        // you can set statusCode from result object
        if(result instance of HttpResponseMessage){
            response.status(result.statusCode).json(result.content);
        } else{
            // for other result sets, status Ok
            response.status(HttpStatusCode.Ok).json(result);
        }
    }
}
```
Pretty useful where you want to set `HttpStatusCode` in the action method.

## HttpResponseException
Dinoloop recommends you to create your version of HttpResponseException object extending [CustomException](https://github.com/ParallelTask/dinoloop/blob/master/wiki/exceptions.md#customexception) to send common response through [ServerError](https://github.com/ParallelTask/dinoloop/blob/master/wiki/application_middlewares.md#errormiddleware) middleware. Here is how you do it:

```
// http.response.exception.ts
import { HttpStatusCode } from 'dinoloop';

export class HttpResponseException extends CustomException {
    statusCode: HttpStatusCode;
    content: any;
    // you can also add headers if you want to
}

// home.controller.ts
import { Controller, ApiController, HttpGet, HttpStatusCode } from 'dinoloop';

@Controll er('/home')
export class HomeController extends ApiController {
    
    @HttpGet('/name')
    name(): HttpResponseMessage {

        if(true) {
            let httpException = new HttpResponseException();
            httpException.statusCode = HttpStatusCode.BadRequest;
            httpException.content = 'Invalid Request!';
            throw httpException;
        }

        let response = new HttpResponseMessage();
        response.statusCode = HttpStatusCode.Ok;
        response.content = 'Hello World!';
        return response;
    }
}

// http.exception.ts
import { ErrorMiddleware } from 'dinoloop';
import { Request, Response, NextFunction } from 'express';

export class HttpException extends ErrorMiddleware {
    invoke(err: Error, request: Request, response: Response, next: NextFunction): void {

        // you can set statusCode from err object
        if(err instance of HttpResponseException){
            logToDatabase();
            response.status(err.statusCode).json(err.content);
        } else{
            // for other exceptions invoke .next() or end response
            next(err);
        }
    }
}
```
Pretty useful where you want to set `HttpStatusCode` in the action method.
