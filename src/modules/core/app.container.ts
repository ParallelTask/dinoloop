import { Express, IRouterCallBack } from '../types';
import { DinoContainer } from './dino.container';
import { DataUtility } from '../utility';
import {
    DinoStartMiddleware,
    TaskContextMiddleware,
    ResponseEndMiddleware,
    RouteExceptionMiddleware,
    ParseParamExceptionMiddleware,
    HttpResponseExceptionMiddleware,
    HttpResponseMessageMiddleware
} from '../builtin/middlewares';
import { IAppContainer } from '../interfaces';

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

        // Note:- built-in RequestEndMiddleware must be registered 
        // after registering user requestEndMiddlewares

        // register built-in RequestEndMiddleware
        dinoContainer.builtInRequestEndMiddleware(HttpResponseMessageMiddleware);

        // register ResponseEndMiddleware as the last built-in RequestEndMiddleware
        dinoContainer.builtInRequestEndMiddleware(ResponseEndMiddleware);

        for (const middleware of this.errorMiddleware) {
            dinoContainer.registerErrorMiddleware(middleware);
        }

        // Note:- built-in ErrorMiddleware must be registered 
        // after registering user ErrorMiddlewares

        dinoContainer.builtInErrorMiddleware(RouteExceptionMiddleware);
        dinoContainer.builtInErrorMiddleware(HttpResponseExceptionMiddleware);
        dinoContainer.builtInErrorMiddleware(ParseParamExceptionMiddleware);

        // Register the application error controller
        // This would be the last error middleware to handle error object
        // make sure to register only after registering ErrorMiddleWares
        if (!DataUtility.isUndefinedOrNull(this.errorController)) {
            dinoContainer.registerErrorController(this.errorController);
        }
    }

    static create(app: Express): AppContainer {
        return new AppContainer(app);
    }
}
