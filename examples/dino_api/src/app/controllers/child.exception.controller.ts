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
import { BaseExceptionController } from './base.exception.controller';

@Controller('/child', {
    exceptions: [
        NExceptionFilter,
        NExceptionFilterAsync
    ],
    result: [
        ResultFilterOneAsync,
        {
            useClass: ResultFilterOne,
            data: { role: 'result-child-filter-admin' }
        }
    ]
})
export class ChildExceptionController extends BaseExceptionController {

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

    @HttpGet('/base-exception')
    getBase(): string {
        throw new Error('BaseExceptionFilter thrown');
    }

    @HttpGet('/base-exception-async')
    getBaseException(): string {
        throw new Error('BaseExceptionFilterAsync thrown');
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
