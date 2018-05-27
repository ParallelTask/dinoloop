import { IBindModelAttributeExtended } from '../types/attribute';

export class ControllerAction {
    sendsResponse?: boolean;
    bindsModel?: IBindModelAttributeExtended;
    constructor(sendsResponse: boolean,
        bindsModel: IBindModelAttributeExtended) {

        this.sendsResponse = sendsResponse;
        this.bindsModel = bindsModel;
    }

    static create(sendsResponse: boolean,
        bindsModel: IBindModelAttributeExtended): ControllerAction {
        return new ControllerAction(sendsResponse, bindsModel);
    }
}
