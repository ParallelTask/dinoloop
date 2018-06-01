# Exceptions

## RouteNotFoundException
Dino throws `RouteNotFoundException` when it receives a request that does not match a route. Here is how you can handle it
```
import { ErrorMiddleware, RouteNotFoundException } from 'dinoloop';
import { Request, Response, NextFunction } from 'express';

export class RouteNotFoundErrorMiddleware extends ErrorMiddleware {
    
    invoke(err: Error, request: Request, response: Response, next: NextFunction): void {
        if (err instanceof RouteNotFoundException) {
            response.json({
                errMsg: 'Link has been moved or broken',
                status: false,
                statusCode: 404
            });
        } else next(err);
    }
}

// app.ts: Register with dino
dino.serverError<RouteNotFoundErrorMiddleware>(RouteNotFoundErrorMiddleware);
```
* It is so easy to setup error-middlewares and add custom response.
* It is recommended to register `RouteNotFoundErrorMiddleware` as first server-error middleware.
## CustomException
Programmers from C#/Java have robust support for exception handling. Dino suggests to create a `CustomException` and extend all your exceptions from this class.
```
export abstract class CustomException extends Error {
    innerException: Error;
    type: string;
    constructor(message: string, ex?: Error) {
        super(message);
        this.innerException = ex;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

// Extend CustomException
export class InvalidOrderExceptions extends CustomException {
    constructor(msg: string, ex?: Erro) {
        super(msg, ex);
    }
}

let ex = new InvalidOrderException();
ex instanceof InvalidOrderException; true
```
### Why CustomException?
* One good reason is to hold inner exception where native javascript Error does not.
