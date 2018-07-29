import {
    ApiController,
    Controller,
    SendsResponse,
    HttpPost
} from '../../../../index';
import { IOrderService } from '../services/order.service';
import {
    LogMiddleware,
    RequestFilter,
    JsonFilter,
    NException
} from '../services/middleware';
import { IRoleService } from '../services/role.service';
import { injectable } from 'inversify';

@injectable()
@Controller('/home', {
    middlewares: [LogMiddleware],
    filters: [RequestFilter],
    exceptions: [NException],
    result: [JsonFilter]
})
export class HomeController extends ApiController {

    constructor(
        private roleService: IRoleService,
        private orderService: IOrderService) {
        super();
    }

    @SendsResponse()
    @HttpPost('/name')
    getName(body: any): void {
        setTimeout(() => {
            this.dino.proceed({
                role: this.roleService.getRole(),
                logged: this.orderService.loggedIn(),
                isAllowed: this.orderService.isAllowed()
            });
        }, 20000);
    }
}
