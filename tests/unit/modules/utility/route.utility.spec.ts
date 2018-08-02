import {
    RouteUtility,
    FunctionUtility
} from '../../index';

describe('modules.utility.route.utility.spec', () => {
    it('getNamedSegmentKeyValues.throws_TypeError_when_originalUri_null', () => {
        expect(() => RouteUtility.getNamedSegmentKeyValues(null, 'he')).toThrowError(TypeError);
    });
    it('getNamedSegmentKeyValues.throws_TypeError_when_originalUri_undefined', () => {
        expect(() => RouteUtility.getNamedSegmentKeyValues(undefined, 'he')).toThrowError(TypeError);
    });
    it('getNamedSegmentKeyValues.return_{}_when_requestedUri_null', () => {
        let result = RouteUtility.getNamedSegmentKeyValues('/get/:id', null);
        expect(result).toEqual({});
    });
    it('getNamedSegmentKeyValues.return_{}_when_requestedUri_undefined', () => {
        let result = RouteUtility.getNamedSegmentKeyValues('/get/:id', undefined);
        expect(result).toEqual({});
    });
    it('getNamedSegmentKeyValues.return_{id:45}_when_/get/:id_and_requested_/get/45', () => {
        let result = RouteUtility.getNamedSegmentKeyValues('/get/:id', '/get/45');
        expect(result.id).toBe('45');
    });
    it('getNamedSegmentKeyValues.return_{}_when_/get/:id_and_requested_/get/', () => {
        let result = RouteUtility.getNamedSegmentKeyValues('/get/:id', '/get/');
        expect(result).toEqual({});
    });
    it('getNamedSegmentKeyValues.return_{}_when_/get_and_requested_/get', () => {
        let result = RouteUtility.getNamedSegmentKeyValues('/get', '/get');
        expect(result).toEqual({});
    });
    it('getNamedSegmentKeyValues.return_false_when_/get/:id_and_requested_/mat/45', () => {
        let result = RouteUtility.getNamedSegmentKeyValues('/get/:id', '/mat/45');
        expect(result).toEqual({});
    });
    it(`getNamedSegmentKeyValues.return_{user:john,album:winter_season}_
        when_/get/:user/fotos/:album_and_requested_/get/john/fotos/winter_season`, () => {
            let result = RouteUtility
                .getNamedSegmentKeyValues('/get/:user/fotos/:album', '/get/john/fotos/winter_season');
            expect(result.user).toBe('john');
            expect(result.album).toBe('winter_season');
        });
    it('mapSegmentsAndQueryToActionArguments.map_values_when_segment_and_querystring_exists', () => {
        let queryString = {
            log: 'console',
            delay: '5'
        };
        let originalUrl = '/get/:id';
        let reqUrl = '/get/45';
        let testKeys = ['log', 'delay', 'id'];
        // order of returning func arg keys is important
        spyOn(FunctionUtility, 'getParamNames').and.callFake(fn => testKeys);
        spyOn(RouteUtility, 'getNamedSegmentKeyValues').and.callFake(() => {
            return { id: '45' };
        });
        let result = RouteUtility
            .mapSegmentsAndQueryToActionArguments(originalUrl, reqUrl, queryString, testKeys);
        expect(result[0].key).toBe(testKeys[0]);
        expect(result[0].value).toBe('console');
        expect(result[1].key).toBe(testKeys[1]);
        expect(result[1].value).toBe('5');
        expect(result[2].key).toBe(testKeys[2]);
        expect(result[2].value).toBe('45');
    });
    it('mapSegmentsAndQueryToActionArguments.map_values_when_segment_and_querystring_exists_param_order_diff',
        () => {
            let queryString = {
                log: 'console',
                delay: '5'
            };
            let originalUrl = '/get/:id';
            let reqUrl = '/get/45';
            let testKeys = ['delay', 'id', 'log'];
            // order of returning func arg keys is important
            spyOn(FunctionUtility, 'getParamNames').and.callFake(fn => testKeys);
            spyOn(RouteUtility, 'getNamedSegmentKeyValues').and.callFake(() => {
                return { id: '45' };
            });
            let result = RouteUtility
                .mapSegmentsAndQueryToActionArguments(originalUrl, reqUrl, queryString, testKeys);
            expect(result[0].key).toBe(testKeys[0]);
            expect(result[0].value).toBe('5');
            expect(result[1].key).toBe(testKeys[1]);
            expect(result[1].value).toBe('45');
            expect(result[2].key).toBe(testKeys[2]);
            expect(result[2].value).toBe('console');
        });
    it('mapSegmentsAndQueryToActionArguments.map_values_when_segment_exists_and_no_querystring', () => {
        let queryString = {};
        let originalUrl = '/get/:id';
        let reqUrl = '/get/45';
        let testKeys = ['delay', 'id', 'log'];
        // order of returning func arg keys is important
        spyOn(FunctionUtility, 'getParamNames').and.callFake(fn => testKeys);
        spyOn(RouteUtility, 'getNamedSegmentKeyValues').and.callFake(() => {
            return { id: '45' };
        });
        let result = RouteUtility
            .mapSegmentsAndQueryToActionArguments(originalUrl, reqUrl, queryString, testKeys);
        expect(result[0].key).toBe(testKeys[0]);
        expect(result[0].value).toBe(undefined);
        expect(result[1].key).toBe(testKeys[1]);
        expect(result[1].value).toBe('45');
        expect(result[2].key).toBe(testKeys[2]);
        expect(result[2].value).toBe(undefined);
    });
    it('mapSegmentsAndQueryToActionArguments.map_values_when_no_segment_and_querystring_exists', () => {
        let queryString = {
            delay: '65',
            log: 'persistent'
        };
        let originalUrl = '/get';
        let reqUrl = '/get';
        let testKeys = ['log', 'id', 'delay'];
        // order of returning func arg keys is important
        spyOn(FunctionUtility, 'getParamNames').and.callFake(fn => testKeys);
        spyOn(RouteUtility, 'getNamedSegmentKeyValues').and.callFake(() => {
            return {};
        });
        let result = RouteUtility
            .mapSegmentsAndQueryToActionArguments(originalUrl, reqUrl, queryString, testKeys);
        expect(result[0].key).toBe(testKeys[0]);
        expect(result[0].value).toBe(queryString.log);
        expect(result[1].key).toBe(testKeys[1]);
        expect(result[1].value).toBe(undefined);
        expect(result[2].key).toBe(testKeys[2]);
        expect(result[2].value).toBe(queryString.delay);
    });
    it('mapSegmentsAndQueryToActionArguments.map_values_when_segment_n_querystring_exists_no_action_params',
        () => {
            let queryString = {
                delay: '65',
                log: 'persistent'
            };
            let originalUrl = '/get/:id';
            let reqUrl = '/get/45';
            spyOn(RouteUtility, 'getNamedSegmentKeyValues').and.callFake(() => {
                return { id: 45 };
            });
            let result = RouteUtility
                .mapSegmentsAndQueryToActionArguments(originalUrl, reqUrl, queryString, []);
            expect(RouteUtility.getNamedSegmentKeyValues).toHaveBeenCalledTimes(0);
            expect(result).toEqual([]);
        });
});
