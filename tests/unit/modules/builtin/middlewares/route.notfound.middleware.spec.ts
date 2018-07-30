import {
    IRouteTable,
    RouteNotFoundMiddleware,
    RouteNotFoundException,
    Mock
} from '../../../index';

describe('modules.builtin.middlewares.route.notfound.middleware.spec', () => {
    let routes = [
        '/get_/api/route/',
        // :route is optional segment 
        '/get_/api/parse/:route?',
        '/get_/api/apple/:id',
        '/get_/api/route/:id/one/:name',
        '/get_/api/:id/home/one/:name',
        '/post_/:id',
        '/post_/v3/:id/one/:name',
        '/:verb_/api/v1/:id',
        '/:verb_/v1/:parse?/v2/:route?'
    ];
    let table = new Mock<IRouteTable>()
        .setup(x => x.getRoutes()).returns(routes);

    it('invoke.route_found_for_get_/api/route/_when_verb_is_get', () => {
        let invoked = false;
        let err = 'test';
        new RouteNotFoundMiddleware(table.object())
            .invoke({
                method: 'geT',
                baseUrl: '/api/route',
                path: '/'
            } as any, null, e => {
                invoked = true;
                err = e;
            });
        // Following expect statements are common and makes sure next handler is invoked properly,
        // Highly recommended not to remove this statements
        expect(invoked).toBeTruthy();
        expect(err).toBeUndefined();
    });
    it('invoke.route_not_found_for_post_/api/route/_when_verb_is_get', () => {
        let req = {
            method: 'post',
            baseUrl: '/api/route',
            path: '/'
        };
        let err: RouteNotFoundException;
        new RouteNotFoundMiddleware(table.object())
            .invoke(req as any, null, e => err = e);
        expect(err).toBeDefined();
        expect(err instanceof RouteNotFoundException).toBeTruthy();
        // Same expect statements needs to be executed for every invalid route exception.
        // when any code related to exception is changed, following lines fails the test case.
        // Highly advised not to remove these set of lines
        expect(err.type).toBe(RouteNotFoundException.name);
        expect(err.httpVerb).toBe(req.method);
        expect(err.requestUrl).toBe(`${req.baseUrl}${req.path}`);
    });
    it('invoke.route_found_for_/api/parse/:route?_when_optional_segment_provided', () => {
        new RouteNotFoundMiddleware(table.object())
            .invoke({
                method: 'get',
                baseUrl: '/api/parse',
                path: '/45'
            } as any, null, err => expect(err).toBeUndefined());
    });
    it('invoke.route_found_for_/api/parse/:route?_when_optional_segment_not_provided', () => {
        new RouteNotFoundMiddleware(table.object())
            .invoke({
                method: 'get',
                baseUrl: '/api/parse',
                path: '/'
            } as any, null, err => expect(err).toBeUndefined());
    });
    it('invoke.route_found_for_/api/apple/:id_when_required_segment_:id_provided', () => {
        new RouteNotFoundMiddleware(table.object())
            .invoke({
                method: 'get',
                baseUrl: '/api/apple',
                path: '/45'
            } as any, null, err => expect(err).toBeUndefined());
    });
    it('invoke.route_not_found_for_get_/api/apple/:id_when_required_segment_:id_not_provided', () => {
        new RouteNotFoundMiddleware(table.object())
            .invoke({
                method: 'gEt',
                baseUrl: '/api/apple',
                path: '/'
            } as any, null, err => {
                expect(err instanceof RouteNotFoundException).toBeTruthy();
            });
    });
    it('invoke.route_found_for_post_/v3/:id/one/:name_when_/v3/ctrl/one/xyz', () => {
        new RouteNotFoundMiddleware(table.object())
            .invoke({
                method: 'POST',
                baseUrl: '/v3/ctrl/one',
                path: '/xyz'
            } as any, null, err => expect(err).toBeUndefined());
    });
    it('invoke.route_not_found_for_some_fake_route', () => {
        new RouteNotFoundMiddleware(table.object())
            .invoke({
                method: 'get',
                baseUrl: '/fake/v1',
                path: '/index'
            } as any, null, err => {
                expect(err instanceof RouteNotFoundException).toBeTruthy();
            });
    });
    it('invoke.route_found_for_get_/:verb_/api/v1/:id', () => {
        new RouteNotFoundMiddleware(table.object())
            .invoke({
                method: 'get',
                baseUrl: '/api/v1',
                path: '/abcd'
            } as any, null, err => expect(err).toBeUndefined());
    });
    it('invoke.route_found_for_post_/:verb_/api/v1/:id', () => {
        new RouteNotFoundMiddleware(table.object())
            .invoke({
                method: 'post',
                baseUrl: '/api/v1',
                path: '/abcd'
            } as any, null, err => expect(err).toBeUndefined());
    });
    it('invoke.route_found_for_all_/:verb_/api/v1/:id', () => {
        new RouteNotFoundMiddleware(table.object())
            .invoke({
                method: 'all',
                baseUrl: '/api/v1',
                path: '/abcd'
            } as any, null, err => expect(err).toBeUndefined());
    });
});
