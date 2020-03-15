
import { DIContainer } from './dicontainer';
import { DinoController } from './dino.controller';
import { DinoErrorController } from './dino.error.controller';
import { DinoRouter, RouteTable } from '../router';
import {
    ApiController,
    ControllerAction,
    ErrorController
} from '../controller';
import { Reflector } from '../lib';
import {
    ObjectUtility,
    DataUtility,
    DinoUtility
} from '../utility';
import {
    IDinoContainer,
    IDIContainer,
    IRouteTable
} from '../interfaces';
import {
    IRouterCallBack,
    IControllerAttributeProvider,
    IControllerAttributeExtended,
    IActionMethodAttribute,
    IDinoContainerConfig,
    IDinoProperties,
    Express,
    Response,
    IParseAttribute
} from '../types';
import {
    Attribute,
    RouteAttribute,
    Constants
} from '../constants';
import { IUserIdentity } from '../providers';
import {
    RequestStartMiddleware,
    RequestStartMiddlewareAsync,
    RequestEndMiddleware,
    RequestEndMiddlewareAsync,
    ErrorMiddleware,
    ErrorMiddlewareAsync,
    AppStartMiddleware
} from '../filter';

export class DinoContainer implements IDinoContainer {
    private diContainer: IDIContainer;
    private app: Express;
    private baseUri: string;
    private routeTable: IRouteTable;
    private enableTaskContext: boolean;
    private useRouterCb: IRouterCallBack;

    constructor (config: IDinoContainerConfig) {
        this.app = config.app;
        this.baseUri = config.baseUri;
        this.enableTaskContext = config.enableTaskContext;
        this.useRouterCb = config.routerCallback;
        this.diContainer = DIContainer.create(config.diContainer, config.diResolveCb);
        this.routeTable = RouteTable.create();
    }

    // made public for unit test and not available on interface contract
    resolve<T>(middleware: Function, dino: IDinoProperties): T {
        let o = this.diContainer.resolve<T>(middleware);

        if (DataUtility.isUndefinedOrNull(dino)) {
            return o;
        }

        // walk-through the entire object chain and replace IUserIdentity instance References
        return this.enableTaskContext ?
            ObjectUtility.replaceObjectReferences(o, dino.context, IUserIdentity) : o;
    }

    routeNotFoundMiddleware(middleware: any): void {
        if (DinoUtility.isSyncRequestStartMiddleware(middleware)) {
            // created as singleton object
            let mw = new middleware(this.routeTable);
            this.app.use(this.baseUri, (req, res, next) => {
                mw.invoke(req, res, next);
            });
        }
    }

    // create builtin middlewares as singleton objects
    // ex: DinoStartMiddleware, TaskContextMiddleware
    builtInRequestStartMiddleware(middleware: any): void {
        if (DinoUtility.isSyncRequestStartMiddleware(middleware)) {
            let mw = new middleware();
            this.app.use(this.baseUri, (req, res, next) => {
                mw.invoke(req, res, next);
            });
        }
    }

    // ex: ResponseEndMiddleware
    builtInRequestEndMiddleware(middleware: any): void {
        if (DinoUtility.isSyncRequestEndMiddleware(middleware)) {
            let mw = new middleware();
            this.app.use(this.baseUri, (req, res, next) => {
                mw.invoke(req, res, next, res.locals.dino.result);
            });
        }
    }

    // ex: ResponseEndMiddleware
    builtInErrorMiddleware(middleware: any): void {
        if (DinoUtility.isSyncErrorMiddleware(middleware)) {
            let mw = new middleware();
            this.app.use(this.baseUri, (err, req, res, next) => {
                mw.invoke(err, req, res, next);
            });
        }
    }

    appStartMiddleware(middleware: Function): void {
        if (DinoUtility.isSyncAppStartMiddleware(middleware)) {
            let mw = this.resolve<AppStartMiddleware>(middleware, null);
            mw.invoke();
        }
    }

    requestStartMiddleware(middleware: Function): void {
        if (DinoUtility.isSyncRequestStartMiddleware(middleware)) {
            this.app.use(this.baseUri, (req, res, next) => {
                let mw = this.resolve<RequestStartMiddleware>(
                    middleware,
                    res.locals.dino);
                mw.invoke(req, res, next);
            });
        } else if (DinoUtility.isAsyncRequestStartMiddleware(middleware)) {
            this.app.use(this.baseUri, async (req, res, next) => {
                try {
                    let mw = this.resolve<RequestStartMiddlewareAsync>(
                        middleware,
                        res.locals.dino);
                    await mw.invoke(req, res, next);
                } catch (err) {
                    next(err);
                }
            });
        }
    }

