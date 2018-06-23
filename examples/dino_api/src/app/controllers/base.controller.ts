import {
    ApiController,
    Controller,
    HttpGet
} from '../../../../index';
import {
    BaseRequestMiddleware,
    BaseRequestMiddlewareAsync,
    BaseRequestFilter,
    BaseRequestFilterAsync
} from '../middlewares/base';

@Controller('/base', {
    use: [
        (req, res, next) => { res.locals.data.push('This is base-express-ware-one'); next(); },
        (req, res, next) => { res.locals.data.push('This is base-express-ware-two'); next(); }
    ],
    middlewares: [
        BaseRequestMiddleware,
        {
            useClass: BaseRequestMiddlewareAsync,
            data: { role: 'base-middleware-async-admin' }
        }],
    filters: [
        BaseRequestFilter,
        {
            useClass: BaseRequestFilterAsync,
            data: { role: 'base-filter-async-admin' }
        }
    ]
})
export class BaseController extends ApiController {

    @HttpGet('/name')
    get(): string {
        return 'BaseController';
    }
}
