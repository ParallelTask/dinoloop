import { IUserIdentity } from '../../../../index';
import { injectable } from 'inversify';

export abstract class IRoleService {
    abstract getRole(): string;
    abstract getLoggedIn(): any;
}

@injectable()
export class RoleService implements IRoleService {

    constructor(private userIdentity: IUserIdentity) { }

    getRole(): string {
        return this.userIdentity.get('role');
    }

    getLoggedIn(): any {
        return this.userIdentity.get('loggedIn');
    }
}