    requestEndMiddleware(middleware: Function): void {
        if (DinoUtility.isSyncRequestEndMiddleware(middleware)) {
            this.app.use(this.baseUri, (req, res, next) => {
                let mw = this.resolve<RequestEndMiddleware>(
                    middleware,
                    res.locals.dino);
                mw.invoke(req, res, next, res.locals.dino.result, res.locals.dino);
            });
        } else if (DinoUtility.isAsyncRequestEndMiddleware(middleware)) {
            this.app.use(this.baseUri, async (req, res, next) => {
                try {
                    let mw = this.resolve<RequestEndMiddlewareAsync>(
                        middleware,
                        res.locals.dino);
                    await mw.invoke(req, res, next, res.locals.dino.result, res.locals.dino);
                } catch (err) {
                    next(err);
                }
            });
        }
    }

    // Any error occurred in dinoloop instance will be propagated to these middlewares
    registerErrorMiddleware(middleware: Function): void {
        if (DinoUtility.isSyncErrorMiddleware(middleware)) {
            this.app.use(this.baseUri, (err, req, res, next) => {
                let mw = this.resolve<ErrorMiddleware>(middleware,
                    res.locals.dino);
                mw.invoke(err, req, res, next);
            });
        } else if (DinoUtility.isAsyncErrorMiddleware(middleware)) {
            this.app.use(this.baseUri, async (err, req, res, next) => {
                let mw = this.resolve<ErrorMiddlewareAsync>(middleware,
                    res.locals.dino);
                try {
                    await mw.invoke(err, req, res, next);
                } catch (err) {
                    next(err);
                }
            });
        }
    }

    // Register the global application error controller for the dinoloop instance
    // This can be considered as last error handler for the error object
    registerErrorController(type: Function): void {
        if (DinoUtility.isErrorController(type)) {
            this.app.use(this.baseUri, (err, req, res, next) => {
                let api = this.resolve<ErrorController>(type,
                    res.locals.dino);
                let ctx = DinoErrorController.create(api);
                ctx.patch(err, req, res, next);
                ctx.invoke(Constants.errControllerDefaultMethod);
            });
        }
    }

    // made public for unit test and not available on interface contract
    setUpDinoController(type: any,
        actionAttr: IActionMethodAttribute,
        res: Response): DinoController {

        let api = this.resolve<ApiController>(type, res.locals.dino);
        let action = ControllerAction.create(actionAttr);
        let ctx = DinoController.create(api, action);

        return ctx;
    }

    // Populates controller middlewares, filters etc by walking up the controllers inheritance chain
    // made public for unit test and not available on interface contract
    populateControllerMiddlewares(obj: ApiController): IControllerAttributeProvider {

        let objProto = ObjectUtility.getPrototypeOf(obj);
        let metadata: IControllerAttributeExtended = Reflector.getMetadata(Attribute.controller, obj);
        let exceptionFilters = [];
        let resultFilters = [];
        let middlewares = [];
        let prefixes = [];
        let beforeActionFilters = [];
        let afterActionFilters = [];
        let expressWares = [];

        while (!(DataUtility.isUndefinedOrNull(metadata))) {

            let reverseFilters = metadata.filters.slice().reverse();

            metadata.middlewares.reverse();
            metadata.use.reverse();

            prefixes.push(metadata.prefix
                .split('')
                .reverse()
                .join(''));

            for (const expressWare of metadata.use) expressWares.push(expressWare);
            for (const filter of metadata.filters) afterActionFilters.push(filter);
            for (const filter of reverseFilters) beforeActionFilters.push(filter);
            for (const middleware of metadata.middlewares) middlewares.push(middleware);
            for (const filter of metadata.exceptions) exceptionFilters.push(filter);
            for (const filter of metadata.result) resultFilters.push(filter);

            objProto = ObjectUtility.getPrototypeOf(objProto);
            metadata = Reflector.getOwnMetadata(Attribute.controller, objProto);
        }

        expressWares.reverse();
        middlewares.reverse();
        beforeActionFilters.reverse();
        let prefixRoute = prefixes
            .join('')
            .split('')
            .reverse()
            .join('');

        return {
            middlewares: middlewares,
            use: expressWares,
            exceptions: exceptionFilters,
            result: resultFilters,
            prefix: prefixRoute,
            afterActionFilters: afterActionFilters,
            beforeActionFilters: beforeActionFilters
        };
    }

