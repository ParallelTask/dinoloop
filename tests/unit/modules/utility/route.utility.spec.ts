import { RouteUtility, FunctionUtility } from '../../index';

describe('modules.utility.route.utility.spec', () => {
    it('getNamedSegmentKeyValues.throws_TypeError_when_requestedUrl_null', () => {
        expect(() => RouteUtility.getNamedSegmentKeyValues(null, 'he')).toThrowError(TypeError);
    });
    it('getNamedSegmentKeyValues.throws_TypeError_when_requestedUrl_undefined', () => {
        expect(() => RouteUtility.getNamedSegmentKeyValues(undefined, 'he')).toThrowError(TypeError);
    });
    it('getNamedSegmentKeyValues.return_{id:45}_when_original_/get/:id_and_requested_/get/45', () => {
        let result = RouteUtility.getNamedSegmentKeyValues('/get/:id', '/get/45');
        expect(result.id).toBe('45');
    });
    it('getNamedSegmentKeyValues.return_false_when_original_/get/:id_and_requested_/get/', () => {
        let result = RouteUtility.getNamedSegmentKeyValues('/get/:id', '/get/');
        expect(result).toBeFalsy();
    });
    it('getNamedSegmentKeyValues.return_{}_when_original_/get_and_requested_/get', () => {
        let result = RouteUtility.getNamedSegmentKeyValues('/get', '/get');
        expect(result).toEqual({});
    });
    it('getNamedSegmentKeyValues.return_false_when_original_/get/:id_and_requested_/mat/45', () => {
        let result = RouteUtility.getNamedSegmentKeyValues('/get/:id', '/mat/45');
        expect(result).toBeFalsy();
    });
    it(`getNamedSegmentKeyValues.return_{user:john,album:winter_season}_
        when_original_/get/:user/fotos/:album_and_requested_/get/john/fotos/winter_season`, () => {
            let result = RouteUtility
                .getNamedSegmentKeyValues('/get/:user/fotos/:album', '/get/john/fotos/winter_season');
            expect(result.user).toBe('john');
            expect(result.album).toBe('winter_season');
        });
    it('mapSegmentsAndQueryToActionArguments.map_values_when_segment_valid_and_querystring_valid', () => {
        let queryString = {
            log: 'console',
            delay: '5'
        };
        let originalUrl = '/get/:id';
        let reqUrl = '/get/45';
        let action = (log, delay, id) => null;
        // order of returning func arg keys is important
        spyOn(FunctionUtility, 'getParamNames').and.callFake(fn => ['log', 'delay', 'id']);
        spyOn(RouteUtility, 'getNamedSegmentKeyValues').and.callFake(() => {
            return { id: '45' };
        });
        let result = RouteUtility
            .mapSegmentsAndQueryToActionArguments(originalUrl, reqUrl, queryString, action);
        expect(FunctionUtility.getParamNames).toHaveBeenCalledTimes(1);
        expect(RouteUtility.getNamedSegmentKeyValues).toHaveBeenCalledTimes(1);
        expect(result[0]).toBe('console');
        expect(result[1]).toBe('5');
        expect(result[2]).toBe('45');
    });
    it('mapSegmentsAndQueryToActionArguments.map_values_when_segment_valid_and_querystring_valid_diff_order',
        () => {
            let queryString = {
                log: 'console',
                delay: '5'
            };
            let originalUrl = '/get/:id';
            let reqUrl = '/get/45';
            let action = (delay, id, log) => null;
            // order of returning func arg keys is important
            spyOn(FunctionUtility, 'getParamNames').and.callFake(fn => ['delay', 'id', 'log']);
            spyOn(RouteUtility, 'getNamedSegmentKeyValues').and.callFake(() => {
                return { id: '45' };
            });
            let result = RouteUtility
                .mapSegmentsAndQueryToActionArguments(originalUrl, reqUrl, queryString, action);
            expect(FunctionUtility.getParamNames).toHaveBeenCalledTimes(1);
            expect(RouteUtility.getNamedSegmentKeyValues).toHaveBeenCalledTimes(1);
            expect(result[0]).toBe('5');
            expect(result[1]).toBe('45');
            expect(result[2]).toBe('console');
        });
    it('mapSegmentsAndQueryToActionArguments.map_values_when_segment_valid_and_no_querystring', () => {
        let queryString = {};
        let originalUrl = '/get/:id';
        let reqUrl = '/get/45';
        let action = (delay, id, log) => null;
        // order of returning func arg keys is important
        spyOn(FunctionUtility, 'getParamNames').and.callFake(fn => ['delay', 'id', 'log']);
        spyOn(RouteUtility, 'getNamedSegmentKeyValues').and.callFake(() => {
            return { id: '45' };
        });
        let result = RouteUtility
            .mapSegmentsAndQueryToActionArguments(originalUrl, reqUrl, queryString, action);
        expect(FunctionUtility.getParamNames).toHaveBeenCalledTimes(1);
        expect(RouteUtility.getNamedSegmentKeyValues).toHaveBeenCalledTimes(1);
        expect(result[0]).toBe(undefined);
        expect(result[1]).toBe('45');
        expect(result[2]).toBe(undefined);
    });
    it('mapSegmentsAndQueryToActionArguments.map_values_when_no_segment_and_querystring_valid', () => {
        let queryString = {
            delay: '65',
            log: 'persistent'
        };
        let originalUrl = '/get';
        let reqUrl = '/get';
        let action = (log, id, delay) => null;
        // order of returning func arg keys is important
        spyOn(FunctionUtility, 'getParamNames').and.callFake(fn => ['log', 'id', 'delay']);
        spyOn(RouteUtility, 'getNamedSegmentKeyValues').and.callFake(() => {
            return {};
        });
        let result = RouteUtility
            .mapSegmentsAndQueryToActionArguments(originalUrl, reqUrl, queryString, action);
        expect(FunctionUtility.getParamNames).toHaveBeenCalledTimes(1);
        expect(RouteUtility.getNamedSegmentKeyValues).toHaveBeenCalledTimes(1);
        expect(result[0]).toBe('persistent');
        expect(result[1]).toBe(undefined);
        expect(result[2]).toBe('65');
    });
    it('mapSegmentsAndQueryToActionArguments.map_values_when_no_url_matched_and_querystring_valid', () => {
        let queryString = {
            delay: '65',
            log: 'persistent'
        };
        let originalUrl = '/get';
        let reqUrl = '/met';
        let action = (log, id, delay) => null;
        // order of returning func arg keys is important
        spyOn(RouteUtility, 'getNamedSegmentKeyValues').and.callFake(() => false);
        let result = RouteUtility
            .mapSegmentsAndQueryToActionArguments(originalUrl, reqUrl, queryString, action);
        expect(RouteUtility.getNamedSegmentKeyValues).toHaveBeenCalledTimes(1);
        expect(result).toEqual([]);
    });
    it('mapSegmentsAndQueryToActionArguments.map_values_when_valid_segment_and_querystring_no_action_args', () => {
        let queryString = {
            delay: '65',
            log: 'persistent'
        };
        let originalUrl = '/get/:id';
        let reqUrl = '/get/45';
        let action = () => null;
        // order of returning func arg keys is important
        spyOn(FunctionUtility, 'getParamNames').and.callFake(fn => []);
        spyOn(RouteUtility, 'getNamedSegmentKeyValues').and.callFake(() => {
            return { id: 45 };
        });
        let result = RouteUtility
            .mapSegmentsAndQueryToActionArguments(originalUrl, reqUrl, queryString, action);
        expect(FunctionUtility.getParamNames).toHaveBeenCalledTimes(1);
        expect(RouteUtility.getNamedSegmentKeyValues).toHaveBeenCalledTimes(0);
        expect(result).toEqual([]);
    });
});
