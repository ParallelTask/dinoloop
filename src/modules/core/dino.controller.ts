import { ApiController, ControllerAction } from '../controller';
import {
    Request,
    Response,
    NextFunction,
    IDinoProperties,
    IKeyValuePair
} from '../types';
import {
    RouteUtility,
    HttpUtility,
    DataUtility,
    FunctionUtility
} from '../utility';
import { DinoModel } from '../entities';
import { IDinoController } from '../interfaces';

export class DinoController implements IDinoController {

    private controller: ApiController;
    private controllerAction: ControllerAction;

    constructor(controller: ApiController,
        controllerAction: ControllerAction) {
        this.controller = controller;
        this.controllerAction = controllerAction;
    }

    // made public for unit-test, not available on contract
    // gets query string object and maps the value with corresponding key
    // for (@QueryParam() id) returns { id: 45 }
    getQueryParams(): any {
        let queryParams =
            this.controllerAction
                .actionAttributes
                .actionArguments
                .map(x => x.isQueryParam ? x.key : null)
                .filter(x => !DataUtility.isNull(x));

        let queryString = {};

        for (const queryParam of queryParams) {
            // create new object, key = value
            queryString[queryParam] =
                this.controller.request.query[queryParam];
        }

        return queryString;
    }

    // made public for unit-test, not available on contract
    // maps url-segments and query-strings
    mapSegments(
        params: string[],
        requestUrl: string): IKeyValuePair[] {
        return RouteUtility.mapSegmentsAndQueryToActionArguments(requestUrl,
            this.controller.request.path, this.getQueryParams(), params);
    }

    // made public for unit-test, not available on contract
    // invokes handlers for segments and query params
    raiseActionParamsHandlers(values: IKeyValuePair[]): void {
        let attr = this.controllerAction.actionAttributes;

        // if request has http-body then ignore first param
        // since it is handled by .handleHttpBody()
        const params = HttpUtility.hasBody(attr.httpVerb) ?
            attr.actionArguments.filter(x => x.paramIndex !== 0) :
            attr.actionArguments;

        for (const arg of params) {
            for (const value of values) {
                if (arg.key === value.key) {
                    value.value = arg.handler({
                        action: arg.action,
                        controller: arg.controller,
                        key: arg.key,
                        data: arg.data,
                        value: value.value
                    }, this.controller.model);
                }
            }
        }
    }

    // made public for unit-test, not available on contract
    // invokes handler only for http-body
    handleHttpBody(values: IKeyValuePair[]): void {
        let attr = this.controllerAction.actionAttributes;

        // If http-request has body, first parameter gets request-body injected
        if (HttpUtility.hasBody(attr.httpVerb)) {

            // http-body injected to first parameter i.e. index == 0
            let arg =
                attr.actionArguments
                    .filter(x => x.paramIndex === 0)[0];
            values[0] = { key: arg.key };
            values[0].value = arg.handler({
                action: arg.action,
                controller: arg.controller,
                key: arg.key,
                data: arg.data,
                value: this.controller.request.body
            }, this.controller.model);
        }
    }

    // made public for unit test and not available on interface contract
    // result returned by action method, makes available to next middleware
    attachResultToDino(sendsResponse: boolean, result: any): void {

        // if action is not decorated with SendsResponse
        // just capture and attach the result to dino property
        if (sendsResponse === false) {
            // conversion is required to access result property,
            // which actually exists on DinoResponse
            let dino: IDinoProperties = this.controller.dino;
            dino.result = result;
            this.controller.next();
        }
    }

    patch(req: Request, res: Response, next: NextFunction): void {

        this.controller.request = req;
        this.controller.response = res;
        this.controller.next = next;
        this.controller.dino = res.locals.dino;
        this.controller.model = new DinoModel();

        // typically when action is decorated with @SendsResponse
        // and if any error occurred inside the callback processing handler,
        // its better to invoke "this.dino.throw(ex)" in action methods to bubble the error
        // onto next error middleware. user can also perform next(err),
        // both does the same and .throw() just provides consistent dino api
        this.controller.dino.throw = (err: Error) => {
            this.controller.next(err);
        };

        // typically when action is decorated with @SendsResponse
        // and user still wants the result to be available for the next middlewares in the chain.
        // invoke "this.dino.proceed(result)" which adds result to dino property,
        // which is then used by result filters.
        this.controller.dino.proceed = (result: any) => {
            // conversion required to access result property
            // which does actually exists on DinoResponse
            let dino: IDinoProperties = this.controller.dino;
            dino.result = result;
            this.controller.next();
        };
    }

    invokeSetUp(actionName: string): IKeyValuePair[] {
        let ctx = this.controller;
        let cta = this.controllerAction;
        let values: IKeyValuePair[] = [];
        let params = FunctionUtility.getParamNames(ctx[actionName]);

        if (params.length > 0) {
            values =
                this.mapSegments(params, cta.actionAttributes.route);
            this.handleHttpBody(values);
            this.raiseActionParamsHandlers(values);
        }

        return values;
    }

    // If controller action is synchronous - invoke this
    invoke(actionName: string): void {

        let ctx = this.controller;
        let values: IKeyValuePair[] = this.invokeSetUp(actionName);

        let result = values.length > 0
            ? ctx[actionName].apply(ctx, values.map(val => val.value)) : ctx[actionName]();
        this.attachResultToDino(this.controllerAction.actionAttributes.sendsResponse, result);
    }

    // if controller action is async - invoke this
    async invokeAsync(actionName: string): Promise<void> {
        try {
            let ctx = this.controller;
            let values: IKeyValuePair[] = this.invokeSetUp(actionName);

            let result = values.length > 0 ?
                await ctx[actionName].apply(ctx, values.map(val => val.value))
                : await ctx[actionName]();
            this.attachResultToDino(this.controllerAction.actionAttributes.sendsResponse, result);
        } catch (ex) {
            this.controller.next(ex);
        }
    }

    static create(controller: ApiController,
        controllerAction: ControllerAction): DinoController {
        return new DinoController(controller, controllerAction);
    }
}
