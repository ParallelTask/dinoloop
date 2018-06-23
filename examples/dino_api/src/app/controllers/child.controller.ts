import { BaseController } from './base.controller';
import { Controller, HttpGet } from '../../../../index';
import {
    RequestMiddleware,
    RequestFilter,
    LogFilterAsync,
    RequestMiddlewareAsync
} from '../middlewares/filter';

@Controller('/child', {
    use: [
        (req, res, next) => { res.locals.data.push('This is child-express-ware-one'); next(); },
        (req, res, next) => { res.locals.data.push('This is child-express-ware-two'); next(); }
    ],
    middlewares: [
        RequestMiddleware,
        {
            useClass: RequestMiddlewareAsync,
            data: { role: 'child-middleware-async-admin' }
        }
    ],
    filters: [RequestFilter, LogFilterAsync]
})
export class ChildController extends BaseController {

    // demonstrates the firing of all filters decorated on controller level
    @HttpGet('/filters')
    filters(): string[] {
        return this.response.locals.data;
    }
}
