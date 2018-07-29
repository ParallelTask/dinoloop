import {
    ApiController,
    Controller
} from '../../../../index';
import {
    NExceptionFilter,
    NExceptionFilterAsync,
    ResultFilterOne,
    ResultFilterOneAsync
} from '../middlewares/filter';
import {
    BaseExceptionFilter,
    BaseExceptionFilterAsync,
    BaseResultFilterOne,
    BaseResultFilterOneAsync
} from '../middlewares/base';

@Controller('/base-ex', {
    exceptions: [
        BaseExceptionFilter,
        BaseExceptionFilterAsync
    ],
    result: [
        BaseResultFilterOne,
        {
            useClass: BaseResultFilterOneAsync,
            data: { role: 'async-base-result-filter-admin' }
        }
    ]
})
export class BaseExceptionController extends ApiController { }
