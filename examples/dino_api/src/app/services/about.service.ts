import { About } from '../model/about.model';
import { Deferrer } from '../../../../index';
import { Injectable } from 'injection-js';
import { IDateService } from './date.service';

export abstract class IAboutService {
    abstract async getViaPromise(): Promise<About[]>;
    abstract async getViaPromiseError(): Promise<About[]>;
}

@Injectable()
export class AboutService implements IAboutService {

    constructor(private dateService: IDateService) { }

    async getViaPromise(): Promise<About[]> {
        return await Deferrer.run<About[]>((resolve, reject) => {
            setTimeout(() => resolve([
                new About(),
                new About()
            ]), 10);
        });
    }

    async getViaPromiseError(): Promise<About[]> {
        return await Deferrer.run<About[]>((resolve, reject) => {
            setTimeout(() => reject(new Error('TestThrown from AboutService: getViaPromiseError()')), 10);
        });
    }
}
