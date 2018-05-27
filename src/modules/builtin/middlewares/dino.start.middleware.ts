import { RequestStartMiddleware } from '../../filter/filter';

/**
 * initializes dino property on express response.locals for every request start.
 * Must be registered as first builtin RequestStart middleware
 */
export class DinoStartMiddleware extends RequestStartMiddleware {
    invoke(req, res, next): void {
        // initialize the dino object, this is critical for other middlewares to work
        res.locals.dino = {};
        next();
    }
}
