import { Express, IExpressResponse } from '../types/express';
import { ApiController } from '../controller/api.controller';
import { ObservableMiddleware } from '../filter/filter';
import { DIContainer } from './dicontainer';
import { ErrorController } from '../controller/error.controller';
import { DinoUtility } from '../utility/dino.utility';
import { DinoController } from '../core/dino.controller';
import { DinoRouter } from '../router/dino.router';
import { DinoErrorController } from './dino.error.controller';
import { RouteTable } from '../router/route.table';
import { DataUtility } from '../utility/data.utility';
import { ControllerAction } from '../controller/controller.action';
import { Reflector } from '../lib/reflector';
import { ObjectUtility } from '../utility/object.utility';
import { IRequestEndMiddleware, IRequestStartMiddleware, IErrorMiddleware } from '../interfaces/filter';
import { IDinoContainer, IDIContainer, IRouteTable } from '../interfaces/idino';
import { IDinoContainerConfig, IDinoResponse, IActionMethodAttributes } from '../types/dino.types';
import {
    IRouterCallBack,
    IControllerAttributeProvider,
    IControllerAttributeExtended,
    IBindModelAttributeExtended
} from '../types/attribute';
import { Attribute, RouteAttribute } from '../constants/constants';
import { IUserIdentity } from '../providers/providers';

export class DinoContainer implements IDinoContainer {
    private diContainer: IDIContainer;
    private app: Express;
    private baseUri: string;
    private routeTable: IRouteTable;
    private raiseModelError: boolean;
    private enableTaskContext: boolean;
    private useRouterCb: IRouterCallBack;

    // exposing this property only to unittest
    // should figure out the way to handle it by making this property as private
    observableMiddlewares: any[] = [];

    constructor(config: IDinoContainerConfig) {
        this.app = config.app;
        this.baseUri = config.baseUri;
        this.raiseModelError = config.raiseModelError;
        this.enableTaskContext = config.enableTaskContext;
        this.useRouterCb = config.routerCallback;
        this.diContainer = DIContainer.create(config.diContainer, config.diResolveCb);
        this.routeTable = RouteTable.create();
    }

    // made public for unittest and not available on interface method
    resolve<T>(middleware: Function, dino: IDinoResponse): T {
        let o = this.diContainer.resolve<T>(middleware);

        // walkthrough the entire object chain and replace IUserIdentity instance References
        return this.enableTaskContext ?
            ObjectUtility.replaceObjectReferences(o, dino.context, IUserIdentity) : o;
    }

    // registers routenotfound middleware
    routeNotFoundMiddleware(middleware: any): void {
        if (DinoUtility.isSyncRequestStartMiddleware(middleware)) {
            // create routenotfound middleware as singleton object
            let mw = new middleware(this.routeTable);
            this.app.use(this.baseUri, (req, res, next) => {
                mw.invoke(req, res, next);
            });
        }
    }

    // Register builtin middlewares which are to be registered on request start
    // ex: DinoStartMiddleware, TaskContextMiddleware
    builtInRequestStartMiddleWare(middleware: any): void {
        if (DinoUtility.isSyncRequestStartMiddleware(middleware)) {
            // create builtin middlewares as singleton object
            let mw = new middleware();
            this.app.use(this.baseUri, (req, res, next) => {
                mw.invoke(req, res, next);
            });
        }
    }

    // register request start middlewares, which runs for every request start
    requestStartMiddleWare(middleware: Function): void {
        if (DinoUtility.isSyncRequestStartMiddleware(middleware)) {
            this.app.use(this.baseUri, (req, res, next) => {
                let mw = this.resolve<IRequestStartMiddleware>(middleware,
                    res.locals.dino);
                mw.invoke(req, res, next);
            });
        } else if (DinoUtility.isAsyncRequestStartMiddleware(middleware)) {
            this.app.use(this.baseUri, async (req, res, next) => {
                try {
                    let mw = this.resolve<IRequestStartMiddleware>(middleware,
                        res.locals.dino);
                    await mw.invoke(req, res, next);
                } catch (err) {
                    next(err);
                }
            });
        }
    }

    // register request end middlewares, which will run for every request end
    requestEndMiddleWare(middleware: Function): void {
        if (DinoUtility.isSyncRequestEndMiddleware(middleware)) {
            this.app.use(this.baseUri, (req, res, next) => {
                let mw = this.resolve<IRequestEndMiddleware>(middleware,
                    res.locals.dino);
                mw.invoke(req, res, next, res.locals.dino.result);
            });
        } else if (DinoUtility.isAsyncRequestEndMiddleware(middleware)) {
            this.app.use(this.baseUri, async (req, res, next) => {
                try {
                    let mw = this.resolve<IRequestEndMiddleware>(middleware,
                        res.locals.dino);
                    await mw.invoke(req, res, next, res.locals.dino.result);
                } catch (err) {
                    next(err);
                }
            });
        }
    }

