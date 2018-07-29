import { injectable } from 'inversify';
import {
    ApiController,
    Controller,
    HttpGet,
    SendsResponse,
    Async
} from '../../../../index';
import { IAboutService } from '../services/about.service';
import { About } from '../model/about.model';

@injectable()
@Controller('/home')
export class HomeController extends ApiController {
    name: string;

    constructor(private aboutService: IAboutService) {
        super();
        this.name = 'HomeController';
    }

    @HttpGet('/name')
    get(): string {
        return this.name;
    }

    @Async()
    @HttpGet('/await-about')
    async getAbout(): Promise<About[]> {
        return await this.aboutService.getViaPromise();
    }

    @SendsResponse()
    @HttpGet('/image/:id')
    getId(id: string): void {
        setTimeout(() => {
            this.dino.proceed(`Value of id is ${id}`);
        }, 10);
    }
}
