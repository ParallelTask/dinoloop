import {
    ApiController,
    Controller,
    HttpGet,
    SendsResponse,
    HttpPost,
    HttpAll
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
}
