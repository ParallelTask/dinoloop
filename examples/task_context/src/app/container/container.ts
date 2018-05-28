import { Container, decorate, injectable } from 'inversify';
import {
    ApiController,
    ErrorController,
    RequestStartMiddleware,
    RequestStartMiddlewareAsync,
    RequestEndMiddleware,
    RequestEndMiddlewareAsync,
    Middleware,
    MiddlewareAsync,
    ActionFilter,
    ActionFilterAsync,
    ErrorMiddleware,
    ErrorMiddlewareAsync,
    ResultFilter,
    ResultFilterAsync,
    ExceptionFilter,
    ExceptionFilterAsync,
    IUserIdentity,
    UserIdentity
} from '../../../../index';
import { HomeController } from '../controllers/home.controller';
import { IOrderService, OrderService } from '../services/order.service';
import { IRoleService, RoleService } from '../services/role.service';
import {
    TokenStartMiddleware,
    LogMiddleware,
    ResponseMiddleware,
    RequestFilter,
    JsonFilter
} from '../services/middleware';

// builtin abstract classes which are to be extended, must go through decorate()
// else inversify wont work because inversify expects the inherited members to have @injectable()
decorate(injectable(), ApiController);
decorate(injectable(), ErrorController);
decorate(injectable(), RequestStartMiddleware);
decorate(injectable(), RequestStartMiddlewareAsync);
decorate(injectable(), RequestEndMiddleware);
decorate(injectable(), RequestEndMiddlewareAsync);
decorate(injectable(), Middleware);
decorate(injectable(), MiddlewareAsync);
decorate(injectable(), ActionFilter);
decorate(injectable(), ActionFilterAsync);
decorate(injectable(), ErrorMiddleware);
decorate(injectable(), ErrorMiddlewareAsync);
decorate(injectable(), ResultFilter);
decorate(injectable(), ResultFilterAsync);
decorate(injectable(), ExceptionFilter);
decorate(injectable(), ExceptionFilterAsync);
decorate(injectable(), IUserIdentity);
decorate(injectable(), UserIdentity);

let container = new Container();
container.bind(IUserIdentity).to(UserIdentity);
container.bind(IOrderService).to(OrderService);
container.bind(IRoleService).to(RoleService);
container.bind(HomeController).toSelf();
container.bind(TokenStartMiddleware).toSelf();
container.bind(LogMiddleware).toSelf();
container.bind(RequestFilter).toSelf();
container.bind(JsonFilter).toSelf();
container.bind(ResponseMiddleware).toSelf();

export { container as InversifyContainer };
