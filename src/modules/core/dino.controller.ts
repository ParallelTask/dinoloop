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
    DataUtility
} from '../utility';
import { DinoModel } from '../entities';
import { IDinoController } from '../interfaces';

export class DinoController implements IDinoController {
    private controller: ApiController;
    private controllerAction: ControllerAction;

    // maps url-segments and query-strings
    private mapSegments(
        actionName: Function,
        requestUrl: string): IKeyValuePair[] {

        let req = this.controller.request;
        let queryParams =
            this.controllerAction
                .actionAttributes
                .actionArguments
                .map(x => x.isQueryParam ? x.key : null)
                .filter(x => !DataUtility.isNull(x));

        let queryString = {};

        for (const queryParam of queryParams) {
            // We are assigning key = value
            queryString[queryParam] = req.query[queryParam];
        }

        return RouteUtility.mapSegmentsAndQueryToActionArguments(requestUrl,
            req.path, queryString, actionName);
    }

    constructor(controller: ApiController,
        controllerAction: ControllerAction) {
        this.controller = controller;
        this.controllerAction = controllerAction;
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

    // If controller action is synchronous - invoke this
    invoke(actionName: string): void {

        let ctx = this.controller;
        let cta = this.controllerAction;
        let values =
            this.mapSegments(ctx[actionName], cta.actionAttributes.route);

        // If http-request has body, first parameter gets request-body injected
        if (HttpUtility.hasBody(cta.actionAttributes.httpVerb)
            && values.length > 0) {
            values[0].value = ctx.request.body;
        }

        for (const arg of cta.actionAttributes.actionArguments) {
            for (const value of values) {
                if (arg.key === value.key) {
                    value.value = arg.handler({
                        action: arg.action,
                        controller: arg.controller,
                        key: arg.key,
                        data: arg.data,
                        value: value.value
                    }, ctx.model);
                }
            }
        }

        let result = values.length > 0
            ? ctx[actionName].apply(ctx, values.map(val => val.value)) : ctx[actionName]();
        this.attachResultToDino(cta.actionAttributes.sendsResponse, result);
    }

    // if controller action is async - invoke this
    async invokeAsync(actionName: string): Promise<void> {

        let ctx = this.controller;
        let cta = this.controllerAction;
        let values =
            this.mapSegments(ctx[actionName], cta.actionAttributes.route);

        // If http-request has body, first parameter gets request-body injected
        if (HttpUtility.hasBody(cta.actionAttributes.httpVerb)
            && values.length > 0) {
            values[0].value = ctx.request.body;
        }

        try {

            for (const arg of cta.actionAttributes.actionArguments) {
                for (const value of values) {
                    if (arg.key === value.key) {
                        value.value = arg.handler({
                            action: arg.action,
                            controller: arg.controller,
                            key: arg.key,
                            data: arg.data,
                            value: value.value
                        }, ctx.model);
                    }
                }
            }

            let result = values.length > 0 ?
                await ctx[actionName].apply(ctx, values.map(val => val.value))
                : await ctx[actionName]();
            this.attachResultToDino(cta.actionAttributes.sendsResponse, result);
        } catch (ex) {
            ctx.next(ex);
        }
    }

    static create(controller: ApiController,
        controllerAction: ControllerAction): DinoController {
        return new DinoController(controller, controllerAction);
    }
}
