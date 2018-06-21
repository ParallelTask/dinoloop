import { IUserIdentity } from '../../providers';
import { DataUtility } from '../../utility';

/**
 * UserIdentity principal context object
 */
export class UserIdentity extends IUserIdentity {

    private data = {};

    constructor() {
        super();
    }

    set(key: string, val: any): void {
        this.data[key] = val;
    }

    get(key: string): any {
        return this.data[key];
    }

    contains(key: string): boolean {
        return !(DataUtility.isUndefined(this.data[key]) &&
            this.data.hasOwnProperty(key) === false);
    }

    clear(): void {
        this.data = {};
    }

    remove(key: string): void {
        delete this.data[key];
    }
}
