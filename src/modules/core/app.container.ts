import { Express } from '../types/express';
import { DinoContainer } from './dino.container';
import { DataUtility } from '../utility/data.utility';
import { DinoStartMiddleware } from '../builtin/middlewares/dino.start.middleware';
import { TaskContextMiddleware } from '../builtin/middlewares/task.context.middleware';
import { ResponseEndMiddleware } from '../builtin/middlewares/response.end.middleware';
import { IAppContainer } from '../interfaces/idino';
import { IRouterCallBack } from '../types/attribute';
import { RouteExceptionMiddleware } from '../builtin/middlewares/route.exception.middleware';

export class AppContainer implements IAppContainer {
    private app: Express;
    controllers: Function[] = [];
    baseUri: string = '';
    startMiddleware: Function[] = [];
    endMiddleware: Function[] = [];
    diContainer: any;
    diResolveCallback: any;
    errorController: Function;
    routeNotFoundMiddleware: Function;
    errorMiddleware: Function[] = [];
    raiseModelError = false;
    enableTaskContext = false;
    useRouter: IRouterCallBack;

    constructor(app: Express) {
        this.app = app;
    }

    build(): void {

        let dinoContainer = DinoContainer.create({
            app: this.app,
            raiseModelError: this.raiseModelError,
            enableTaskContext: this.enableTaskContext,
            routerCallback: this.useRouter,
            baseUri: this.baseUri,
            diContainer: this.diContainer,
            diResolveCb: this.diResolveCallback
        });

        // attach dino property to response object on every request start
        dinoContainer.builtInRequestStartMiddleware(DinoStartMiddleware);

        if (this.enableTaskContext) {
            dinoContainer.builtInRequestStartMiddleware(TaskContextMiddleware);
        }

        if (!DataUtility.isUndefinedOrNull(this.routeNotFoundMiddleware)) {
            dinoContainer.routeNotFoundMiddleware(this.routeNotFoundMiddleware);
        }

        for (const middleware of this.startMiddleware) {
            dinoContainer.requestStartMiddleware(middleware);
        }

        for (const controller of this.controllers) {
            dinoContainer.registerController(controller);
        }

        for (const middleware of this.endMiddleware) {
            dinoContainer.requestEndMiddleware(middleware);
        }

        // register ResponseEndMiddleware as the last RequestEndMiddleware
        // must be registered after registering user requestEndMiddlewares
        dinoContainer.builtInRequestEndMiddleware(ResponseEndMiddleware);

        for (const middleware of this.errorMiddleware) {
            dinoContainer.registerErrorMiddleware(middleware);
        }

        // Register the application error controller
        // This would be the last error middleware to handle error object
        // make sure to register only after registering ErrorMiddleWares
        if (!DataUtility.isUndefinedOrNull(this.errorController)) {
            dinoContainer.registerErrorController(this.errorController);
        }

        // register RouteExceptionMiddleware as the last ErrorMiddleware
        // must be registered after registering user ErrorMiddlewares
        dinoContainer.builtInErrorMiddleware(RouteExceptionMiddleware);
    }

    static create(app: Express): AppContainer {
        return new AppContainer(app);
    }
}
