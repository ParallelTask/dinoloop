import { IRoleService } from './role.service';
import { IUserIdentity } from '../../../../index';
import { injectable } from 'inversify';

export abstract class IOrderService {
    abstract isAllowed(): boolean;
    abstract loggedIn(): any;
}

@injectable()
export class OrderService implements IOrderService {
    constructor(
        private roleService: IRoleService,
        private userIdentity: IUserIdentity) {

    }

    isAllowed(): boolean {
        return this.userIdentity.get('allow');
    }

    loggedIn(): any {
        return this.roleService.getLoggedIn();
    }
}
