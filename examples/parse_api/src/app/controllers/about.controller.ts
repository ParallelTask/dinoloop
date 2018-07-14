import {
    ApiController,
    Controller,
    HttpGet,
    Async,
    Parse
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
}
