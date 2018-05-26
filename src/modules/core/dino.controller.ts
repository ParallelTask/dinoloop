import { ApiController } from '../controller/api.controller';
import { Request, Response, NextFunction } from '../types/express';
import { RouteUtility } from '../utility/route.utility';
import { HttpUtility } from '../utility/http.utility';
import { ObservableMiddleware } from '../filter/filter';
import { DataUtility } from '../utility/data.utility';
import { ControllerAction } from '../controller/controller.action';
import { Validator } from '../validations/validator';
import { DinoModel } from '../entities/dino.model';
import { InvalidModelException } from '../builtin/exceptions/exceptions';
import { IDinoController } from '../interfaces/idino';

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

    // made public for unit test and not available on interface method
    // result returned by an action method, makes it available to next middleware functions
    attachResultToDino(sendsResponse: boolean, observable: ObservableMiddleware, result: any): void {

        // if action is not decorated with SendsResponse/observable response
        // just capture and attach the result to dino property and invoke the next() handler
        if (sendsResponse === false && DataUtility.isUndefinedOrNull(observable)) {
            this.controller.dino.result = result;
            this.controller.next();

            // if action is decorated with observable, invoke the registered observable middleware
        } else if (!DataUtility.isUndefinedOrNull(observable)) {
            this.controller.dino.result = result;
            observable.invoke(this.controller.request, this.controller.response,
                this.controller.next, this.controller.dino);
        }
    }

    // made public for unit test and not available on interface method
    // reads http request body and parses the body as per the model in BindModel attribute
    // validates the object and writes back the validation errors and value to ctx.model property
    getModelFromBody(httpVerb: string): DinoModel {
        let ctx = this.controller;
        let bModel = this.controllerAction.bindsModel;
        let dinoModel = new DinoModel();

        if (HttpUtility.hasBody(httpVerb) && !DataUtility.isUndefinedOrNull(bModel)) {
            dinoModel.type = bModel.model;
            dinoModel.value = ctx.request.body;
            dinoModel.errors = Validator.tryValidateWithType(ctx.request.body,
                bModel.model, bModel.options.stopOnError);
            dinoModel.isValid = dinoModel.errors.length === 0;

            if (bModel.options.raiseModelError) {
                ctx.next(new InvalidModelException(dinoModel.value, dinoModel.errors,
                    dinoModel.type));
            }
        }

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
        // its better to invoke "this.dino.throw(ex)" to bubble the error to next error middleware
        // user can also perform next(err), both does the same and it just provides consistent dino api
        this.controller.dino.throw = (err: Error) => {
            this.controller.next(err);
        };

        // typically when action is decorated with @SendsResponse
        // but user still wants the result to be available for the next middlewares in the chain.
        // invoke "this.dino.proceed(result)" which adds result to dino property,
        // which is then used by result and after-action filters.
        this.controller.dino.proceed = (result: any) => {
            this.controller.dino.result = result;
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
        // If http-request has body, the first parameter in action argument
        // gets request-body injected
        if (HttpUtility.hasBody(httpVerb)) values[0] = ctx.request.body;
        let result = values.length > 0 ? ctx[actionName].apply(ctx, values) : ctx[actionName]();
        this.attachResultToDino(cta.sendsResponse, cta.observableResponse, result);
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
            // If http-request has body, the first parameter in action argument
            // gets request-body injected
            if (HttpUtility.hasBody(httpVerb)) values[0] = ctx.request.body;
            let result = values.length > 0 ?
                await ctx[actionName].apply(ctx, values)
                : await ctx[actionName]();
            this.attachResultToDino(cta.sendsResponse, cta.observableResponse, result);
        } catch (ex) {
            ctx.next(ex);
        }
    }

    static create(controller: ApiController,
        controllerAction: ControllerAction): DinoController {
        return new DinoController(controller, controllerAction);
    }
}
