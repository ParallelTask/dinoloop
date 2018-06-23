import { Request, Response, NextFunction } from '../types';
import { ErrorController } from '../controller';
import { IDinoErrorController } from '../interfaces';

export class DinoErrorController implements IDinoErrorController {
    private controller: ErrorController;

    constructor(controller: ErrorController) {
        this.controller = controller;
    }

    patch(err: Error, req: Request, res: Response, next: NextFunction): void {
        this.controller.request = req;
        this.controller.response = res;
        this.controller.next = next;
        this.controller.error = err;
    }

    invoke(actionName: string): void {
        this.controller[actionName]();
    }

    static create(controller: ErrorController): DinoErrorController {
        return new DinoErrorController(controller);
    }
}
