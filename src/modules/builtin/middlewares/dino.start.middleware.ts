import { RequestStartMiddleWare } from '../../filter/filter';

/**
 * Sets/initializes dino property on express's response.locals for every request start.
 * Must always be registered as first builtin requestStart middleware
 */
export class DinoStartMiddleware extends RequestStartMiddleWare {
    invoke(req, res, next): void {
        // initialize the dino object, this is critical for other middlewares to work
        res.locals.dino = {};
        next();
    }
}