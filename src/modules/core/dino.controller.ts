import { ApiController, ControllerAction } from '../controller';
import { Request, Response, NextFunction, IDinoProperties } from '../types';
import {
    RouteUtility,
    HttpUtility,
    DataUtility
} from '../utility';
import { DinoModel } from '../entities';
import { InvalidModelException } from '../builtin/exceptions';
import { IDinoController } from '../interfaces';

export class DinoController implements IDinoController {
    private controller: ApiController;
    private controllerAction: ControllerAction;

    // maps url-segments and query-strings to action arguments
    private mapSegments(action: Function, requestUrl: string): string[] {
        let req = this.controller.request;

        return RouteUtility.mapSegmentsAndQueryToActionArguments(requestUrl,
            req.path, req.query, action);
    }

    constructor(controller: ApiController,
        controllerAction: ControllerAction) {
        this.controller = controller;
        this.controllerAction = controllerAction;
    }

    // made public for unit test and not available on interface contract
    // result returned by an action method, makes it available to next middleware function
    attachResultToDino(sendsResponse: boolean, result: any): void {

        // if action is not decorated with SendsResponse
        // just capture and attach the result to dino property and invoke the next() handler
        if (sendsResponse === false) {
            // conversion required to access result property
            // which does actually exists on DinoResponse
            let dino = this.controller.dino as IDinoProperties;
            dino.result = result;
            this.controller.next();
        }
    }

    // made public for unit test and not available on interface contract
    // reads http-request body and parses the body as per the model in BindModel attribute
    // validates the object and writes back the validation errors and values to ctx.model property
    getModelFromBody(httpVerb: string): DinoModel {
        let ctx = this.controller;
        let bModel = this.controllerAction.bindsModel;
        let dinoModel = new DinoModel();

        // if (HttpUtility.hasBody(httpVerb) && !DataUtility.isUndefinedOrNull(bModel)) {
        //     dinoModel.type = bModel.model;
        //     dinoModel.value = ctx.request.body;
        //     dinoModel.errors = Validator.tryValidateWithType(ctx.request.body,
        //         bModel.model, bModel.options.stopOnError);
        //     dinoModel.isValid = dinoModel.errors.length === 0;

        //     if (bModel.options.raiseModelError) {
        //         ctx.next(new InvalidModelException(dinoModel.value, dinoModel.errors,
        //             dinoModel.type));
        //     }
        // }

        return dinoModel;
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
            let dino = this.controller.dino as IDinoProperties;
            dino.result = result;
            this.controller.next();
        };
    }

    // If controller action is synchronous - invoke this
    invoke(
        actionName: string,
        httpVerb: string,
        requestUrl: string
    ): void {

        let ctx = this.controller;
        let cta = this.controllerAction;
        let values = this.mapSegments(ctx[actionName], requestUrl);
        ctx.model = this.getModelFromBody(httpVerb);
        // If http-request has body, first parameter in action argument list
        // gets request-body injected
        if (HttpUtility.hasBody(httpVerb)) values[0] = ctx.request.body;
        let result = values.length > 0 ? ctx[actionName].apply(ctx, values) : ctx[actionName]();
        this.attachResultToDino(cta.sendsResponse, result);
    }

    // if controller action is async - invoke this
    async invokeAsync(
        actionName: string,
        httpVerb: string,
        requestUrl: string): Promise<void> {

        let ctx = this.controller;
        let cta = this.controllerAction;

        try {
            let values = this.mapSegments(ctx[actionName], requestUrl);
            ctx.model = this.getModelFromBody(httpVerb);
            // If http-request has body, first parameter in action argument list
            // gets request-body injected
            if (HttpUtility.hasBody(httpVerb)) values[0] = ctx.request.body;
            let result = values.length > 0 ?
                await ctx[actionName].apply(ctx, values)
                : await ctx[actionName]();
            this.attachResultToDino(cta.sendsResponse, result);
        } catch (ex) {
            ctx.next(ex);
        }
    }

    static create(controller: ApiController,
        controllerAction: ControllerAction): DinoController {
        return new DinoController(controller, controllerAction);
    }
}
