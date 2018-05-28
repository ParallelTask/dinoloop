import { Router, Express } from '../types/express';
import { DinoUtility } from '../utility/dino.utility';
import { IMiddlewareProvider, IMiddlewareClass, IRouterCallBack } from '../types/attribute';
import { IDIContainer, IDinoRouter } from '../interfaces/idino';
import { IRouterConfig, IDinoProperties } from '../types/dino.types';
import { ObjectUtility } from '../utility/object.utility';
import { DinoParser } from '../utility/dino.parser';
import { IUserIdentity } from '../providers/providers';
import {
    Middleware,
    MiddlewareAsync,
    ActionFilter,
    ActionFilterAsync,
    ResultFilter,
    ResultFilterAsync,
    ExceptionFilter,
    ExceptionFilterAsync
} from '../filter/filter';

// Each controller gets an instance of router
// Register middlewares on the router level
// so that the middlewares are available for all routes at router level
export class DinoRouter implements IDinoRouter {
    private router: Router;
    private diContainer: IDIContainer;
    private enableTaskContext: boolean;

    constructor(config: IRouterConfig) {
        this.diContainer = config.diContainer;
        // Gets the new instance of express.router
        this.router = config.routerCb();
        this.enableTaskContext = config.enableTaskContext;
    }

    // made public for unit test and not available on interface contract
    resolve<T>(middleware: Function, dino: IDinoProperties): T {
        let o = this.diContainer.resolve<T>(middleware);

        return this.enableTaskContext ?
            ObjectUtility.replaceObjectReferences(o, dino.context, IUserIdentity) : o;
    }

    // made public for unit test and not available on interface contract
    registerMiddleware(middleware: IMiddlewareProvider): void {
        let provider = DinoParser.parseMiddlewareProvider(middleware);

        if (DinoUtility.isSyncMiddleWare(provider.useClass)) {
            this.router.use((req, res, next) => {
                let mware = this.resolve<Middleware>(
                    provider.useClass, res.locals.dino);
                mware.invoke(req, res, next, provider.data);
            });
        } else if (DinoUtility.isAsyncMiddleWare(provider.useClass)) {
            this.router.use(async (req, res, next) => {
                let mware = this.resolve<MiddlewareAsync>(
                    provider.useClass, res.locals.dino);
                try {
                    await mware.invoke(req, res, next, provider.data);
                } catch (err) {
                    next(err);
                }
            });
        }
    }

    // made public for unit test and not available on interface contract
    registerBeginActionFilter(filter: IMiddlewareProvider): void {
        let provider = DinoParser.parseMiddlewareProvider(filter);

        if (DinoUtility.isSyncActionFilter(provider.useClass)) {
            this.router.use((req, res, next) => {
                let mware = this.resolve<ActionFilter>(
                    provider.useClass, res.locals.dino);
                mware.beforeExecution(req, res, next, provider.data);
            });
        } else if (DinoUtility.isAsyncActionFilter(provider.useClass)) {
            this.router.use(async (req, res, next) => {
                let mware = this.resolve<ActionFilterAsync>(
                    provider.useClass, res.locals.dino);
                try {
                    await mware.beforeExecution(req, res, next, provider.data);
                } catch (err) {
                    next(err);
                }
            });
        }
    }

    // made public for unit test and not available on interface contract
    registerAfterActionFilter(filter: IMiddlewareProvider): void {
        let provider = DinoParser.parseMiddlewareProvider(filter);

        if (DinoUtility.isSyncActionFilter(provider.useClass)) {
            this.router.use((req, res, next) => {
                let mware = this.resolve<ActionFilter>(
                    provider.useClass, res.locals.dino);
                mware.afterExecution(req, res, next, res.locals.dino.result, provider.data);
            });
        } else if (DinoUtility.isAsyncActionFilter(provider.useClass)) {
            this.router.use(async (req, res, next) => {
                let mware = this.resolve<ActionFilterAsync>(
                    provider.useClass, res.locals.dino);
                try {
                    await mware.afterExecution(req, res, next, res.locals.dino.result, provider.data);
                } catch (err) {
                    next(err);
                }
            });
        }
    }

    // made public for unit test and not available on interface contract
    registerResultFilter(filter: IMiddlewareProvider): void {
        let provider = DinoParser.parseMiddlewareProvider(filter);

        if (DinoUtility.isSyncResultFilter(provider.useClass)) {
            this.router.use((req, res, next) => {
                let mware = this.resolve<ResultFilter>(
                    provider.useClass, res.locals.dino);
                mware.invoke(req, res, next, res.locals.dino.result, provider.data);
            });
        } else if (DinoUtility.isAsyncResultFilter(provider.useClass)) {
            this.router.use(async (req, res, next) => {
                let mware = this.resolve<ResultFilterAsync>(
                    provider.useClass, res.locals.dino);
                try {
                    await mware.invoke(req, res, next, res.locals.dino.result, provider.data);
                } catch (err) {
                    next(err);
                }
            });
        }
    }

    // made public for unit test and not available on interface contract
    registerExceptionFilter(app: Express,
        uri: string | RegExp,
        middleware: IMiddlewareProvider): void {
        let provider = DinoParser.parseMiddlewareProvider(middleware);

        if (DinoUtility.isSyncExceptionFilter(provider.useClass)) {
            app.use(uri, (err, req, res, next) => {
                let mware = this.resolve<ExceptionFilter>(
                    provider.useClass, res.locals.dino);
                mware.invoke(err, req, res, next);
            });
        } else if (DinoUtility.isAsyncExceptionFilter(provider.useClass)) {
            app.use(uri, async (err, req, res, next) => {
                let mware = this.resolve<ExceptionFilterAsync>(
                    provider.useClass, res.locals.dino);
                try {
                    await mware.invoke(err, req, res, next);
                } catch (err) {
                    next(err);
                }
            });
        }
    }

    expressRouter(): Router {
        return this.router;
    }

    registerExceptionFilters(app: Express,
        uri: string | RegExp,
        filters: IMiddlewareProvider[]): void {
        for (const filter of filters) {
            this.registerExceptionFilter(app, uri, filter);
        }
    }

    registerMiddlewares(middlewares: IMiddlewareProvider[]): void {
        for (const middleware of middlewares) {
            this.registerMiddleware(middleware);
        }
    }

    registerBeginActionFilters(actionFilters: IMiddlewareProvider[]): void {
        for (const filter of actionFilters) {
            this.registerBeginActionFilter(filter);
        }
    }

    registerAfterActionFilters(actionFilters: IMiddlewareProvider[]): void {
        for (const filter of actionFilters) {
            this.registerAfterActionFilter(filter);
        }
    }

    registerResultFilters(resultFilters: IMiddlewareProvider[]): void {
        for (const filter of resultFilters) {
            this.registerResultFilter(filter);
        }
    }

    static create(config: IRouterConfig): DinoRouter {
        return new DinoRouter(config);
    }
}
