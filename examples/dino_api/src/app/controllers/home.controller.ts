import {
    ApiController,
    Controller,
    HttpGet,
    SendsResponse,
    HttpPost,
    HttpAll,
    Async,
    Deferrer
} from '../../../../index';
import { IAboutService } from '../services/about.service';
import { About } from '../model/about.model';

@Controller('/home')
export class HomeController extends ApiController {

    private name: string;

    constructor(private aboutService: IAboutService) {
        super();
        this.name = 'HomeController';
    }

    // demonstrates the firing of all request-start and request-end middlewares
    // also verifies if constructor is being invoked
    @HttpGet('/filters')
    get(): string[] {
        this.response.locals.data.push(this.name);

        return this.response.locals.data;
    }

    // verifies if .proceed is working as expected
    @SendsResponse()
    @HttpGet('/image/:id')
    imageId(id: string): void {
        setTimeout(() => {
            this.dino.proceed(`Value of id is ${id}`);
        }, 100);
    }

    // verifies if .throw is working as expected
    @SendsResponse()
    @HttpGet('/dino-throw')
    imageThrow(id: string): void {
        setTimeout(() => {
            this.dino.throw(new Error('SyncTestExceptionOne is thrown'));
        }, 100);
    }

    // verifies if err middlewareOne is handled
    @HttpGet('/sync-error-one')
    syncThrowOne(): string {
        throw new Error('SyncTestExceptionOne is thrown');
    }

    // verifies if err middlewareTwo is handled
    @HttpGet('/sync-error-two')
    syncThrowTwo(): string {
        throw new Error('SyncTestExceptionTwo is thrown');
    }

    // verifies if error-controller is fired
    @HttpGet('/error-controller')
    errorController(): string {
        throw new Error('ErrorController must handle this');
    }

    // verifies if async-await is working
    @Async()
    @HttpGet('/async-data')
    async getAsyncData(): Promise<string> {
        return await Deferrer.run<string>((resolve, reject) => {
            setTimeout(() => resolve('This is AsyncData'), 10);
        });
    }

    // verifies if async-await working via service
    @Async()
    @HttpGet('/await-about')
    async getViaAwait(): Promise<About[]> {
        return await this.aboutService.getViaPromise();
    }

    // verifies err handling in async-await pattern
    @Async()
    @HttpGet('/async-throw')
    async getUsersThrow(): Promise<string[]> {
        throw new Error('Synchronous exception thrown with @Async Attribute');
    }

    // verifies err handling in async-await pattern
    @Async()
    @HttpGet('/promise-error')
    async getViaPromiseError(): Promise<About[]> {
        return await this.aboutService.getViaPromiseError();
    }
}