    // TODO: Currently we consider only the first observable middleware
    // The other registered observable middlewares are ignored
    registerObservables(type: Function): void {
        if (DinoUtility.isObservableMiddleware(type)) {
            this.observableMiddlewares.push(type);
        }
    }

    // Register the error middlewares
    // so that any error occured in dinoloop instance will be propogated to these middlewares
    registerErrorMiddleWare(middleware: Function): void {
        if (DinoUtility.isSyncErrorMiddleware(middleware)) {
            this.app.use(this.baseUri, (err, req, res, next) => {
                let mw = this.resolve<IErrorMiddleware>(middleware,
                    res.locals.dino);
                mw.invoke(err, req, res, next);
            });
        } else if (DinoUtility.isAsyncErrorMiddleware(middleware)) {
            this.app.use(this.baseUri, async (err, req, res, next) => {
                let mw = this.resolve<IErrorMiddleware>(middleware,
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
                ctx.invoke(Attribute.errorControllerDefaultMethod);
            });
        }
    }

    // made public for unittest and not available on interface method
    setUpDinoController(type: any,
        sendsResponse: boolean,
        observableResponse: boolean,
        bindsModel: IBindModelAttributeExtended,
        res: IExpressResponse): DinoController {
        let o = observableResponse ?
            this.resolve<ObservableMiddleware>(this.observableMiddlewares[0], res.locals.dino)
            : undefined;
        let api = this.resolve<ApiController>(type, res.locals.dino);
        let action = ControllerAction.create(sendsResponse, o, bindsModel);
        let ctx = DinoController.create(api, action);

        return ctx;
    }

    // Populates controller middlewares, filters etc by walking up through the inheritance chain
    // made public for unittest and not available on interface method
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

    // made public for unittest and not available on interface method.
    // gets all the metadata/attributes that are attached to action method.
    getActionMethodMetadata(
        httpAttribute: string,
        actionName: string,
        controller: ApiController): IActionMethodAttributes {

        let route: string = Reflector.getMetadata(httpAttribute, controller, actionName);
        let bindsModel: IBindModelAttributeExtended =
            Reflector.getMetadata(Attribute.bindModel, controller, actionName);
        let httpVerb: string = RouteAttribute[httpAttribute];
        let isAsync = Reflector.hasMetadata(Attribute.asyncAttr, controller, actionName);
        let sendsResponse = Reflector.hasMetadata(Attribute.sendsResponse, controller, actionName);
        let observableResponse = Reflector.hasMetadata(Attribute.observable, controller, actionName);

        bindsModel.options.raiseModelError =
            DataUtility.isUndefinedOrNull(bindsModel.options.raiseModelError)
                ? this.raiseModelError : bindsModel.options.raiseModelError;

        return {
            route: route,
            httpVerb: httpVerb,
            isAsync: isAsync,
            sendsResponse: sendsResponse,
            observableResponse: observableResponse,
            bindsModel: bindsModel
        };
    }

    // register and bind the controller with express router
    registerController(type: Function): void {

        if (!DinoUtility.isApiController(type)) return;

        let controller: ApiController = ObjectUtility.create(type.prototype);

        // validate if the controller has @controller metadata
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

            // loop through all the controller action methods
            // this also includes the inherited base controllers action methods
            for (let actionName in controller) {

                // loop through every httpverb key i.e. get, post ...
                ObjectUtility.keys(RouteAttribute).forEach(httpAttribute => {

                    // If the controller action has httpverb (get, post ...) attribute 
                    if (Reflector.hasMetadata(httpAttribute, controller, actionName)) {

                        let action = this.getActionMethodMetadata(httpAttribute, actionName, controller);
                        this.routeTable
                            .add(`${this.baseUri}${metadata.prefix}${action.route}`, action.httpVerb);

                        if (action.isAsync) {
                            router[action.httpVerb](action.route, async (req, res, next) => {
                                let ctx = this.setUpDinoController(type,
                                    action.sendsResponse, action.observableResponse, action.bindsModel, res);
                                ctx.patch(req, res, next);
                                ctx.invokeAsync(actionName, action.httpVerb, action.route);
                            });
                        } else {
                            router[action.httpVerb](action.route, (req, res, next) => {
                                let ctx = this.setUpDinoController(type,
                                    action.sendsResponse, action.observableResponse, action.bindsModel, res);
                                ctx.patch(req, res, next);
                                ctx.invoke(actionName, action.httpVerb, action.route);
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