import { RequestStartMiddleWare } from '../../filter/filter';
import { IExpressResponse } from '../../types/express';
import { UserIdentity } from '../providers/user.identity';

/**
 * Sets context property to UserIdentity instance for every request start.
 * If UserPrinciple is enabled, this would be the second built-in RequestStart middleware to register
 */
export class TaskContextMiddleware extends RequestStartMiddleWare {
    invoke(req, res: IExpressResponse, next): void {
        let userIdentity = new UserIdentity();
        res.locals.dino.context = userIdentity;
        next();
    }
}
