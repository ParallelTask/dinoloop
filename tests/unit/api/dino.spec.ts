import {
    Dino,
    AppContainer,
    IAppContainer,
    RouteNotFoundMiddleware,
    Errors
} from '../index';

describe('api.dino.spec', () => {
    it('registerController.verify_registerControllers', () => {
        let obj: IAppContainer = { controllers: [] } as IAppContainer;
        let express;
        spyOn(AppContainer, 'create').and.callFake(app => {
            express = app;

            return obj;
        });
        let app = new Dino({ expressInstance: true } as any, '/test');
        app.registerController(Function);
        app.registerController(Boolean);
        expect(obj.controllers[0]).toBe(Function);
        expect(obj.controllers[1]).toBe(Boolean);
        // Following expects are common for most of the tests, should not be deleted easily
        expect(express).toEqual({ expressInstance: true });
        expect(obj.baseUri).toBe('/test');
        expect(obj.routeNotFoundMiddleware).toBe(RouteNotFoundMiddleware);
    });
    it('requestStart.verify_requestStart_middlewares', () => {
        let obj: IAppContainer = { startMiddleware: [] } as IAppContainer;
        spyOn(AppContainer, 'create').and.callFake(() => obj);
        let app = new Dino({ expressInstance: true } as any, '/test');
        app.requestStart(Function);
        app.requestStart(Boolean);
        expect(obj.startMiddleware[0]).toBe(Function);
        expect(obj.startMiddleware[1]).toBe(Boolean);
    });
    it('requestEnd.verify_requestEnd_middlewares', () => {
        let obj: IAppContainer = { endMiddleware: [] } as IAppContainer;
        spyOn(AppContainer, 'create').and.callFake(() => obj);
        let app = new Dino({ expressInstance: true } as any, '/test');
        app.requestEnd(Function);
        app.requestEnd(Boolean);
        expect(obj.endMiddleware[0]).toBe(Function);
        expect(obj.endMiddleware[1]).toBe(Boolean);
    });
    it('serverError.verify_serverError_middlewares', () => {
        let obj: IAppContainer = { errorMiddleware: [] } as IAppContainer;
        spyOn(AppContainer, 'create').and.callFake(() => obj);
        let app = new Dino({ expressInstance: true } as any, '/test');
        app.serverError(Function);
        app.serverError(Boolean);
        expect(obj.errorMiddleware[0]).toBe(Function);
        expect(obj.errorMiddleware[1]).toBe(Boolean);
    });
    it('registerApplicationError.verify_registerApplicationError', () => {
        let obj: IAppContainer = { errorController: undefined } as IAppContainer;
        spyOn(AppContainer, 'create').and.callFake(() => obj);
        let app = new Dino({ expressInstance: true } as any, '/test');
        app.registerApplicationError(Function);
        expect(obj.errorController).toBe(Function);
    });
    it('registerApplicationError.should_have_last_registered_as_registerApplicationError', () => {
        let obj: IAppContainer = { errorController: undefined } as IAppContainer;
        spyOn(AppContainer, 'create').and.callFake(() => obj);
        let app = new Dino({ expressInstance: true } as any, '/test');
        app.registerApplicationError(Function);
        app.registerApplicationError(String);
        expect(obj.errorController).toBe(String);
    });
    it('useRouter.verify_router_callback', () => {
        let obj: IAppContainer = { useRouter: undefined } as IAppContainer;
        spyOn(AppContainer, 'create').and.callFake(() => obj);
        let app = new Dino({ expressInstance: true } as any, '/test');
        app.useRouter(() => 5);
        expect(obj.useRouter()).toBe(5);
    });
    it('disableRouteNotFoundException.routeNotFoundMiddleware_must_be_undefined', () => {
        let obj: IAppContainer = {} as IAppContainer;
        obj.routeNotFoundMiddleware = String;
        spyOn(AppContainer, 'create').and.callFake(() => obj);
        let app = new Dino({ expressInstance: true } as any, '/test');
        app.disableRouteNotFoundException();
        expect(obj.routeNotFoundMiddleware).toBeUndefined();
    });
    it('enableTaskContext.enableTaskContext_must_be_true', () => {
        let obj: IAppContainer = { enableTaskContext: false } as IAppContainer;
        spyOn(AppContainer, 'create').and.callFake(() => obj);
        let app = new Dino({ expressInstance: true } as any, '/test');
        app.enableUserIdentity();
        expect(obj.enableTaskContext).toBeTruthy();
    });
    it('dependencyResolver.verify_di_resolver', () => {
        let obj: IAppContainer = {
            diContainer: undefined,
            diResolveCallback: undefined
        } as IAppContainer;
        spyOn(AppContainer, 'create').and.callFake(() => obj);
        let app = new Dino({ expressInstance: true } as any, '/test');
        app.dependencyResolver(String, () => 5);
        expect(obj.diContainer).toBe(String);
        expect(obj.diResolveCallback()).toBe(5);
    });
    it('bind.throws_Error_when_useRouter_not_registered', () => {
        let obj: IAppContainer = {} as IAppContainer;
        spyOn(AppContainer, 'create').and.callFake(() => obj);
        let app = new Dino({ expressInstance: true } as any, '/test');
        expect(() => app.bind())
            .toThrow(new Error(Errors.routerNotRegistered));
    });
    it('bind.throws_Error_when_bind_called_twice', () => {
        let obj: IAppContainer = {} as IAppContainer;
        obj.useRouter = () => null;
        obj.build = () => null;
        spyOn(AppContainer, 'create').and.callFake(() => obj);
        let app = new Dino({ expressInstance: true } as any, '/test');
        app.bind();
        expect(() => app.bind())
            .toThrow(new Error(Errors.dinoAlreadyBinded));
    });
    it('bind.invoke_app.build_when_bind_called_once', () => {
        let obj: IAppContainer = {} as IAppContainer;
        let invoked = false;
        obj.useRouter = () => null;
        obj.build = () => invoked = true;
        spyOn(AppContainer, 'create').and.callFake(() => obj);
        let app = new Dino({ expressInstance: true } as any, '/test');
        app.bind();
        expect(invoked).toBeTruthy();
    });
});
