import { ObservableMiddleware } from '../filter/filter';
import { IBindModelAttributeExtended } from '../types/attribute';

export class ControllerAction {
    sendsResponse?: boolean;
    bindsModel?: IBindModelAttributeExtended;
    observableResponse?: ObservableMiddleware;

    constructor(sendsResponse: boolean,
        observableResponse: ObservableMiddleware,
        bindsModel: IBindModelAttributeExtended) {
        this.sendsResponse = sendsResponse;
        this.observableResponse = observableResponse;
        this.bindsModel = bindsModel;
    }

    static create(sendsResponse: boolean,
        observableResponse: ObservableMiddleware,
        bindsModel: IBindModelAttributeExtended): ControllerAction {
        return new ControllerAction(sendsResponse, observableResponse, bindsModel);
    }
}