import { Container, decorate, injectable } from 'inversify';
import {
    ApiController,
    ErrorController,
    RequestStartMiddleWare,
    RequestStartMiddleWareAsync,
    RequestEndMiddleWare,
    RequestEndMiddleWareAsync,
    Middleware,
    MiddlewareAsync,
    ActionFilter,
    ActionFilterAsync,
    ErrorMiddleware,
    ErrorMiddlewareAsync,
    ResultFilter,
    ResultFilterAsync
} from '../../../../index';
import { HomeController } from '../controllers/home.controller';
import { ApplicationError } from '../controllers/application.error';
import { IAboutService, AboutService } from '../services/about.service';
import { StartMiddleware, ResponseMiddleware } from '../services/middleware';

// builtin abstract classes which are to be extended, must go through decorate()
// else inversify wont work because inversify expects the inherited members to have @injectable()
decorate(injectable(), ApiController);
decorate(injectable(), ErrorController);
decorate(injectable(), RequestStartMiddleWare);
decorate(injectable(), RequestStartMiddleWareAsync);
decorate(injectable(), RequestEndMiddleWare);
decorate(injectable(), RequestEndMiddleWareAsync);
decorate(injectable(), Middleware);
decorate(injectable(), MiddlewareAsync);
decorate(injectable(), ActionFilter);
decorate(injectable(), ActionFilterAsync);
decorate(injectable(), ErrorMiddleware);
decorate(injectable(), ErrorMiddlewareAsync);
decorate(injectable(), ResultFilter);
decorate(injectable(), ResultFilterAsync);

let container = new Container();
container.bind(IAboutService).to(AboutService);
container.bind(HomeController).toSelf();
container.bind(ApplicationError).toSelf();
container.bind(StartMiddleware).toSelf();
container.bind(ResponseMiddleware).toSelf();

export { container as InversifyContainer };
