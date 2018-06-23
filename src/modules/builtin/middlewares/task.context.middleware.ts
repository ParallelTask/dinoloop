import { RequestStartMiddleware } from '../../filter';
import { UserIdentity } from '../providers';
import { IDinoProperties, Response } from '../../types';

/**
 * Sets context property to UserIdentity instance for every request start.
 * If UserPrinciple is enabled, this would be the second built-in RequestStart middleware to register
 */
export class TaskContextMiddleware extends RequestStartMiddleware {
    invoke(req, res: Response, next): void {
        let dinoProperties: IDinoProperties = res.locals.dino;
        dinoProperties.context = new UserIdentity();
        next();
    }
}
