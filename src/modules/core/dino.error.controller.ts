import { Request, Response, NextFunction } from '../types/express';
import { ErrorController } from '../controller/error.controller';
import { IDinoErrorController } from '../interfaces/idino';

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