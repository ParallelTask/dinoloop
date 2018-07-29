import { IAppContainer, IDino } from '../modules/interfaces';
import { Express } from '../modules/types';
import { DataUtility } from '../modules/utility';
import { Errors } from '../modules/constants';
import { RouteNotFoundMiddleware } from '../modules/builtin/middlewares';
import { AppContainer } from '../modules/core';

/**
 * Creates dino instance
 */
export class Dino implements IDino {
    private appContainer: IAppContainer;
    private isBinded = false;

    /**
     * app - ExpressApp
     * , baseUri - application mounted path
     */
    constructor(app: Express, baseUri: string) {
        this.appContainer = AppContainer.create(app);
        this.appContainer.baseUri = baseUri;
        this.appContainer.routeNotFoundMiddleware = RouteNotFoundMiddleware;
    }

    /**
     * Register API controller
     */
    registerController<T>(controller: Function & { prototype: T }): void {
        this.appContainer.controllers.push(controller);
    }

    /**
     * Register RequestStart middleware
     */
    requestStart<T>(middleware: Function & { prototype: T }): void {
        this.appContainer.startMiddleware.push(middleware);
    }

    /**
     * Register RequestEnd middleware
     */
    requestEnd<T>(middleware: Function & { prototype: T }): void {
        this.appContainer.endMiddleware.push(middleware);
    }

    /**
     * Register ServerError middleware
     */
    serverError<T>(middleware: Function & { prototype: T }): void {
        this.appContainer.errorMiddleware.push(middleware);
    }

    /**
     * Register ApplicationStart middleware
     */
    applicationStart<T>(middleware: Function & { prototype: T }): void {
        this.appContainer.appStartMiddleware.push(middleware);
    }

    // Unlike others, We support only one application error controller
    /**
     * Register ApplicationError controller
     */
    registerApplicationError<T>(type: Function & { prototype: T }): void {
        this.appContainer.errorController = type;
    }

    /**
     * Register express Router handler
     */
    useRouter(cb: () => any): void {
        this.appContainer.useRouter = cb;
    }

    // Why this property required?
    // express fires the middlewares based on the mounted path, even though
    // the end route (controller route) is not matched.
    // To fix this, dino introduces RouteNotFoundMiddleware just to make sure,
    // middlewares are fired only when valid route is found at controller level.
    // However, on triggering this method RouteNotFoundMiddleware is disabled.
    // Highly suggested not to invoke this unless you have a reason to.
    /**
     * RouteNotFoundMiddleware is unregistered
     */
    disableRouteNotFoundException(): void {
        this.appContainer.routeNotFoundMiddleware = undefined;
    }

    // This property enables orchestration of task/user contextual data for the entire request.
    // It guarantees to retain task/user context data across all services/middlewares for entire request.
    // Note: Inject IUserPrincipal in constructor dependencies and it maintains data for the entire request.
    /**
     * Reserved for future use
     */
    enableUserIdentity(): void {
        this.appContainer.enableTaskContext = true;
    }

    // This method lets us choose between different di containers,
    // We can use angular di or inversify which are popular di containers for typescript.
    // the consumer has to pass di container and resolver callback to resolve dependency from container.
    /**
     * Configures Dino to use DIFramework
     */
    dependencyResolver<T>(injector: T,
        cb: (injector: T, type: any) => any): void {
        this.appContainer.diContainer = injector;
        this.appContainer.diResolveCallback = cb;
    }

    // Once the dino instance is bounded, user is not allowed to invoke .bind() again
    // since container is already created and bound to express instance
    /**
     * Binds the dino instance to express app
     * @Throws Error(Errors.routerNotRegistered) 
     * @Throws Error(Errors.dinoAlreadyBinded)
     */
    bind(): void {
        if (this.isBinded) throw new Error(Errors.dinoAlreadyBinded);
        if (DataUtility.isUndefinedOrNull(this.appContainer.useRouter)) {
            throw new Error(Errors.routerNotRegistered);
        }

        this.isBinded = true;
        this.appContainer.build();
    }
}
