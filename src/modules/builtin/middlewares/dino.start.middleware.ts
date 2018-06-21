import { RequestStartMiddleware } from '../../filter';
import { Response } from '../../types';
/**
 * initializes dino property on express response.locals for every request start.
 * Must be registered as first builtin RequestStart middleware
 */
export class DinoStartMiddleware extends RequestStartMiddleware {
    invoke(req, res: Response, next): void {
        // initialize the dino object, this is critical for other middlewares to work
        res.locals.dino = {};
        next();
    }
}
