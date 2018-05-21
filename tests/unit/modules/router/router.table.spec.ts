import { RouteTable } from '../../index';

describe('modules.router.route.table.spec', () => {
    it('add.verify_/null_api/get_when_route_api/get_and_httpVerb_null', () => {
        let r = new RouteTable();
        r.add('api/get', null);
        expect(r.getRoutes()[0]).toBe('/null_api/get');
    });
    it('static_create.invoke_constructor', () => {
        let r = RouteTable.create();
        expect(r instanceof RouteTable).toBeTruthy();
    });
    it('add.verify_/undefined_api/get_when_route_api/get_httpVerb_undefined', () => {
        let r = new RouteTable();
        r.add('api/get', undefined);
        expect(r.getRoutes()[0]).toBe('/undefined_api/get');
    });
    it('add.verify_/undefined_api/get_when_route_undefined_and_httpVerb_undefined', () => {
        let r = new RouteTable();
        r.add(undefined, undefined);
        expect(r.getRoutes()[0]).toBe('/undefined_undefined');
    });
    it('add.verify_/undefined_api/get_when_route_null_and_httpVerb_null', () => {
        let r = new RouteTable();
        r.add(null, null);
        expect(r.getRoutes()[0]).toBe('/null_null');
    });
    it('add.verify_/get_null_when_route_null_and_httpVerb_get', () => {
        let r = new RouteTable();
        r.add(null, 'get');
        expect(r.getRoutes()[0]).toBe('/get_null');
    });
    it('add.verify_/get_undefined_when_route_undefined_and_httpVerb_get', () => {
        let r = new RouteTable();
        r.add(undefined, 'get');
        expect(r.getRoutes()[0]).toBe('/get_undefined');
    });
    it('add.verify_lowercase_/get_api/getall_when_route_api/getAll_and_httpVerb_get', () => {
        let r = new RouteTable();
        r.add('api/gEtAll', 'get');
        expect(r.getRoutes()[0]).toBe('/get_api/getall');
    });
    it('add.verify_lowercase_/post_api/setall_when_route_api/getAll_and_httpVerb_post', () => {
        let r = new RouteTable();
        r.add('api/sEtAll', 'post');
        expect(r.getRoutes()[0]).toBe('/post_api/setall');
    });
    it('add.verify_lowercase_/:verb_api/setall_when_route_api/getAll_and_httpVerb_all', () => {
        let r = new RouteTable();
        r.add('api/sEtAll', 'all');
        expect(r.getRoutes()[0]).toBe('/:verb_api/setall');
    });
    it('getRoutes.return_[]_when_no_routes_added', () => {
        expect(new RouteTable().getRoutes()).toEqual([]);
    });
    it('getRoutes.verify_when_array_of_routes_added', () => {
        let r = new RouteTable();
        r.add('api/q', 'get');
        r.add('api/r', 'all');
        r.add('api/r/:id', 'all');
        expect(r.getRoutes().includes('/get_api/q')).toBeTruthy();
        expect(r.getRoutes().includes('/:verb_api/r')).toBeTruthy();
        expect(r.getRoutes().includes('/:verb_api/r/:id')).toBeTruthy();
        expect(r.getRoutes().includes('/:verb_apii/r')).toBeFalsy();
    });
});