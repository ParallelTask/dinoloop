import { ReflectiveInjector } from 'injection-js';
import { HomeController } from '../controllers/home.controller';
import {
    StartMiddlewareOne,
    StartMiddlewareTwo,
    StartMiddlewareTwoAsync,
    StartMiddlewareOneAsync,
    ResponseMiddleware,
    RouteNotFoundErrorMiddleware,
    ErrorMiddlewareOne,
    ErrorMiddlewareTwo,
    ErrorMiddlewareOneAsync
} from '../middlewares/middleware';
import { IAboutService, AboutService } from '../services/about.service';
import { IDateService, DateService } from '../services/date.service';
import { ServerErrorController } from '../controllers/server.controller';
import {
    RequestMiddleware,
    RequestMiddlewareAsync,
    RequestFilter,
    LogFilterAsync,
    NExceptionFilter,
    NExceptionFilterAsync,
    ResultFilterOneAsync,
    ResultFilterOne
} from '../middlewares/filter';
import { IndexController } from '../controllers/index.controller';
import { ExceptionController } from '../controllers/exception.controller';
import {
    BaseRequestMiddleware,
    BaseRequestMiddlewareAsync,
    BaseRequestFilter,
    BaseRequestFilterAsync,
    BaseExceptionFilter,
    BaseExceptionFilterAsync,
    BaseResultFilterOne,
    BaseResultFilterOneAsync
} from '../middlewares/base';
import { ChildController } from '../controllers/child.controller';
import { ChildExceptionController } from '../controllers/child.exception.controller';

// Define all the services and their implementations to be injected at runtime
// Note that we are using angular di container as a wrapper for dependency injection
const injector = ReflectiveInjector.resolveAndCreate([

    // Register the controllers
    { provide: HomeController, useClass: HomeController },
    { provide: ServerErrorController, useClass: ServerErrorController },
    { provide: IndexController, useClass: IndexController },
    { provide: ExceptionController, useClass: ExceptionController },
    { provide: ChildController, useClass: ChildController },
    { provide: ChildExceptionController, useClass: ChildExceptionController },

    // Register the services
    { provide: IAboutService, useClass: AboutService },
    { provide: IDateService, useClass: DateService },

    // Register the action filters
    { provide: StartMiddlewareOne, useClass: StartMiddlewareOne },
    { provide: StartMiddlewareTwo, useClass: StartMiddlewareTwo },
    { provide: StartMiddlewareOneAsync, useClass: StartMiddlewareOneAsync },
    { provide: StartMiddlewareTwoAsync, useClass: StartMiddlewareTwoAsync },
    { provide: ResponseMiddleware, useClass: ResponseMiddleware },
    { provide: RouteNotFoundErrorMiddleware, useClass: RouteNotFoundErrorMiddleware },
    { provide: ErrorMiddlewareOne, useClass: ErrorMiddlewareOne },
    { provide: ErrorMiddlewareOneAsync, useClass: ErrorMiddlewareOneAsync },
    { provide: ErrorMiddlewareTwo, useClass: ErrorMiddlewareTwo },
    { provide: RequestMiddleware, useClass: RequestMiddleware },
    { provide: RequestMiddlewareAsync, useClass: RequestMiddlewareAsync },
    { provide: RequestFilter, useClass: RequestFilter },
    { provide: LogFilterAsync, useClass: LogFilterAsync },
    { provide: NExceptionFilter, useClass: NExceptionFilter },
    { provide: NExceptionFilterAsync, useClass: NExceptionFilterAsync },
    { provide: ResultFilterOne, useClass: ResultFilterOne },
    { provide: ResultFilterOneAsync, useClass: ResultFilterOneAsync },
    { provide: BaseRequestMiddleware, useClass: BaseRequestMiddleware },
    { provide: BaseRequestMiddlewareAsync, useClass: BaseRequestMiddlewareAsync },
    { provide: BaseRequestFilter, useClass: BaseRequestFilter },
    { provide: BaseRequestFilterAsync, useClass: BaseRequestFilterAsync },
    { provide: BaseExceptionFilter, useClass: BaseExceptionFilter },
    { provide: BaseExceptionFilterAsync, useClass: BaseExceptionFilterAsync },
    { provide: BaseResultFilterOne, useClass: BaseResultFilterOne },
    { provide: BaseResultFilterOneAsync, useClass: BaseResultFilterOneAsync }
]);

export { injector as Container };
