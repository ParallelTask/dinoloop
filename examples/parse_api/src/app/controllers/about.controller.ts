import {
    ApiController,
    Controller,
    HttpGet,
    Async,
    Parse,
    toInteger,
    toNumber,
    toBoolean
} from '../../../../index';
import { throwException } from '../parse-handlers/handlers';
import { ControllerParseErrorMiddleware } from '../middlewares/filters';

@Controller('/about', {
    exceptions: [ControllerParseErrorMiddleware]
})
export class AboutController extends ApiController {

    // If exception is thrown by @Parse, then it bubbles up error middleware chain
    // Response will be sent by ControllerParseErrorMiddleware
    @HttpGet('/parseException/:id')
    parseException(@Parse(throwException) id: number): any {
        return {
            message: '.jpg added to photo, and id must be converted to number'
        };
    }

    // Async version
    // If exception is thrown by @Parse, then it bubbles up error middleware chain
    // Response will be sent by ControllerParseErrorMiddleware
    @Async()
    @HttpGet('/asyncParseException/:id')
    async asyncParseException(@Parse(throwException) id: number): Promise<string> {
        return '.jpg added to photo, and id must be converted to number';
    }

    // API: /toInteger/45 - should work
    // API: /toInteger/abc - throws exception
    @HttpGet('/toInteger/:id')
    toInteger(@Parse(toInteger) id: number): any {
        return {
            id: id,
            msg: 'Built-in Converter to integer'
        };
    }

    // API: /toNumber/45.234 - should work
    // API: /toNumber/abc - throws exception
    @HttpGet('/toNumber/:id')
    toNumber(@Parse(toNumber) id: number): any {
        return {
            id: id,
            msg: 'Built-in Converter to number'
        };
    }

    // API: /toBoolean/true - should work
    // API: /toBoolean/abc - throws exception
    @HttpGet('/toBoolean/:id')
    toBoolean(@Parse(toBoolean) id: boolean): any {
        return {
            id: id,
            msg: 'Built-in Converter to boolean'
        };
    }

    // Uncomment this, to verify it throws compile time error
    // @HttpGet('/nullParse/:id')
    // nullParse(@Parse(null) id: number): any {
    //     return {
    //         message: 'will throw compilation error'
    //     };
    // }
}
