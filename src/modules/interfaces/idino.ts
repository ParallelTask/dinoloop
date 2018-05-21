import { IRouterCallBack, IMiddlewareProvider } from '../types/attribute';
import { Express, Request, Response, NextFunction } from '../types/express';
import { ObservableMiddleware } from '../filter/filter';

export interface IDino {
    registerController<T>(controller: Function & { prototype: T }): void;
    registerApplicationError<T>(type: Function & { prototype: T }): void;
    disableRouteNotFoundException(): void;
    enableUserIdentity(): void;
    requestStart<T>(middleware: Function & { prototype: T }): void;
    requestEnd<T>(middleware: Function & { prototype: T }): void;
    serverError<T>(middleware: Function & { prototype: T }): void;
    observableMiddleware<T>(middleware: Function & { prototype: T }): void;
    raiseModelError(): void;
    dependencyInjectionResolver<T>(injector: T,
        cb: (injector: T, type: any) => any): void;
    bind(): void
    useRouter(cb: () => any): void;
}

export interface IAppContainer {
    controllers: Function[];
    baseUri: string;
    startMiddleware: Function[];
    endMiddleware: Function[];
    diContainer: any;
    diResolveCallback: any;
    errorController: Function;
    errorMiddleware: Function[];
    routeNotFoundMiddleware: Function;
    observableMiddlewares: Function[];
    raiseModelError: boolean;
    enableTaskContext: boolean;
    useRouter: IRouterCallBack;
    build(): void;
}

export interface IDIContainer {
    resolve<T>(type: any): T;
}

export interface IDinoContainer {
    builtInRequestStartMiddleWare(middleware: any): void;
    routeNotFoundMiddleware(middleware: any): void;
    requestStartMiddleWare(middleware: Function): void;
    requestEndMiddleWare(middleware: Function): void;
    registerErrorMiddleWare(middleware: Function): void;
    registerErrorController(type: Function): void;
    registerObservables(type: Function): void;
    registerController(type: Function): void;
}

export interface IRouteTable {
    add(route: string, httpVerb: string): void;
    getRoutes(): string[];
}

export interface IDinoController {
    patch(req: Request, res: Response, next: NextFunction): void;
    invoke(actionName: string, httpVerb: string, requestUrl: string): void;
    invokeAsync(actionName: string, httpVerb: string, requestUrl: string): Promise<void>;
}

export interface IDinoErrorController {
    patch(err: Error, req: Request, res: Response, next: NextFunction): void;
    invoke(actionName: string): void
}

export interface IDinoRouter {
    registerMiddlewares(middlewares: IMiddlewareProvider[]): void;
    registerBeginActionFilters(actionFilters: IMiddlewareProvider[]): void;
    registerAfterActionFilters(actionFilters: IMiddlewareProvider[]): void;
    registerResultFilters(resultFilters: IMiddlewareProvider[]): void;
    registerExceptionFilters(app: Express, uri: string | RegExp,
        filters: IMiddlewareProvider[]): void;
}