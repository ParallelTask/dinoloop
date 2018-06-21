import {
    IRouterCallBack,
    IMiddlewareProvider,
    Express,
    Request,
    Response,
    NextFunction
} from '../types';

export interface IDino {
    registerController<T>(controller: Function & { prototype: T }): void;
    registerApplicationError<T>(type: Function & { prototype: T }): void;
    disableRouteNotFoundException(): void;
    enableUserIdentity(): void;
    requestStart<T>(middleware: Function & { prototype: T }): void;
    requestEnd<T>(middleware: Function & { prototype: T }): void;
    serverError<T>(middleware: Function & { prototype: T }): void;
    dependencyResolver<T>(
        injector: T, cb: (injector: T, type: any) => any): void;
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
    raiseModelError: boolean;
    enableTaskContext: boolean;
    useRouter: IRouterCallBack;
    build(): void;
}

export interface IDIContainer {
    resolve<T>(type: any): T;
}

export interface IDinoContainer {
    builtInRequestEndMiddleware(middleware: Function): void;
    builtInErrorMiddleware(middleware: Function): void;
    builtInRequestStartMiddleware(middleware: Function): void;
    routeNotFoundMiddleware(middleware: Function): void;
    requestStartMiddleware(middleware: Function): void;
    requestEndMiddleware(middleware: Function): void;
    registerErrorMiddleware(middleware: Function): void;
    registerErrorController(type: Function): void;
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
    registerExceptionFilters(
        app: Express, uri: string | RegExp, filters: IMiddlewareProvider[]): void;
}
