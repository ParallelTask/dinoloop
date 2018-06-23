# Type-hint for Express types
Dinoloop philosophy is not to tie user to specific express version. With such philosophy there comes some caveats. The *Request, Response, NextFunction* are express types, to have type-hint on express objects in development, you are supposed to override `node_modules/dinoloop/modules/types/express.d.ts` contents after you install `@types/express`.

First install express types
```
npm install @types/express --save-dev
```
Now paste following content inside `node_modules/dinoloop/modules/types/express.d.ts`
```
import { Request, Response, NextFunction, Express, Router } from '../../../@types/express';
export declare type Express = Express;
export declare type Router = Router;
export declare type Request = Request;
export declare type Response = Response;
export declare type NextFunction = NextFunction;
```
You will now be able to have type-hint on express objects. You will have to provide the path for express types where it is installed.
