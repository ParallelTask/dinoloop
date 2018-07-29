import {
    ApiController,
    Controller,
    HttpGet,
    HttpPost,
    HttpResponseException,
    HttpStatusCode,
    HttpResponseMessage
} from '../../../../index';

@Controller('/home')
export class HomeController extends ApiController {

    // verifies if built-in response middleware is working
    @HttpGet('/name')
    @HttpPost('/name')
    getName(): string {
        return 'HomeController';
    }

    // verifies if built-in response middleware is working
    @HttpGet('/get')
    get(): any {
        return {
            data: 'testing',
            role: 'admin'
        };
    }

    @HttpGet('/httpException')
    httpException(): void {
        throw new HttpResponseException<string>({
            statusCode: HttpStatusCode.internalServerError,
            content: 'TestContent'
        });
    }

    @HttpGet('/httpResponse')
    httpResponse(): HttpResponseMessage<string> {
        return new HttpResponseMessage<string>({
            statusCode: HttpStatusCode.oK,
            content: 'TestData'
        });
    }
}
