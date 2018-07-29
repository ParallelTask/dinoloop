import {
    ApiController,
    Controller,
    HttpGet
} from '../../../../index';
import {
    RequestMiddleware,
    RequestMiddlewareAsync,
    RequestFilter,
    LogFilterAsync
} from '../middlewares/filter';

@Controller('/index', {
    use: [
        (req, res, next) => { res.locals.data.push('This is express-ware-one'); next(); },
        (req, res, next) => { res.locals.data.push('This is express-ware-two'); next(); }
    ],
    middlewares: [
        RequestMiddleware,
        RequestMiddlewareAsync,
        {
            useClass: RequestMiddleware,
            data: { role: 'middleware-admin' }
        },
        {
            useClass: RequestMiddlewareAsync,
            data: { role: 'async-middleware-admin' }
        }
    ],
    filters: [
        RequestFilter,
        LogFilterAsync,
        {
            useClass: RequestFilter,
            data: { role: 'filter-admin' }
        },
        {
            useClass: LogFilterAsync,
            data: { role: 'async-filter-admin' }
        }
    ]
})
export class IndexController extends ApiController {

    @HttpGet('/filters')
    get(): string {
        return this.response.locals.data;
    }
}
