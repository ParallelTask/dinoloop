import { RequestStartMiddleware } from '../../filter/filter';
import { UserIdentity } from '../providers/user.identity';
import { IDinoProperties } from '../../types/dino.types';

/**
 * Sets context property to UserIdentity instance for every request start.
 * If UserPrinciple is enabled, this would be the second built-in RequestStart middleware to register
 */
export class TaskContextMiddleware extends RequestStartMiddleware {
    invoke(req, res, next): void {
        let dinoProperties: IDinoProperties = res.locals.dino;
        dinoProperties.context = new UserIdentity();
        next();
    }
}
