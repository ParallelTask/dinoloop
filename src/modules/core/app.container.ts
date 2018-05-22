import { Express } from '../types/express';
import { DinoContainer } from './dino.container';
import { DataUtility } from '../utility/data.utility';
import { DinoStartMiddleware } from '../builtin/middlewares/dino.start.middleware';
import { TaskContextMiddleware } from '../builtin/middlewares/task.context.middleware';
import { IAppContainer } from '../interfaces/idino';
import { IRouterCallBack } from '../types/attribute';

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
    observableMiddlewares: Function[] = [];
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
        dinoContainer.builtInRequestStartMiddleWare(DinoStartMiddleware);

        // Register the task/user context middleware on request start
        if (this.enableTaskContext) {
            dinoContainer.builtInRequestStartMiddleWare(TaskContextMiddleware);
        }

        // Register RouteNotFound middleware, which handles the routing issues
        if (!DataUtility.isUndefinedOrNull(this.routeNotFoundMiddleware)) {
            dinoContainer.routeNotFoundMiddleware(this.routeNotFoundMiddleware);
        }

        for (const middleware of this.startMiddleware) {
            dinoContainer.requestStartMiddleWare(middleware);
        }

        for (const controller of this.controllers) {
            dinoContainer.registerController(controller);
        }

        for (const middleware of this.endMiddleware) {
            dinoContainer.requestEndMiddleWare(middleware);
        }

        for (const middleware of this.errorMiddleware) {
            dinoContainer.registerErrorMiddleWare(middleware);
        }

        // Register the application error controller
        // this would be the last error middleware to handle error object
        // make sure to register only after registering ErrorMiddleWares
        if (!DataUtility.isUndefinedOrNull(this.errorController)) {
            dinoContainer.registerErrorController(this.errorController);
        }

        // This can be registered at any line of statement but preferred at the end
        for (const middleware of this.observableMiddlewares) {
            dinoContainer.registerObservables(middleware);
        }
    }

    static create(app: Express): AppContainer {
        return new AppContainer(app);
    }
}
