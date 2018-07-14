import { RequestStartMiddleware } from '../../filter';
import { UserIdentity } from '../providers';
import { IDinoProperties, Response } from '../../types';

/**
 * Sets context property to UserIdentity instance for every request start.
 * If UserPrinciple enabled, this would be second built-in RequestStart middleware
 */
export class TaskContextMiddleware extends RequestStartMiddleware {
    invoke(req, res: Response, next): void {
        let dinoProperties: IDinoProperties = res.locals.dino;
        dinoProperties.context = new UserIdentity();
        next();
    }
}
