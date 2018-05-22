import { Request, Response, NextFunction } from '../types/express';
import { DinoResponse } from '../entities/dino.response';
import { DinoModel } from '../entities/dino.model';

// Base class that should be extended by every controller for it work as api controller
/**
 * Every API Controller must extend this class
 */
export abstract class ApiController {
    /**
     * Express.Request
     */
    request: Request;
    /**
     * Express.Response
     */
    response: Response;
    /**
     * Express.NextFunction
     */
    next: NextFunction;
    dino: DinoResponse;
    model: DinoModel;
}
