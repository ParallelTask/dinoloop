import { ErrorController } from '../../../../index';

// When any internal server error occurs, this would be the last err handler.
// so make sure to return the custom response
export class ServerErrorController extends ErrorController {
    // This is the default method executes on 500 error
    internalServerError(): void {
        this.response.json({
            errMsg: 'Something went wrong while processing the request. Please try after sometime',
            status: false,
            errors: [this.error.message, this.error.name, this.error.stack],
            locals: this.response.locals.data
        });
    }
}
