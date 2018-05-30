# Dino
##### constructor(app: Express, baseUri: String)
express app instance and baseUri on dino app will be mounted.
```
const dino = new Dino(express(), '/api');
```
##### bind()
Binds dino to express instance. Once you invoke `.bind()` it is done, you are not allowed to invoke `.bind()` twice which results `new Error('dino.bind: Already invoked')`
```
dino.bind();
```
##### dependencyInjectionResolver<T>(injector: T, cb: (injector: T, type: any) => any)
Allows you to configure any dependency injection framework available in typescript. We highly recommend [InversifyJs](https://github.com/inversify/InversifyJS/) which is just fantastic. We already have a [dino-inverisfy-starter]() project adheres to SOLID principles, clone it and start developing your app.
```
import { Container } from 'inversify';

dino.dependencyInjectionResolver<Container>
    (InversifyContainer, (injector, type) => {
        // This is how you resolve objects from inversify container
        return injector.resolve(type);
    });
```
`Warning:` Make sure when you choose DI framework, you do not have singleton instance for controller objects. If you have single instance lifescope for controller objects then you might be entering into serious issues where one user request gets tampered with other users request.

[injection-js](https://github.com/mgechev/injection-js) is one such DI framework which resolves everything as singleton. To have a quick fix, you can shallow clone the controller objects 
```
import { ReflectiveInjector } from 'injection-js';
import * as clone from 'lodash.clone';

dino.dependencyInjectionResolver<ReflectiveInjector>(Container,
    (injector, type) => {
        let i = injector.get(type);
        // clone it, so that you get different reference object
        // you don't need deepclone, lodash.clone works!
        if (i instanceof ApiController) {
            return clone(i);
        }
        return i;
    });
```
##### registerApplicationError<T>(T)
Register controller that extends [ErrorController](https://github.com/ParallelTask/dinoloop/blob/wiki-folder/wiki/controllers.md#errorcontroller).
```
dino.registerApplicationError<ApplicationError>(ApplicationError);
```
If you register multiple error controllers the last one gets registered with dino.
##### registerController<T>(T)
Register controller that extends [ApiController](https://github.com/ParallelTask/dinoloop/blob/wiki-folder/wiki/controllers.md#apicontroller).
```
dino.registerController<HomeController>(HomeController);
```
##### requestStart<T>(T)
Register request-start middlewares. These are the middlewares to handle request first in the chain. More on [RequestStart Middlewares]() 
```
dino.requestStart<LogRequestStart>(LogRequestStart);
dino.requestStart<OtherRequestStart>(OtherRequestStart);
```
##### requestEnd<T>(T)
Register request-end middlewares. These are the middlewares to handle the request last in the chain. More on [RequestEnd Middlewares]() 
```
dino.requestEnd<LogRequestEnd>(LogRequestEnd);
dino.requestEnd<OtherRequestEnd>(OtherRequestEnd);
```
##### serverError<T>(T)
Register server-error middlewares to handle uncaught exceptions/errors thrown by application. When unhandled exception is thrown by application,these are the ones that fire. More on [ServerError Middlewares]() 
```
dino.serverError<FormatExceptionr>(FormatException);
dino.serverError<MongoException>(MongoException);
```
`Note:` Multiple `requestStart, requestEnd and serverError` dinowares can be registered.
Their order of execution depends on the order of registration.
##### useRouter(cb: () => express.Router)
Register callback that returns new instance of `express.Router` on every invoke.
```
dino.useRouter(() => express.Router());
```
Make sure to attach express.Router() to dino via `.useRouter()` otherwise dino would throw `new Error('Express router is not registered with dino')`.
