import {
    ApiController,
    Controller,
    HttpGet
} from '../../../../index';
import {
    NExceptionFilter,
    NExceptionFilterAsync,
    ResultFilterOne,
    ResultFilterOneAsync
} from '../middlewares/filter';

@Controller('/exception', {
    exceptions: [
        NExceptionFilter,
        NExceptionFilterAsync
    ],
    result: [
        ResultFilterOne,
        ResultFilterOneAsync,
        {
            useClass: ResultFilterOne,
            data: { role: 'result-filter-admin' }
        },
        {
            useClass: ResultFilterOneAsync,
            data: { role: 'async-result-filter-admin' }
        }
    ]
})
export class ExceptionController extends ApiController {

    @HttpGet('/result-filter')
    filters(): string[] {
        return this.response.locals.data;
    }

    @HttpGet('/n-exception')
    get(): string {
        throw new Error('NExceptionFilter thrown');
    }

    @HttpGet('/n-exception-async')
    getN(): string {
        throw new Error('NExceptionFilterAsync thrown');
    }

    @HttpGet('/exception-one')
    getTestExceptionOne(): string {
        throw new Error('SyncTestExceptionOne is thrown');
    }

    @HttpGet('/exception-global')
    globalException(): string {
        throw new Error('GlobalTestException is thrown');
    }
}
