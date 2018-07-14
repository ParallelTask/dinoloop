import { Request, Response, NextFunction } from '../types';
import { DinoResponse, DinoModel } from '../entities';

// Base class that should be extended by every controller
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
    /**
     * Dinoloop properties
     */
    dino: DinoResponse;
    /**
     * Validations set by @Parse handlers are injected into this property
     */
    model: DinoModel;
}
