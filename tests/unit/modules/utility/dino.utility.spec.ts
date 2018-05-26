import { DinoUtility, IMiddlewareProvider } from '../../index';
import {
    MiddlewareFake, MiddlewareAsyncFake,
    RequestStartMiddlewareFake,
    RequestStartMiddlewareAsyncFake,
    RequestEndMiddlewareFake,
    RequestEndMiddlewareAsyncFake,
    ActionFilterFake,
    ActionFilterAsyncFake,
    ResultFilterFake,
    ResultFilterAsyncFake,
    ErrorControllerFake,
    ErrorMiddlewareFake,
    ErrorMiddlewareAsyncFake,
    ObservableMiddlewareFake,
    ExceptionFilterFake,
    ExceptionFilterAsyncFake,
    ApiControllerFake
} from '../../../fakes/index';

describe('modules.utility.dino.utility.spec', () => {
    it('isSyncMiddleWare.throws_TypeError_when_undefined', () => {
        expect(() => DinoUtility.isSyncMiddleWare(undefined)).toThrowError(TypeError);
    });
    it('isSyncMiddleWare.throws_TypeError_when_null', () => {
        expect(() => DinoUtility.isSyncMiddleWare(null)).toThrowError(TypeError);
    });
    it('isSyncMiddleWare.return_false_when_function', () => {
        let result = DinoUtility.isSyncMiddleWare(() => 45);
        expect(result).toBeFalsy();
    });
    it('isSyncMiddleWare.return_false_when_Func', () => {
        let result = DinoUtility.isSyncMiddleWare(String);
        expect(result).toBeFalsy();
    });
    it('isSyncMiddleWare.return_true_when_MiddlewareFake', () => {
        let result = DinoUtility.isSyncMiddleWare(MiddlewareFake);
        expect(result).toBeTruthy();
    });
    it('isSyncMiddleWare.return_false_when_MiddlewareAsyncFake', () => {
        let result = DinoUtility.isSyncMiddleWare(MiddlewareAsyncFake);
        expect(result).toBeFalsy();
    });
    it('isAsyncMiddleWare.return_true_when_MiddlewareAsyncFake', () => {
        let result = DinoUtility.isAsyncMiddleWare(MiddlewareAsyncFake);
        expect(result).toBeTruthy();
    });
    it('isAsyncMiddleWare.return_false_when_MiddlewareFake', () => {
        let result = DinoUtility.isAsyncMiddleWare(MiddlewareFake);
        expect(result).toBeFalsy();
    });
    it('isSyncRequestStartMiddleware.return_true_when_RequestStartMiddlewareFake', () => {
        let result = DinoUtility.isSyncRequestStartMiddleware(RequestStartMiddlewareFake);
        expect(result).toBeTruthy();
    });
    it('isSyncRequestStartMiddleware.return_false_when_MiddlewareFake', () => {
        let result = DinoUtility.isSyncRequestStartMiddleware(MiddlewareFake);
        expect(result).toBeFalsy();
    });
    it('isAsyncRequestStartMiddleware.return_true_when_RequestStartMiddlewareAsyncFake',
        () => {
            let result = DinoUtility.isAsyncRequestStartMiddleware(RequestStartMiddlewareAsyncFake);
            expect(result).toBeTruthy();
        });
    it('isAsyncRequestStartMiddleware.return_false_when_MiddlewareFake', () => {
        let result = DinoUtility.isAsyncRequestStartMiddleware(MiddlewareFake);
        expect(result).toBeFalsy();
    });
    it('isSyncRequestEndMiddleware.return_true_when_RequestEndMiddlewareFake', () => {
        let result = DinoUtility.isSyncRequestEndMiddleware(RequestEndMiddlewareFake);
        expect(result).toBeTruthy();
    });
    it('isSyncRequestEndMiddleware.return_false_when_MiddlewareFake', () => {
        let result = DinoUtility.isSyncRequestEndMiddleware(MiddlewareFake);
        expect(result).toBeFalsy();
    });
    it('isAsyncRequestEndMiddleware.return_true_when_RequestEndMiddlewareFake', () => {
        let result = DinoUtility.isAsyncRequestEndMiddleware(RequestEndMiddlewareAsyncFake);
        expect(result).toBeTruthy();
    });
    it('isAsyncRequestEndMiddleware.return_false_when_MiddlewareFake', () => {
        let result = DinoUtility.isAsyncRequestEndMiddleware(MiddlewareFake);
        expect(result).toBeFalsy();
    });
    it('isSyncActionFilter.return_true_when_ActionFilterFake', () => {
        let result = DinoUtility.isSyncActionFilter(ActionFilterFake);
        expect(result).toBeTruthy();
    });
    it('isSyncActionFilter.return_false_when_MiddlewareFake', () => {
        let result = DinoUtility.isSyncActionFilter(MiddlewareFake);
        expect(result).toBeFalsy();
    });
    it('isAsyncActionFilter.return_true_when_ActionFilterAsyncFake', () => {
        let result = DinoUtility.isAsyncActionFilter(ActionFilterAsyncFake);
        expect(result).toBeTruthy();
    });
    it('isAsyncActionFilter.return_false_when_MiddlewareFake', () => {
        let result = DinoUtility.isAsyncActionFilter(MiddlewareFake);
        expect(result).toBeFalsy();
    });
    it('isSyncResultFilter.return_true_when_ResultFilterFake', () => {
        let result = DinoUtility.isSyncResultFilter(ResultFilterFake);
        expect(result).toBeTruthy();
    });
    it('isSyncResultFilter.return_false_when_MiddlewareFake', () => {
        let result = DinoUtility.isSyncResultFilter(MiddlewareFake);
        expect(result).toBeFalsy();
    });
    it('isAsyncResultFilter.return_true_when_ResultFilterAsyncFake', () => {
        let result = DinoUtility.isAsyncResultFilter(ResultFilterAsyncFake);
        expect(result).toBeTruthy();
    });
    it('isAsyncResultFilter.return_false_when_MiddlewareFake', () => {
        let result = DinoUtility.isAsyncResultFilter(MiddlewareFake);
        expect(result).toBeFalsy();
    });
    it('isErrorController.return_true_when_ErrorControllerFake', () => {
        let result = DinoUtility.isErrorController(ErrorControllerFake);
        expect(result).toBeTruthy();
    });
    it('isErrorController.return_false_when_MiddlewareFake', () => {
        let result = DinoUtility.isErrorController(MiddlewareFake);
        expect(result).toBeFalsy();
    });
    it('isSyncErrorMiddleware.return_true_when_ErrorMiddlewareFake', () => {
        let result = DinoUtility.isSyncErrorMiddleware(ErrorMiddlewareFake);
        expect(result).toBeTruthy();
    });
    it('isSyncErrorMiddleware.return_false_when_MiddlewareFake', () => {
        let result = DinoUtility.isSyncErrorMiddleware(MiddlewareFake);
        expect(result).toBeFalsy();
    });
    it('isAsyncErrorMiddleware.return_true_when_ErrorMiddlewareAsyncFake', () => {
        let result = DinoUtility.isAsyncErrorMiddleware(ErrorMiddlewareAsyncFake);
        expect(result).toBeTruthy();
    });
    it('isAsyncErrorMiddleware.return_false_when_MiddlewareFake', () => {
        let result = DinoUtility.isAsyncErrorMiddleware(MiddlewareFake);
        expect(result).toBeFalsy();
    });
    it('isObservableMiddleware.return_true_when_ObservableMiddlewareFake', () => {
        let result = DinoUtility.isObservableMiddleware(ObservableMiddlewareFake);
        expect(result).toBeTruthy();
    });
    it('isObservableMiddleware.return_false_when_MiddlewareFake', () => {
        let result = DinoUtility.isObservableMiddleware(MiddlewareFake);
        expect(result).toBeFalsy();
    });
    it('isSyncExceptionFilter.return_true_when_ExceptionFilterFake', () => {
        let result = DinoUtility.isSyncExceptionFilter(ExceptionFilterFake);
        expect(result).toBeTruthy();
    });
    it('isSyncExceptionFilter.return_false_when_MiddlewareFake', () => {
        let result = DinoUtility.isSyncExceptionFilter(MiddlewareFake);
        expect(result).toBeFalsy();
    });
    it('isAsyncExceptionFilter.return_true_when_ExceptionFilterAsyncFake', () => {
        let result = DinoUtility.isAsyncExceptionFilter(ExceptionFilterAsyncFake);
        expect(result).toBeTruthy();
    });
    it('isAsyncExceptionFilter.return_false_when_MiddlewareFake', () => {
        let result = DinoUtility.isAsyncExceptionFilter(MiddlewareFake);
        expect(result).toBeFalsy();
    });
    it('isApiController.return_true_when_ApiControllerFake', () => {
        let result = DinoUtility.isApiController(ApiControllerFake);
        expect(result).toBeTruthy();
    });
    it('isApiController.return_false_when_MiddlewareFake', () => {
        let result = DinoUtility.isApiController(MiddlewareFake);
        expect(result).toBeFalsy();
    });
});
