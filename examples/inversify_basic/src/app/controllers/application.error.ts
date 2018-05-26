import { injectable } from 'inversify';
import { ErrorController } from '../../../../index';

@injectable()
export class ApplicationError extends ErrorController {
    write(): void {
        this.response.json({
            errMsg: 'Something went wrong while processing. Please try after sometime',
            status: false,
            errors: [this.error.message, this.error.name, this.error.stack],
            locals: [this.response.locals.data]
        });
    }
}
