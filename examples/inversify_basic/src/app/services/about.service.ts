import { injectable } from 'inversify';
import { Deferrer } from '../../../../index';
import { About } from '../model/about.model';

@injectable()
export abstract class IAboutService {
    abstract async getViaPromise(): Promise<About[]>;
    abstract async getViaPromiseError(): Promise<About[]>;
}

@injectable()
export class AboutService implements IAboutService {
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