    // made public for unit test and not available on interface contract
    // gets all the attributes that are attached to action method
    getActionMethodMetadata(
        httpAttribute: string,
        actionName: string,
        controller: ApiController): IActionMethodAttribute {

        let route: string = Reflector.getMetadata(httpAttribute, controller, actionName);
        let httpVerb: string = RouteAttribute[httpAttribute];
        let isAsync = Reflector.hasMetadata(Attribute.asyncAttr, controller, actionName);
        let sendsResponse = Reflector.hasMetadata(Attribute.sendsResponse, controller, actionName);
        let returnsAttr: Function | object = Reflector.getMetadata(Attribute.returns, controller, actionName);
        let actionArgs: IParseAttribute[] =
            Reflector.getMetadata(Attribute.parse, controller, actionName);

        let obj = {
            route: route,
            httpVerb: httpVerb,
            isAsync: isAsync,
            sendsResponse: sendsResponse,
            returns: returnsAttr,
            actionArguments:
                DataUtility.isUndefinedOrNull(actionArgs) ? [] : actionArgs
        } as IActionMethodAttribute;

        return obj;
    }

    // Registers and binds the controller with express router
    registerController(type: Function): void {

        if (!DinoUtility.isApiController(type)) return;

        let controller: ApiController = ObjectUtility.create(type.prototype);

        // validate if the controller has @Controller attribute
        if (Reflector.hasMetadata(Attribute.controller, controller)) {

            let metadata = this.populateControllerMiddlewares(controller);
            let dinoRoute = DinoRouter.create({
                enableTaskContext: this.enableTaskContext,
                routerCb: this.useRouterCb,
                diContainer: this.diContainer
            });

            const router = dinoRoute.expressRouter();

            // Register expresswares before anything else gets registered on the router
            // expresswares are the native express middleware handlers.
            for (const expressWare of metadata.use) {
                router.use(expressWare);
            }

            dinoRoute.registerMiddlewares(metadata.middlewares);
            dinoRoute.registerBeginActionFilters(metadata.beforeActionFilters);

            const props = DinoUtility.getControllerProperties(controller);

            // loop through all the controller action methods
            // this also includes the inherited base controllers action methods
            for (let actionName of props) {

                // loop through every HttpVerb key i.e. get, post ...
                ObjectUtility.keys(RouteAttribute).forEach(httpAttribute => {

                    // Check if the controller action has HttpVerb (get, post ...) attribute
                    if (Reflector.hasMetadata(httpAttribute, controller, actionName)) {

                        let action = this.getActionMethodMetadata(httpAttribute, actionName, controller);
                        this.routeTable
                            .add(`${this.baseUri}${metadata.prefix}${action.route}`, action.httpVerb);

                        if (action.isAsync) {
                            router[action.httpVerb](action.route, async (req, res, next) => {
                                let ctx =
                                    this.setUpDinoController(type, action, res);
                                ctx.patch(req, res, next);
                                await ctx.invokeAsync(actionName);
                            });
                        } else {
                            router[action.httpVerb](action.route, (req, res, next) => {
                                let ctx =
                                    this.setUpDinoController(type, action, res);
                                ctx.patch(req, res, next);
                                ctx.invoke(actionName);
                            });
                        }
                    }
                });
            }

            dinoRoute.registerAfterActionFilters(metadata.afterActionFilters);
            dinoRoute.registerResultFilters(metadata.result);

            // Register the router on the app instance
            this.app.use(this.baseUri + metadata.prefix, router);

            // Note: router specific Error middlewares must be registered,
            // only after registering the router with the express.app instance.
            dinoRoute.registerExceptionFilters(this.app,
                this.baseUri + metadata.prefix, metadata.exceptions);
        }
    }

    static create(config: IDinoContainerConfig): DinoContainer {
        return new DinoContainer(config);
    }
}
