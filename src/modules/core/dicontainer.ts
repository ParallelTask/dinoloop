import { DataUtility } from '../utility/data.utility';
import { IDIContainer } from '../interfaces/idino';

export class DIContainer implements IDIContainer {
    constructor(private injector: any, private cb: any) { }

    // resolve the component from the di container
    // If no resolve callback is registered, that means no DI framework is configured.
    // for such cases just instantiate the component with 'new operator'.
    // this flexibility is added to make it work without DI framework
    resolve<T>(type: any): T {
        return (!DataUtility.isUndefinedOrNull(this.cb)) ?
            this.cb(this.injector, type) : new type();
    }

    static create(injector: any, cb: any): DIContainer {
        return new DIContainer(injector, cb);
    }
}